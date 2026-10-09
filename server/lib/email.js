const nodemailer = require("nodemailer");
const settings = require("./settings");

const createTransport = (smtp) =>
  nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.password } : undefined,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });

const fromAddress = (smtp) => {
  const email = smtp.fromEmail || smtp.user;
  return smtp.fromName ? `"${smtp.fromName.replace(/"/g, "")}" <${email}>` : email;
};

// Sends with the current SMTP settings. Never throws: returns
// { success, messageId } or { success: false, error }.
const sendEmail = async (mailOptions, smtpOverride) => {
  try {
    const smtp = smtpOverride || (await settings.getSmtp());
    if (!smtp.host) {
      return { success: false, error: "Email (SMTP) is not configured" };
    }

    const info = await createTransport(smtp).sendMail({
      ...mailOptions,
      from: fromAddress(smtp),
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
