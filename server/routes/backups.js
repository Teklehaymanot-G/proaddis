const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const AdmZip = require("adm-zip");
const db = require("../lib/db");
const auth = require("../lib/auth");
const { UPLOAD_DIR, BACKUP_DIR } = require("../lib/paths");

const router = express.Router();

router.use(auth.requirePermission("backups.manage"));

const FORMAT = "proaddis-backup";
const VERSION = 1;
const MAX_UPLOAD_SIZE = 1024 * 1024 * 1024; // 1 GB
const FILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*\.zip$/;
const UPLOADED_FILE = /^uploads\/([A-Za-z0-9][A-Za-z0-9._-]*)$/;

// Tables in a backup and the columns restored from it. Order matters:
// roles before users because of the foreign key.
const TABLES = {
  roles: ["id", "name", "description", "permissions", "is_system", "created_at"],
  users: [
    "id",
    "name",
    "email",
    "password_hash",
    "password_salt",
    "role_id",
    "is_active",
    "last_login_at",
    "created_at",
  ],
  content: ["section", "data", "updated_at", "updated_by"],
  settings: ["name", "value", "updated_at"],
  messages: [
    "id",
    "name",
    "email",
    "phone",
    "company",
    "subject",
    "message",
    "is_read",
    "created_at",
  ],
};
const DATE_COLUMNS = ["created_at", "updated_at", "last_login_at"];
const ACCESS_TABLES = ["roles", "users"];

const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });

const fileFor = (name) =>
  FILE_NAME.test(name) && path.basename(name) === name
    ? path.join(BACKUP_DIR, name)
    : null;

const stamp = () =>
  new Date().toISOString().replace(/\.\d+Z$/, "").replace(/[:T]/g, "-");

const listBackups = () =>
  fs
    .readdirSync(BACKUP_DIR)
    .filter((name) => FILE_NAME.test(name))
    .map((name) => {
      const stats = fs.statSync(path.join(BACKUP_DIR, name));
      return { name, size: stats.size, createdAt: stats.mtime };
    })
    .sort((a, b) => b.createdAt - a.createdAt);

// ---- Create ----

const createBackup = async (prefix, createdBy) => {
  const zip = new AdmZip();
  const counts = {};

  for (const table of Object.keys(TABLES)) {
    const rows = await db.query(`SELECT * FROM ${table}`);
    counts[table] = rows.length;
    zip.addFile(`data/${table}.json`, Buffer.from(JSON.stringify(rows)));
  }

  const uploads = fs
    .readdirSync(UPLOAD_DIR)
    .filter((name) => UPLOADED_FILE.test(`uploads/${name}`));
  for (const name of uploads) {
    zip.addLocalFile(path.join(UPLOAD_DIR, name), "uploads");
  }
  counts.uploads = uploads.length;

  zip.addFile(
    "manifest.json",
    Buffer.from(
      JSON.stringify(
        { format: FORMAT, version: VERSION, createdAt: new Date(), createdBy, counts },
        null,
        2,
      ),
    ),
  );

  const name = `${prefix}-${stamp()}.zip`;
  zip.writeZip(path.join(BACKUP_DIR, name));
  return name;
};

// ---- Read / validate ----

const openBackup = (file) => {
  let zip;
  try {
    zip = new AdmZip(file);
  } catch {
    throw new Error("This file is not a valid zip archive");
  }

  const readJson = (entryName) => {
    const entry = zip.getEntry(entryName);
    if (!entry) return null;
    try {
      return JSON.parse(entry.getData().toString("utf8"));
    } catch {
      return null;
    }
  };

  const manifest = readJson("manifest.json");
  if (manifest?.format !== FORMAT || manifest.version !== VERSION) {
    throw new Error("This file is not a ProAddis backup");
  }

  const data = {};
  for (const table of Object.keys(TABLES)) {
    data[table] = readJson(`data/${table}.json`);
    if (!Array.isArray(data[table])) {
      throw new Error(`The backup is incomplete (${table} is missing)`);
    }
  }

  return { zip, manifest, data };
};

// ---- Restore ----

