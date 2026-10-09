const express = require("express");
const db = require("../lib/db");
const auth = require("../lib/auth");
const { hashPassword, passwordProblem } = require("../lib/password");

const router = express.Router();

router.use(auth.requirePermission("users.manage"));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });

const listUsers = async () => {
  const rows = await db.query(
    `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.last_login_at,
            u.created_at, r.name AS role_name, r.permissions AS role_permissions,
            r.is_system AS role_is_system
     FROM users u JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at`,
  );
  return rows.map(auth.toPublicUser);
};

// At least one active user must always hold the full-access role
const countActiveAdmins = async (connection) => {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total FROM users u JOIN roles r ON r.id = u.role_id
     WHERE u.is_active = 1 AND r.is_system = 1`,
  );
  return rows[0].total;
};

const NO_ADMIN_LEFT = "At least one active Administrator must remain";

// The role a user is being given, checked against what the editor may grant
const resolveRole = async (req, roleId) => {
  const role = (await db.query("SELECT * FROM roles WHERE id = ?", [roleId]))[0];
  if (!role) return { error: "Choose a valid role" };
  if (!auth.holdsAll(req.user, JSON.parse(role.permissions))) {
    return {
      error: "You cannot assign a role with more permissions than your own",
    };
  }
  return { role };
};

const readInput = (body) => ({
  name: typeof body?.name === "string" ? body.name.trim() : "",
  email: typeof body?.email === "string" ? body.email.trim().toLowerCase() : "",
  roleId: Number(body?.roleId),
  isActive: body?.isActive !== false,
  password: typeof body?.password === "string" ? body.password : "",
});

const inputProblem = ({ name, email }) => {
  if (!name || name.length > 150) return "Name is required";
  if (!EMAIL_PATTERN.test(email) || email.length > 191) {
    return "Enter a valid email address";
  }
  return null;
};

router.get("/", async (req, res) => {
  res.json({ success: true, users: await listUsers() });
});

router.post("/", async (req, res) => {
  const input = readInput(req.body);

  const problem = inputProblem(input) || passwordProblem(input.password);
  if (problem) return fail(res, 400, problem);

  const { error } = await resolveRole(req, input.roleId);
  if (error) return fail(res, 400, error);

  if (await auth.findUserByEmail(input.email)) {
    return fail(res, 409, "A user with this email already exists");
  }

  const { hash, salt } = hashPassword(input.password);
  await db.query(
    `INSERT INTO users (name, email, password_hash, password_salt, role_id, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [input.name, input.email, hash, salt, input.roleId, input.isActive ? 1 : 0, new Date()],
  );

  res.status(201).json({ success: true, users: await listUsers() });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = await auth.findUserById(id);
  if (!existing) return fail(res, 404, "User not found");

  const input = readInput(req.body);

  const problem =
    inputProblem(input) || (input.password ? passwordProblem(input.password) : null);
  if (problem) return fail(res, 400, problem);

  const isSelf = id === req.user.id;
  if (isSelf && (input.roleId !== existing.role_id || !input.isActive)) {
    return fail(res, 400, "You cannot change your own role or deactivate yourself");
  }

  // Editing someone more powerful than yourself is not allowed either
  if (!auth.holdsAll(req.user, JSON.parse(existing.role_permissions))) {
    return fail(res, 403, "You cannot edit a user with more permissions than your own");
  }

  const { error } = await resolveRole(req, input.roleId);
  if (error) return fail(res, 400, error);

  const other = await auth.findUserByEmail(input.email);
  if (other && other.id !== id) {
    return fail(res, 409, "A user with this email already exists");
  }

  try {
    await db.transaction(async (connection) => {
      await connection.query(
        "UPDATE users SET name = ?, email = ?, role_id = ?, is_active = ? WHERE id = ?",
        [input.name, input.email, input.roleId, input.isActive ? 1 : 0, id],
      );

      if (input.password) {
        const { hash, salt } = hashPassword(input.password);
        await connection.query(
          "UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?",
          [hash, salt, id],
        );
      }

      if ((await countActiveAdmins(connection)) === 0) {
        throw new Error(NO_ADMIN_LEFT);
      }
    });
  } catch (transactionError) {
    if (transactionError.message === NO_ADMIN_LEFT) {
      return fail(res, 400, NO_ADMIN_LEFT);
    }
    throw transactionError;
  }

  res.json({ success: true, users: await listUsers() });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = await auth.findUserById(id);
  if (!existing) return fail(res, 404, "User not found");

  if (id === req.user.id) {
    return fail(res, 400, "You cannot delete your own account");
  }

  if (!auth.holdsAll(req.user, JSON.parse(existing.role_permissions))) {
    return fail(res, 403, "You cannot delete a user with more permissions than your own");
  }

  try {
    await db.transaction(async (connection) => {
      await connection.query("DELETE FROM users WHERE id = ?", [id]);
      if ((await countActiveAdmins(connection)) === 0) {
        throw new Error(NO_ADMIN_LEFT);
      }
    });
  } catch (transactionError) {
    if (transactionError.message === NO_ADMIN_LEFT) {
      return fail(res, 400, NO_ADMIN_LEFT);
    }
    throw transactionError;
  }

  res.json({ success: true, users: await listUsers() });
});

module.exports = router;
