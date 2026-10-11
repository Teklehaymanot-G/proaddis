// HTML emails sent by the website. Built the way email clients need it:
// tables for layout, inline styles, no external images or fonts, so they
// look the same in Gmail, Outlook and on phones.

const BRAND = "#006AAB";
const NAVY = "#04182a";
const SKY = "#72BBDA";
const INK = "#1e293b";
const MUTED = "#64748b";
const LINE = "#e3e8ef";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Plain text with line breaks → safe HTML
const multiline = (value) => escapeHtml(value).replace(/\r?\n/g, "<br />");

// Optional link to the admin, e.g. ADMIN_URL=https://admin.proaddismarketing.com
const adminUrl = () => (process.env.ADMIN_URL || "").replace(/\/$/, "");

const button = (label, href, { primary = true } = {}) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block; margin:0 8px 8px 0;">
    <tr>
      <td style="border-radius:999px; background:${primary ? BRAND : "#ffffff"}; border:1px solid ${primary ? BRAND : LINE};">
        <a href="${escapeHtml(href)}" style="display:inline-block; padding:12px 22px; font-family:${FONT}; font-size:14px; font-weight:600; line-height:1; color:${primary ? "#ffffff" : INK}; text-decoration:none; border-radius:999px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;

// The frame every email shares: navy header with the wordmark, white card,
// small footer. `preheader` is the grey preview text shown in the inbox list.
const layout = ({ preheader, eyebrow, heading, intro, body, footer }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0; padding:0; background:#eef2f6; -webkit-text-size-adjust:100%;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef2f6;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <tr>
            <td style="background:${NAVY}; border-radius:16px 16px 0 0; padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${FONT}; font-size:22px; font-weight:800; letter-spacing:-0.3px; color:#ffffff;">
                    Pro<span style="color:${SKY};">Addis</span>
                    <span style="display:block; margin-top:2px; font-size:10px; font-weight:600; letter-spacing:3px; color:${SKY};">MARKETING</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff; padding:32px 32px 8px;">
              ${eyebrow ? `<p style="margin:0 0 10px; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:${BRAND};">${escapeHtml(eyebrow)}</p>` : ""}
              <h1 style="margin:0; font-family:${FONT}; font-size:24px; line-height:1.25; font-weight:700; color:${INK};">${escapeHtml(heading)}</h1>
              ${intro ? `<p style="margin:12px 0 0; font-family:${FONT}; font-size:15px; line-height:1.6; color:${MUTED};">${intro}</p>` : ""}
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff; padding:16px 32px 32px; border-radius:0 0 16px 16px;">
              ${body}
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 0; font-family:${FONT}; font-size:12px; line-height:1.6; color:#8a97a8; text-align:center;">
              ${footer}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const detailRow = (label, valueHtml) => `
  <tr>
    <td style="padding:10px 0; border-bottom:1px solid ${LINE}; width:110px; vertical-align:top; font-family:${FONT}; font-size:13px; color:${MUTED};">${escapeHtml(label)}</td>
    <td style="padding:10px 0; border-bottom:1px solid ${LINE}; vertical-align:top; font-family:${FONT}; font-size:15px; font-weight:500; color:${INK}; word-break:break-word;">${valueHtml}</td>
  </tr>`;

const link = (href, text) =>
  `<a href="${escapeHtml(href)}" style="color:${BRAND}; text-decoration:none;">${escapeHtml(text)}</a>`;

const formatReceived = (date) =>
  date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: process.env.EMAIL_TIMEZONE || "Africa/Addis_Ababa",
  });

// ---- New message notification (to the team) ----
// message: { name, email, phone?, company?, subject?, message, createdAt }
const contactNotification = (message) => {
  const { name, email, phone, company, subject } = message;
  const received = formatReceived(message.createdAt || new Date());
  const firstLine = message.message.split(/\r?\n/)[0].slice(0, 110);

  const rows = [
    detailRow("Name", escapeHtml(name)),
    detailRow("Email", link(`mailto:${email}`, email)),
    phone ? detailRow("Phone", link(`tel:${phone.replace(/[^\d+]/g, "")}`, phone)) : "",
    company ? detailRow("Company", escapeHtml(company)) : "",
    subject ? detailRow("Subject", escapeHtml(subject)) : "",
    detailRow("Received", escapeHtml(received)),
  ].join("");

  const replySubject = `Re: ${subject || "Your message to ProAddis Marketing"}`;
  const admin = adminUrl();

  const html = layout({
    preheader: `${name}: ${firstLine}`,
    eyebrow: "Website contact form",
    heading: `New message from ${name}`,
    intro: "Someone just sent a message through the contact form on the website.",
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>

      <p style="margin:24px 0 8px; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:${MUTED};">Message</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#f6f9fc; border-left:4px solid ${BRAND}; border-radius:0 10px 10px 0; padding:18px 20px; font-family:${FONT}; font-size:15px; line-height:1.65; color:${INK}; word-break:break-word;">
            ${multiline(message.message)}
          </td>
        </tr>
      </table>

      <div style="margin-top:28px;">
        ${button(`Reply to ${name.split(" ")[0]}`, `mailto:${email}?subject=${encodeURIComponent(replySubject)}`)}
        ${admin ? button("Open in admin", `${admin}/messages`, { primary: false }) : ""}
      </div>`,
    footer: `You are receiving this because your address is set to get contact form messages.<br />Replying to this email answers ${escapeHtml(name)} directly.`,
  });

  const text = [
    `New message from ${name}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    subject ? `Subject: ${subject}` : null,
    `Received: ${received}`,
    "",
    "Message:",
    message.message,
    "",
    `Reply to this email to answer ${name}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { html, text };
};

// ---- Automatic reply (to the visitor) ----
// `body` is the text set in the admin, with {{name}} already filled in
const autoReply = ({ name, body, subject }) => {
  const html = layout({
    preheader: body.replace(/\s+/g, " ").slice(0, 120),
    eyebrow: "Message received",
    heading: subject,
    body: `
      <p style="margin:0; font-family:${FONT}; font-size:15px; line-height:1.7; color:${INK};">${multiline(body)}</p>`,
    footer: `This is an automatic confirmation sent to ${escapeHtml(name)} after using the contact form on the ProAddis Marketing website.`,
  });

  return { html, text: body };
};

// Example data for the preview in the admin
const SAMPLE_MESSAGE = {
  name: "Selam Tesfaye",
  email: "selam@example.com",
  phone: "+251 911 22 33 44",
  company: "Blue Nile Coffee",
  subject: "Rebranding project",
  message:
    "Hello,\n\nWe are planning to refresh our brand before the new season and would like to talk about a logo redesign and a social media campaign.\n\nCould we arrange a call this week?\n\nThank you,\nSelam",
};

module.exports = { contactNotification, autoReply, SAMPLE_MESSAGE };