const insertRows = async (connection, table, rows) => {
  for (const row of rows) {
    const values = {};
    for (const column of TABLES[table]) {
      if (row[column] === undefined) continue;
      values[column] =
        DATE_COLUMNS.includes(column) && row[column] !== null
          ? new Date(row[column])
          : row[column];
    }
    await connection.query(`INSERT INTO ${table} SET ?`, [values]);
  }
};

const restoreBackup = async (file, { includeAccess }) => {
  const { zip, data } = openBackup(file);

  if (includeAccess) {
    const adminRoleIds = data.roles.filter((r) => r.is_system).map((r) => r.id);
    const hasAdmin = data.users.some(
      (u) => u.is_active && adminRoleIds.includes(u.role_id),
    );
    if (!hasAdmin) {
      throw new Error("The backup contains no active Administrator account");
    }
  }

  const tables = Object.keys(TABLES).filter(
    (table) => includeAccess || !ACCESS_TABLES.includes(table),
  );

  await db.transaction(async (connection) => {
    // Children first when emptying, parents first when filling
    for (const table of [...tables].reverse()) {
      await connection.query(`DELETE FROM ${table}`);
    }
    for (const table of tables) {
      await insertRows(connection, table, data[table]);
    }
  });

  // Uploaded files are added back; files not in the backup are left alone
  let files = 0;
  for (const entry of zip.getEntries()) {
    const match = UPLOADED_FILE.exec(entry.entryName);
    if (!match || entry.isDirectory) continue;
    fs.writeFileSync(path.join(UPLOAD_DIR, match[1]), entry.getData());
    files += 1;
  }

  return { tables, files };
};

// ---- Routes ----

router.get("/", (req, res) => {
  res.json({ success: true, backups: listBackups() });
});

router.post("/", async (req, res) => {
  const name = await createBackup("backup", req.user.email);
  res.status(201).json({ success: true, name, backups: listBackups() });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: BACKUP_DIR,
    filename: (req, file, cb) => cb(null, `incoming-${Date.now()}.tmp`),
  }),
  limits: { fileSize: MAX_UPLOAD_SIZE, files: 1 },
});

// Adds a backup file from the computer to the list (it is not restored yet)
router.post("/upload", (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      return fail(
        res,
        400,
        error.code === "LIMIT_FILE_SIZE" ? "File is too large (maximum 1 GB)" : error.message,
      );
    }
    if (!req.file) return fail(res, 400, "No file uploaded");

    try {
      openBackup(req.file.path);
    } catch (invalid) {
      fs.rmSync(req.file.path, { force: true });
      return fail(res, 400, invalid.message);
    }

    const name = `uploaded-${stamp()}.zip`;
    fs.renameSync(req.file.path, path.join(BACKUP_DIR, name));
    res.status(201).json({ success: true, name, backups: listBackups() });
  });
});

router.get("/:name/download", (req, res) => {
  const file = fileFor(req.params.name);
  if (!file || !fs.existsSync(file)) return fail(res, 404, "Backup not found");
  // Sent as a plain file: the admin fetches it and names the download itself
  res.type("application/zip").sendFile(file);
});

router.post("/:name/restore", async (req, res) => {
  const file = fileFor(req.params.name);
  if (!file || !fs.existsSync(file)) return fail(res, 404, "Backup not found");

  const includeAccess = req.body?.includeAccess === true;
  if (includeAccess && !req.user.permissions.includes("users.manage")) {
    return fail(res, 403, "Restoring users and roles needs the Manage users permission");
  }

  try {
    openBackup(file);
  } catch (invalid) {
    return fail(res, 400, invalid.message);
  }

  // Safety net: the current state is saved before anything is replaced
  const safetyBackup = await createBackup("before-restore", req.user.email);

  let result;
  try {
    result = await restoreBackup(file, { includeAccess });
  } catch (restoreError) {
    return fail(res, 400, `Restore failed, nothing was changed: ${restoreError.message}`);
  }

  res.json({ success: true, ...result, safetyBackup, backups: listBackups() });
});

router.delete("/:name", (req, res) => {
  const file = fileFor(req.params.name);
  if (!file || !fs.existsSync(file)) return fail(res, 404, "Backup not found");
  fs.rmSync(file);
  res.json({ success: true, backups: listBackups() });
});

module.exports = router;
