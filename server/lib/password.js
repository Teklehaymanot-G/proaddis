const crypto = require("crypto");

const MIN_PASSWORD_LENGTH = 8;

// scrypt: no native dependencies needed
const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString("hex"),
});

const verifyPassword = (password, hash, salt) => {
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, salt, 64);
  return (
    expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
  );
};

const passwordProblem = (password) => {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

module.exports = { hashPassword, verifyPassword, passwordProblem };
