const express = require("express");
const db = require("../lib/db");
const settings = require("../lib/settings");
const sendEmail = require("../lib/email");
const templates = require("../lib/emailTemplates");
const rateLimit = require("../lib/rateLimit");

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fields a visitor can send and their maximum length. The optional ones are
// switched on and off under Settings → Contact form in the admin.
const ALWAYS = { name: 200, email: 320, message: 5000 };
const OPTIONAL = { phone: 50, company: 200, subject: 255 };
const LABELS = { phone: "Phone", company: "Company", subject: "Subject" };

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many messages. Please try again in a few minutes.",
});

const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });

router.post("/contact", contactLimiter, async (req, res) => {
  const config = await settings.getContactForm();

  if (!config.enabled) {
    return fail(res, 403, "The contact form is currently unavailable");
  }

  const body = req.body || {};
  const read = (key, max) => {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    return value.length > max ? null : value;
  };

  const fields = {};

  // Validate required fields
  for (const [key, max] of Object.entries(ALWAYS)) {
    const value = read(key, max);
    if (value === null) return fail(res, 400, `The ${key} is too long`);
    if (!value) return fail(res, 400, "All fields are required");
    fields[key] = value;
  }

  for (const [key, max] of Object.entries(OPTIONAL)) {
    const { show, required } = config.fields[key];
    if (!show) continue;
    const value = read(key, max);
    if (value === null) return fail(res, 400, `The ${key} is too long`);
    if (required && !value) return fail(res, 400, `${LABELS[key]} is required`);
    fields[key] = value || null;
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return fail(res, 400, "Please enter a valid email address");
  }

  const { name, email, message } = fields;

  // Keep every submission in the admin inbox, even if the email fails
  await db.query(
    `INSERT INTO messages (name, email, phone, company, subject, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      fields.phone || null,
      fields.company || null,
      fields.subject || null,
      message,
      new Date(),
    ],
  );

  const recipients = settings.getRecipients(config);

  if (recipients.length > 0) {
    const notification = templates.contactNotification({
      ...fields,
      createdAt: new Date(),
    });

    const result = await sendEmail({
      to: recipients,
      // People who get a copy of every message (Settings → Contact form)
      cc: config.copyTo.filter((address) => !recipients.includes(address)),
      replyTo: email,
      subject: [config.subjectPrefix, fields.subject].filter(Boolean).join(" - "),
      ...notification,
    });

    if (!result.success) {
      // The message is already saved in the inbox, so the visitor still succeeds
      console.error("Contact notification not sent:", result.error);
    }
  }

  if (config.autoReply.enabled) {
    const result = await sendEmail({
      to: email,
      subject: config.autoReply.subject,
      ...templates.autoReply({
        name,
        subject: config.autoReply.subject,
        body: config.autoReply.body.replace(/\{\{\s*name\s*\}\}/g, name),
      }),
    });
    if (!result.success) {
      console.error("Automatic reply not sent:", result.error);
    }
  }

  res.status(200).json({ success: true, message: config.successMessage });
});

module.exports = router;
