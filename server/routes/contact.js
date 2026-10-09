const express = require("express");
const db = require("../lib/db");
const settings = require("../lib/settings");
const sendEmail = require("../lib/email");
const rateLimit = require("../lib/rateLimit");

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fields a visitor can send and their maximum length. The optional ones are
// switched on and off under Settings → Contact form in the admin.
const ALWAYS = { name: 200, email: 320, message: 5000 };
const OPTIONAL = { phone: 50, company: 200, subject: 255 };
const LABELS = { phone: "Phone", company: "Company", subject: "Subject" };

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many messages. Please try again in a few minutes.",
});

const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });

const detailRow = (label, value) => `
            <p style="font-size: 16px; color: #333; margin: 12px 0;">
              <strong style="color: #006aab;">${label}:</strong> ${escapeHtml(value)}
            </p>`;

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

  const extras = Object.keys(OPTIONAL).filter((key) => fields[key]);
  const recipients = settings.getRecipients(config);

  if (recipients.length > 0) {
    // Email options for contact form
    const result = await sendEmail({
      to: recipients,
      replyTo: email,
      subject: [config.subjectPrefix, fields.subject].filter(Boolean).join(" - "),
      text: [
        "New contact form submission from ProAddis Marketing website:",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        ...extras.map((key) => `${LABELS[key]}: ${fields[key]}`),
        `Message: ${message}`,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <div style="text-align:center; margin-bottom: 24px;">
            <h2 style="color: #006aab; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #666; margin: 8px 0 0 0;">ProAddis Marketing Website</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 8px; border-left: 4px solid #006aab;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            ${detailRow("Name", name)}
            ${detailRow("Email", email)}
            ${extras.map((key) => detailRow(LABELS[key], fields[key])).join("")}
            <p style="font-size: 16px; color: #333; margin: 12px 0;">
              <strong style="color: #006aab;">Message:</strong><br/>
              <span style="display: inline-block; margin-top: 8px; padding: 12px; background: #f5f5f5; border-radius: 6px; width: 100%;">
                ${escapeHtml(message).replace(/\n/g, "<br/>")}
              </span>
            </p>
          </div>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 13px; color: #aaa; text-align: center;">
            Sent from the contact form on the ProAddis Marketing website.
            Reply to this email to answer ${escapeHtml(name)}.
          </p>
        </div>
      `,
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
      text: config.autoReply.body.replace(/\{\{\s*name\s*\}\}/g, name),
    });
    if (!result.success) {
      console.error("Automatic reply not sent:", result.error);
    }
  }

  res.status(200).json({ success: true, message: config.successMessage });
});

module.exports = router;
