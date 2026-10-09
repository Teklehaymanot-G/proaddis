const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// Folders the server writes to. All three must survive redeploys.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT, "uploads");
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(ROOT, "backups");

for (const dir of [DATA_DIR, UPLOAD_DIR, BACKUP_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

module.exports = { ROOT, DATA_DIR, UPLOAD_DIR, BACKUP_DIR };
