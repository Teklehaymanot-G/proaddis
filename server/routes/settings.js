const express = require("express");
const auth = require("../lib/auth");
const settings = require("../lib/settings");
const sendEmail = require("../lib/email");
const analytics = require("../lib/analytics");
const templates = require("../lib/emailTemplates");

const router = express.Router();

router.use(auth.requirePermission("settings.manage"));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (res, error) => res.status(400).json({ success: false, error });

const text = (value, max = 255) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const readAll = async () => ({
  smtp: await settings.getSmtpForAdmin(),
  contactForm: await settings.getContactForm(),
  analytics: await settings.get("analytics"),
  analyticsReports: await analytics.getStatus(),
  envRecipient: process.env.CONTACT_EMAIL || "",
});

router.get("/", async (req, res) => {
  res.json({ success: true, ...(await readAll()) });
});

// ---- SMTP ----

const readSmtp = (body) => ({
  host: text(body?.host),
  port: Number(body?.port),
  secure: body?.secure === true,
  user: text(body?.user),
  password: typeof body?.password === "string" ? body.password : "",
  fromName: text(body?.fromName, 100),
  fromEmail: text(body?.fromEmail).toLowerCase(),
});

const smtpProblem = (smtp) => {
  if (!smtp.host) return "SMTP host is required";
  if (!Number.isInteger(smtp.port) || smtp.port < 1 || smtp.port > 65535) {
    return "Enter a valid port number";
  }
  if (smtp.fromEmail && !EMAIL_PATTERN.test(smtp.fromEmail)) {
    return "Enter a valid sender email address";
  }
  if (!smtp.fromEmail && !EMAIL_PATTERN.test(smtp.user)) {
    return "Enter a sender email address";
  }
  return null;
};

router.put("/smtp", async (req, res) => {
  const smtp = readSmtp(req.body);

  const problem = smtpProblem(smtp);
  if (problem) return fail(res, problem);

  await settings.saveSmtp(smtp);
  res.json({ success: true, smtp: await settings.getSmtpForAdmin() });
});

// Sends a test email with the saved settings
router.post("/smtp/test", async (req, res) => {
  const to = text(req.body?.to).toLowerCase();
  if (!EMAIL_PATTERN.test(to)) return fail(res, "Enter a valid email address");

  const result = await sendEmail({
    to,
    subject: "ProAddis Marketing – test email",
    text: "This is a test email from the ProAddis Marketing admin. Your email settings work.",
  });

  if (!result.success) {
    return res.status(502).json({ success: false, error: result.error });
  }
  res.json({ success: true });
});

// ---- Contact form ----

const readField = (field) => {
  const show = field?.show === true;
  return { show, required: show && field?.required === true };
};

router.put("/contact-form", async (req, res) => {
  const body = req.body || {};

  const readEmails = (list) =>
    Array.isArray(list)
      ? [...new Set(list.map((email) => text(email).toLowerCase()))].filter(Boolean)
      : [];

  const recipients = readEmails(body.recipients);
  const copyTo = readEmails(body.copyTo);
  const invalid = [...recipients, ...copyTo].find((email) => !EMAIL_PATTERN.test(email));
  if (invalid) return fail(res, `"${invalid}" is not a valid email address`);

  const contactForm = {
    enabled: body.enabled !== false,
    recipients,
    copyTo,
    subjectPrefix: text(body.subjectPrefix, 150) || settings.DEFAULTS.contactForm.subjectPrefix,
    successMessage:
      text(body.successMessage, 500) || settings.DEFAULTS.contactForm.successMessage,
    fields: {
      phone: readField(body.fields?.phone),
      company: readField(body.fields?.company),
      subject: readField(body.fields?.subject),
    },
    autoReply: {
      enabled: body.autoReply?.enabled === true,
      subject: text(body.autoReply?.subject, 150),
      body: text(body.autoReply?.body, 5000),
    },
  };

  if (contactForm.autoReply.enabled && !(contactForm.autoReply.subject && contactForm.autoReply.body)) {
    return fail(res, "The automatic reply needs a subject and a message");
  }

  await settings.set("contactForm", contactForm);
  res.json({ success: true, contactForm });
});

// What the emails look like, with example data. `type`: notification | autoReply
router.post("/contact-form/preview", async (req, res) => {
  const saved = await settings.getContactForm();
  const sample = templates.SAMPLE_MESSAGE;

  if (req.body?.type === "autoReply") {
    // Preview what is typed in the form, even before it is saved
    const subject = text(req.body.subject, 150) || saved.autoReply.subject;
    const body = text(req.body.body, 5000) || saved.autoReply.body;
    return res.json({
      success: true,
      subject,
      html: templates.autoReply({
        name: sample.name,
        subject,
        body: body.replace(/\{\{\s*name\s*\}\}/g, sample.name),
      }).html,
    });
  }

  const subjectPrefix = text(req.body?.subjectPrefix, 150) || saved.subjectPrefix;
  res.json({
    success: true,
    subject: `${subjectPrefix} - ${sample.subject}`,
    html: templates.contactNotification({ ...sample, createdAt: new Date() }).html,
  });
});

// Sends the example notification to the saved addresses, to check delivery
router.post("/contact-form/test", async (req, res) => {
  const config = await settings.getContactForm();
  const recipients = settings.getRecipients(config);

  if (recipients.length === 0) {
    return fail(res, "Add at least one address under “Send new messages to” and save first");
  }

  const sample = templates.SAMPLE_MESSAGE;
  const result = await sendEmail({
    to: recipients,
    cc: config.copyTo.filter((address) => !recipients.includes(address)),
    replyTo: req.user.email,
    subject: `[Test] ${config.subjectPrefix} - ${sample.subject}`,
    ...templates.contactNotification({ ...sample, createdAt: new Date() }),
  });

  if (!result.success) {
    return res.status(502).json({ success: false, error: result.error });
  }
  res.json({ success: true, recipients, copyTo: config.copyTo });
});

// ---- Google Analytics ----

router.put("/analytics", async (req, res) => {
  const measurementId = text(req.body?.measurementId, 30).toUpperCase();
  const enabled = req.body?.enabled === true;

  if (measurementId && !/^G-[A-Z0-9]{4,20}$/.test(measurementId)) {
    return fail(res, "A Measurement ID looks like G-XXXXXXXXXX");
  }
  if (enabled && !measurementId) {
    return fail(res, "Enter a Measurement ID before turning tracking on");
  }

  const analytics = { enabled, measurementId };
  await settings.set("analytics", analytics);
  res.json({ success: true, analytics });
});

// ---- Google Analytics reports (shown on the Analytics page) ----

router.put("/analytics-reports", async (req, res) => {
  const propertyId = text(req.body?.propertyId, 30);
  const keyText =
    typeof req.body?.serviceAccountKey === "string" ? req.body.serviceAccountKey : "";

  if (!/^\d{4,15}$/.test(propertyId)) {
    return fail(
      res,
      "The Property ID is a number such as 123456789 (not the G- Measurement ID)",
    );
  }

  try {
    await analytics.saveConfig({ propertyId, keyText });
  } catch (error) {
    if (!(error instanceof analytics.AnalyticsError)) throw error;
    return fail(res, error.message);
  }

  res.json({ success: true, analyticsReports: await analytics.getStatus() });
});

router.delete("/analytics-reports", async (req, res) => {
  await analytics.clearConfig();
  res.json({ success: true, analyticsReports: await analytics.getStatus() });
});

module.exports = router;
