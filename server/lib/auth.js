const jwt = require("jsonwebtoken");
const db = require("./db");
const { SECRET } = require("./secret");

const TOKEN_TTL = "12h";

const USER_SELECT = `
  SELECT u.id, u.name, u.email, u.password_hash, u.password_salt, u.role_id,
         u.is_active, u.last_login_at, u.created_at,
         r.name AS role_name, r.permissions AS role_permissions,
         r.is_system AS role_is_system
  FROM users u
  JOIN roles r ON r.id = u.role_id`;

const findUser = async (where, value) =>
  (await db.query(`${USER_SELECT} WHERE ${where} = ?`, [value]))[0] || null;

const findUserById = (id) => findUser("u.id", id);
const findUserByEmail = (email) =>
  findUser("u.email", String(email).trim().toLowerCase());

// Shape sent to the browser (no password fields)
const toPublicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  isActive: Boolean(row.is_active),
  lastLoginAt: row.last_login_at,
  createdAt: row.created_at,
  role: {
    id: row.role_id,
    name: row.role_name,
    isSystem: Boolean(row.role_is_system),
  },
  permissions: JSON.parse(row.role_permissions),
});

const signToken = (user) =>
  jwt.sign({ sub: user.id }, SECRET, { expiresIn: TOKEN_TTL });

// The user and their permissions are read fresh on every request, so
// deactivating someone or changing their role takes effect immediately.
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Not signed in" });
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ success: false, error: "Session expired" });
  }

  const row = await findUserById(payload.sub);
  if (!row || !row.is_active) {
    return res.status(401).json({ success: false, error: "Session expired" });
  }

  req.user = toPublicUser(row);
  next();
};

// Passes when the signed-in user has at least one of the given permissions
const requirePermission = (...keys) => [
  requireAuth,
  (req, res, next) => {
    if (keys.some((key) => req.user.permissions.includes(key))) return next();
    res.status(403).json({
      success: false,
      error: "You do not have permission to do this",
    });
  },
];

// A user may only hand out permissions they hold themselves
const holdsAll = (user, permissions) =>
  permissions.every((key) => user.permissions.includes(key));

module.exports = {
  findUserById,
  findUserByEmail,
  toPublicUser,
  signToken,
  requireAuth,
  requirePermission,
  holdsAll,
};
