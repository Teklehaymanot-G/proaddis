const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { DATA_DIR } = require("./paths");

// One application secret signs sessions and encrypts stored credentials.
// It is kept outside the database so a database dump alone reveals nothing.
const loadSecret = () => {
  if (process.env.APP_SECRET) return process.env.APP_SECRET;
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  const file = path.join(DATA_DIR, "secret.json");
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).value;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const value = crypto.randomBytes(48).toString("hex");
  fs.writeFileSync(file, JSON.stringify({ value }, null, 2));
  return value;
};

const SECRET = loadSecret();
const KEY = crypto.createHash("sha256").update(SECRET).digest();

// AES-256-GCM, stored as iv.tag.ciphertext (base64)
const encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const data = Buffer.concat([cipher.update(String(text), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
};

// Returns "" when the value cannot be decrypted (e.g. restored on a server
// with a different secret) so callers can treat it as "not set".
const decrypt = (value) => {
  try {
    const [iv, tag, data] = String(value)
      .split(".")
      .map((part) => Buffer.from(part, "base64"));
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
};

module.exports = { SECRET, encrypt, decrypt };
