const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const auth = require("../lib/auth");
const { UPLOAD_DIR } = require("../lib/paths");

const router = express.Router();

const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60 MB (hero video)

// Allowed upload types → stored extension. SVG is left out on purpose:
// it can carry scripts and would be served from this origin.
const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
      cb(null, `${name}${EXTENSIONS[file.mimetype]}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (EXTENSIONS[file.mimetype]) return cb(null, true);
    cb(new Error("Only JPG, PNG, WebP, GIF, AVIF, MP4 and WebM files are allowed"));
  },
});

router.post("/", auth.requirePermission("content.edit"), (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "File is too large (maximum 60 MB)"
          : error.message;
      return res.status(400).json({ success: false, error: message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;
