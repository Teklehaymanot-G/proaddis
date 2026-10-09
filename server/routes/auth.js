const express = require("express");
const db = require("../lib/db");
const rateLimit = require("../lib/rateLimit");
const auth = require("../lib/auth");
const {
  hashPassword,
  verifyPassword,
  passwordProblem,
} = require("../lib/password");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many sign-in attempts. Please try again in 15 minutes.",
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Email and password are required" });
  }

  const row = await auth.findUserByEmail(email);

  if (!row || !verifyPassword(password, row.password_hash, row.password_salt)) {
    return res
      .status(401)
      .json({ success: false, error: "Incorrect email or password" });
  }

  if (!row.is_active) {
    return res.status(403).json({
      success: false,
      error: "This account has been deactivated",
    });
  }

  await db.query("UPDATE users SET last_login_at = ? WHERE id = ?", [
    new Date(),
    row.id,
  ]);

  res.json({
    success: true,
    token: auth.signToken(row),
    user: auth.toPublicUser(row),
  });
});

router.get("/me", auth.requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Own profile
router.put("/profile", auth.requireAuth, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

  if (!name || name.length > 150) {
    return res.status(400).json({ success: false, error: "Name is required" });
  }

  await db.query("UPDATE users SET name = ? WHERE id = ?", [name, req.user.id]);
  res.json({ success: true, user: { ...req.user, name } });
});

router.post("/password", auth.requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  const problem = passwordProblem(newPassword);
  if (typeof currentPassword !== "string" || problem) {
    return res.status(400).json({
      success: false,
      error: problem || "Current password is required",
    });
  }

  const row = await auth.findUserById(req.user.id);
  if (!verifyPassword(currentPassword, row.password_hash, row.password_salt)) {
    return res
      .status(401)
      .json({ success: false, error: "Current password is incorrect" });
  }

  const { hash, salt } = hashPassword(newPassword);
  await db.query(
    "UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?",
    [hash, salt, req.user.id],
  );

  res.json({ success: true });
});

module.exports = router;
