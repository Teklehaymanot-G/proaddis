const express = require("express");
const db = require("../lib/db");
const auth = require("../lib/auth");
const settings = require("../lib/settings");

const router = express.Router();

// Editable website sections (one row each in the `content` table)
const SECTIONS = [
  "settings",
  "hero",
  "about",
  "services",
  "process",
  "clients",
  "portfolio",
  "caseStudies",
  "testimonials",
  "contact",
  "footer",
];

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const getContent = async () => {
  const rows = await db.query("SELECT section, data FROM content");
  return Object.fromEntries(rows.map((row) => [row.section, JSON.parse(row.data)]));
};

// Public: everything the website needs to render
router.get("/content", async (req, res) => {
  const [content, publicSettings] = await Promise.all([
    getContent(),
    settings.getPublic(),
  ]);
  res.set("Cache-Control", "no-cache");
  res.json({ success: true, content, ...publicSettings });
});

router.get(
  "/admin/content",
  auth.requirePermission("content.view", "content.edit"),
  async (req, res) => {
    res.json({ success: true, content: await getContent() });
  },
);

// Replace one section
router.put(
  "/admin/content/:section",
  auth.requirePermission("content.edit"),
  async (req, res) => {
    const { section } = req.params;

    if (!SECTIONS.includes(section)) {
      return res.status(404).json({ success: false, error: "Unknown section" });
    }

    if (!isPlainObject(req.body)) {
      return res
        .status(400)
        .json({ success: false, error: "Section content must be an object" });
    }

    await db.query(
      "REPLACE INTO content (section, data, updated_at, updated_by) VALUES (?, ?, ?, ?)",
      [section, JSON.stringify(req.body), new Date(), req.user.id],
    );

    res.json({ success: true, section, content: req.body });
  },
);

module.exports = router;
module.exports.SECTIONS = SECTIONS;
