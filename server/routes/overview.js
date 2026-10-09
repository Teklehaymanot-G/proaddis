const fs = require("fs");
const path = require("path");
const express = require("express");
const db = require("../lib/db");
const auth = require("../lib/auth");
const settings = require("../lib/settings");
const analyticsReports = require("../lib/analytics");
const { BACKUP_DIR } = require("../lib/paths");

const router = express.Router();

// Dashboard numbers. Each block is only included when the user may see it.
router.get("/", auth.requireAuth, async (req, res) => {
  const can = (key) => req.user.permissions.includes(key);
  const overview = {};

  if (can("messages.view") || can("messages.manage")) {
    const [totals] = await db.query(
      "SELECT COUNT(*) AS total, COALESCE(SUM(is_read = 0), 0) AS unread FROM messages",
    );
    const recent = await db.query(
      "SELECT id, name, email, message, is_read, created_at FROM messages ORDER BY created_at DESC, id DESC LIMIT 5",
    );
    overview.messages = {
      total: totals.total,
      unread: Number(totals.unread),
      recent: recent.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        message: row.message,
        read: Boolean(row.is_read),
        createdAt: row.created_at,
      })),
    };
  }

  if (can("content.view") || can("content.edit")) {
    const rows = await db.query("SELECT section, data FROM content");
    const content = Object.fromEntries(
      rows.map((row) => [row.section, JSON.parse(row.data)]),
    );
    overview.content = {
      services: content.services?.items?.length || 0,
      projects: content.portfolio?.projects?.length || 0,
      clients: content.clients?.items?.length || 0,
      testimonials: content.testimonials?.items?.length || 0,
    };
  }

  if (can("users.manage")) {
    const [users] = await db.query(
      "SELECT COUNT(*) AS total, COALESCE(SUM(is_active = 1), 0) AS active FROM users",
    );
    overview.users = { total: users.total, active: Number(users.active) };
  }

  if (can("settings.manage")) {
    const [smtp, analytics] = await Promise.all([
      settings.getSmtp(),
      settings.get("analytics"),
    ]);
    overview.system = {
      emailConfigured: smtp.source !== "none",
      analyticsEnabled: analytics.enabled && Boolean(analytics.measurementId),
      analyticsReportsConnected: (await analyticsReports.getStatus()).configured,
    };
  }

  if (can("backups.manage")) {
    const latest = fs
      .readdirSync(BACKUP_DIR)
      .filter((name) => name.endsWith(".zip"))
      .map((name) => fs.statSync(path.join(BACKUP_DIR, name)).mtime)
      .sort((a, b) => b - a)[0];
    overview.backups = { latest: latest || null };
  }

  res.json({ success: true, overview });
});

module.exports = router;
