const db = require("./db");
const { encrypt, decrypt } = require("./secret");

// System settings, one row per name in the `settings` table
const DEFAULTS = {
  smtp: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "", // stored encrypted
    fromName: "ProAddis Marketing",
    fromEmail: "",
  },
  contactForm: {
    enabled: true,
    recipients: [],
    subjectPrefix: "New Contact Form Submission",
    successMessage:
      "Thank you! Your message has been sent successfully. We'll get back to you soon.",
    fields: {
      phone: { show: false, required: false },
      company: { show: false, required: false },
      subject: { show: false, required: false },
    },
    autoReply: {
      enabled: false,
      subject: "We received your message",
      body: "Hi {{name}},\n\nThank you for contacting ProAddis Marketing. We have received your message and will get back to you within 24 hours.\n\nProAddis Marketing",
    },
  },
  analytics: {
    enabled: false,
    measurementId: "",
  },
};

const get = async (name) => {
  const rows = await db.query("SELECT value FROM settings WHERE name = ?", [name]);
  const saved = rows.length > 0 ? JSON.parse(rows[0].value) : {};
  return { ...DEFAULTS[name], ...saved };
};

const set = async (name, value) => {
  await db.query(
    "REPLACE INTO settings (name, value, updated_at) VALUES (?, ?, ?)",
    [name, JSON.stringify(value), new Date()],
  );
  return value;
};

// ---- SMTP ----

// The connection actually used for sending: the saved settings, or the
// EMAIL_* environment variables when nothing has been saved yet.
const getSmtp = async () => {
  const saved = await get("smtp");

  if (saved.host) {
    return {
      ...saved,
      password: saved.password ? decrypt(saved.password) : "",
      source: "settings",
    };
  }

  return {
    ...DEFAULTS.smtp,
    host: process.env.EMAIL_HOST || "",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    fromEmail: process.env.EMAIL_USER || "",
    source: process.env.EMAIL_HOST ? "environment" : "none",
  };
};

// Never sends the password to the browser
const getSmtpForAdmin = async () => {
  const { password, ...smtp } = await getSmtp();
  return { ...smtp, hasPassword: Boolean(password) };
};

// `password`: a new value replaces it, undefined/"" keeps the saved one
const saveSmtp = async (input) => {
  const current = await get("smtp");
  const next = {
    host: input.host,
    port: input.port,
    secure: input.secure,
    user: input.user,
    fromName: input.fromName,
    fromEmail: input.fromEmail,
    password: input.password ? encrypt(input.password) : current.password,
  };

  // First save while running on environment settings: carry that password over
  if (!next.password && !current.host && input.user === process.env.EMAIL_USER) {
    next.password = process.env.EMAIL_PASSWORD
      ? encrypt(process.env.EMAIL_PASSWORD)
      : "";
  }

  await set("smtp", next);
};

// ---- Contact form ----

const getContactForm = async () => {
  const saved = await get("contactForm");
  return {
    ...saved,
    fields: { ...DEFAULTS.contactForm.fields, ...saved.fields },
    autoReply: { ...DEFAULTS.contactForm.autoReply, ...saved.autoReply },
  };
};

// Where notifications go: the configured list, else CONTACT_EMAIL
const getRecipients = (contactForm) =>
  contactForm.recipients.length > 0
    ? contactForm.recipients
    : [process.env.CONTACT_EMAIL].filter(Boolean);

// What the public website may know
const getPublic = async () => {
  const [contactForm, analytics] = await Promise.all([
    getContactForm(),
    get("analytics"),
  ]);
  return {
    contactForm: {
      enabled: contactForm.enabled,
      fields: contactForm.fields,
      successMessage: contactForm.successMessage,
    },
    analytics: {
      enabled: analytics.enabled && Boolean(analytics.measurementId),
      measurementId: analytics.measurementId,
    },
  };
};

module.exports = {
  DEFAULTS,
  get,
  set,
  getSmtp,
  getSmtpForAdmin,
  saveSmtp,
  getContactForm,
  getRecipients,
  getPublic,
};
