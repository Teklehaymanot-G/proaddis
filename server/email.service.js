const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    // Verify connection first
    await transporter.verify();
    console.log("Server is ready to send emails");

    const info = await transporter.sendMail({
      ...mailOptions,
      from: `"ProAddis Marketing" <${process.env.EMAIL_USER}>`,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
