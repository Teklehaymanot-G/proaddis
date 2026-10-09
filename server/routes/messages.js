const express = require("express");
const db = require("../lib/db");
const auth = require("../lib/auth");

const router = express.Router();

const MAX_LISTED = 2000;

const toMessage = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  company: row.company,
  subject: row.subject,
  message: row.message,
  read: Boolean(row.is_read),
  createdAt: row.created_at,
});

const readIds = (body) =>
  Array.isArray(body?.ids)
    ? body.ids.map(Number).filter(Number.isInteger).slice(0, MAX_LISTED)
    : [];

router.get(
  "/",
  auth.requirePermission("messages.view", "messages.manage"),
  async (req, res) => {
    const rows = await db.query(
      "SELECT * FROM messages ORDER BY created_at DESC, id DESC LIMIT ?",
      [MAX_LISTED],
    );
    res.json({ success: true, messages: rows.map(toMessage) });
  },
);

// Mark one or many as read / unread
router.post("/read", auth.requirePermission("messages.manage"), async (req, res) => {
  const ids = readIds(req.body);
  if (ids.length > 0) {
    await db.query("UPDATE messages SET is_read = ? WHERE id IN (?)", [
      req.body.read === false ? 0 : 1,
      ids,
    ]);
  }
  res.json({ success: true });
});

// Delete one or many
router.post("/delete", auth.requirePermission("messages.manage"), async (req, res) => {
  const ids = readIds(req.body);
  if (ids.length > 0) {
    await db.query("DELETE FROM messages WHERE id IN (?)", [ids]);
  }
  res.json({ success: true });
});

module.exports = router;
