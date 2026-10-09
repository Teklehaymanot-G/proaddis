const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { ROOT, DATA_DIR } = require("./paths");
const { DEFAULT_ROLES } = require("./permissions");
const { hashPassword } = require("./password");

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "proaddis_marketing",
};

if (!/^[A-Za-z0-9_]+$/.test(config.database)) {
  throw new Error("DB_NAME may only contain letters, numbers and underscores");
}

let pool;

const query = async (sql, params) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

// Runs `work(connection)` inside a transaction
const transaction = async (work) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// JSON is stored as text so this works on every MySQL / MariaDB version
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL DEFAULT '',
    permissions LONGTEXT NOT NULL,
    is_system TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(64) NOT NULL,
    role_id INT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS content (
    section VARCHAR(64) PRIMARY KEY,
    data LONGTEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    updated_by INT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS settings (
    name VARCHAR(64) PRIMARY KEY,
    value LONGTEXT NOT NULL,
    updated_at DATETIME NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(50) NULL,
    company VARCHAR(200) NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    INDEX idx_messages_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

const count = async (table) =>
  (await query(`SELECT COUNT(*) AS total FROM ${table}`))[0].total;

const seedRoles = async () => {
  if ((await count("roles")) > 0) return;
  for (const role of DEFAULT_ROLES) {
    await query(
      "INSERT INTO roles (name, description, permissions, is_system, created_at) VALUES (?, ?, ?, ?, ?)",
      [
        role.name,
        role.description,
        JSON.stringify(role.permissions),
        role.isSystem ? 1 : 0,
        new Date(),
      ],
    );
  }
};

// First start: the website content shipped with the code, overlaid with any
// sections saved by the earlier file-based version of this server.
const seedContent = async () => {
  const empty = (await count("content")) === 0;
  const seed = readJson(path.join(ROOT, "seed", "content.json")) || {};
  const legacy = empty ? readJson(path.join(DATA_DIR, "content.json")) || {} : {};

  for (const section of Object.keys(seed)) {
    await query(
      "INSERT IGNORE INTO content (section, data, updated_at) VALUES (?, ?, ?)",
      [
        section,
        JSON.stringify({ ...seed[section], ...(legacy[section] || {}) }),
        new Date(),
      ],
    );
  }
};

const seedMessages = async () => {
  if ((await count("messages")) > 0) return;
  const legacy = readJson(path.join(DATA_DIR, "messages.json")) || [];
  for (const message of [...legacy].reverse()) {
    await query(
      "INSERT INTO messages (name, email, message, is_read, created_at) VALUES (?, ?, ?, ?, ?)",
      [
        message.name,
        message.email,
        message.message,
        message.read ? 1 : 0,
        new Date(message.createdAt),
      ],
    );
  }
};

const seedUsers = async () => {
  if ((await count("users")) > 0) return;

  const [{ id: adminRoleId }] = await query(
    "SELECT id FROM roles WHERE is_system = 1 ORDER BY id LIMIT 1",
  );
  const insert = (name, email, hash, salt) =>
    query(
      "INSERT INTO users (name, email, password_hash, password_salt, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hash, salt, adminRoleId, new Date()],
    );

  // Accounts from the earlier file-based version keep working
  const legacy = readJson(path.join(DATA_DIR, "users.json")) || [];
  if (legacy.length > 0) {
    for (const user of legacy) {
      await insert("Administrator", user.email, user.hash, user.salt);
    }
    console.log(`Imported ${legacy.length} existing admin account(s)`);
    return;
  }

  const email = (process.env.ADMIN_EMAIL || "admin@proaddismarketing.com")
    .trim()
    .toLowerCase();
  const generated = !process.env.ADMIN_PASSWORD;
  const password =
    process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url");
  const { hash, salt } = hashPassword(password);
  await insert("Administrator", email, hash, salt);

  console.log("--------------------------------------------------");
  console.log("Admin account created");
  console.log(`  Email:    ${email}`);
  console.log(
    generated
      ? `  Password: ${password}  (change it after signing in)`
      : "  Password: taken from ADMIN_PASSWORD",
  );
  console.log("--------------------------------------------------");
};

const init = async () => {
  // Create the database when the account is allowed to (local development).
  // Shared hosting usually forbids this; the database then has to exist.
  try {
    const { database, ...server } = config;
    const connection = await mysql.createConnection(server);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.end();
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") throw error;
  }

  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "Z",
  });

  for (const statement of SCHEMA) await query(statement);

  await seedRoles();
  await seedContent();
  await seedMessages();
  await seedUsers();
};

const close = () => pool?.end();

module.exports = { init, close, query, transaction, config };
