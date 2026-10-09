const express = require("express");
const db = require("../lib/db");
const auth = require("../lib/auth");
const { PERMISSIONS, PERMISSION_KEYS } = require("../lib/permissions");

const router = express.Router();

const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });

const listRoles = async () => {
  const rows = await db.query(
    `SELECT r.*, (SELECT COUNT(*) FROM users u WHERE u.role_id = r.id) AS user_count
     FROM roles r ORDER BY r.is_system DESC, r.name`,
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: JSON.parse(row.permissions),
    isSystem: Boolean(row.is_system),
    userCount: row.user_count,
  }));
};

const readInput = (body) => ({
  name: typeof body?.name === "string" ? body.name.trim() : "",
  description:
    typeof body?.description === "string" ? body.description.trim() : "",
  permissions: Array.isArray(body?.permissions)
    ? [...new Set(body.permissions)].filter((key) => PERMISSION_KEYS.includes(key))
    : [],
});

const inputProblem = (req, input) => {
  if (!input.name || input.name.length > 100) return "Role name is required";
  if (input.description.length > 255) return "Description is too long";
  if (!auth.holdsAll(req.user, input.permissions)) {
    return "You cannot grant permissions you do not have yourself";
  }
  return null;
};

const nameTaken = async (name, exceptId = 0) =>
  (await db.query("SELECT id FROM roles WHERE name = ? AND id <> ?", [name, exceptId]))
    .length > 0;

// The user form needs the role list too
router.get(
  "/",
  auth.requirePermission("roles.manage", "users.manage"),
  async (req, res) => {
    res.json({
      success: true,
      roles: await listRoles(),
      permissions: PERMISSIONS,
    });
  },
);

router.post("/", auth.requirePermission("roles.manage"), async (req, res) => {
  const input = readInput(req.body);

  const problem = inputProblem(req, input);
  if (problem) return fail(res, 400, problem);
  if (await nameTaken(input.name)) {
    return fail(res, 409, "A role with this name already exists");
  }

  await db.query(
    "INSERT INTO roles (name, description, permissions, created_at) VALUES (?, ?, ?, ?)",
    [input.name, input.description, JSON.stringify(input.permissions), new Date()],
  );

  res.status(201).json({ success: true, roles: await listRoles() });
});

router.put("/:id", auth.requirePermission("roles.manage"), async (req, res) => {
  const id = Number(req.params.id);
  const role = (await db.query("SELECT * FROM roles WHERE id = ?", [id]))[0];
  if (!role) return fail(res, 404, "Role not found");
  if (role.is_system) {
    return fail(res, 400, "The Administrator role cannot be changed");
  }
  if (id === req.user.role.id) {
    return fail(res, 400, "You cannot change your own role");
  }

  const input = readInput(req.body);

  const problem = inputProblem(req, input);
  if (problem) return fail(res, 400, problem);
  if (await nameTaken(input.name, id)) {
    return fail(res, 409, "A role with this name already exists");
  }

  await db.query(
    "UPDATE roles SET name = ?, description = ?, permissions = ? WHERE id = ?",
    [input.name, input.description, JSON.stringify(input.permissions), id],
  );

  res.json({ success: true, roles: await listRoles() });
});

router.delete("/:id", auth.requirePermission("roles.manage"), async (req, res) => {
  const id = Number(req.params.id);
  const role = (await listRoles()).find((r) => r.id === id);
  if (!role) return fail(res, 404, "Role not found");
  if (role.isSystem) {
    return fail(res, 400, "The Administrator role cannot be deleted");
  }
  if (role.userCount > 0) {
    return fail(
      res,
      400,
      `${role.userCount} user(s) still have this role. Give them another role first.`,
    );
  }

  await db.query("DELETE FROM roles WHERE id = ?", [id]);
  res.json({ success: true, roles: await listRoles() });
});

module.exports = router;
