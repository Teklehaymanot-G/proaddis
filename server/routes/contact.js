const express = require("express");
const router = express.Router();
const sendEmail = require("./email.service");

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Email options for contact form
    const mailOptions = {
      to: process.env.CONTACT_EMAIL || "your-email@gmail.com", // Your Gmail address
      subject: `New Contact Form Submission - ProAddis Marketing`,
      text: `
        New contact form submission from ProAddis Marketing website:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
        
        This message was sent from the contact form on proaddismarketing.com
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <div style="text-align:center; margin-bottom: 24px;">
            <img src="https://proaddismarketing.com/logo2.png" alt="ProAddis Marketing" width="164" style="margin-bottom: 12px;" />
            <h2 style="color: #006aab; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #666; margin: 8px 0 0 0;">ProAddis Marketing Website</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 8px; border-left: 4px solid #006aab;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p style="font-size: 16px; color: #333; margin: 12px 0;">
              <strong style="color: #006aab;">Name:</strong> ${name}
            </p>
            <p style="font-size: 16px; color: #333; margin: 12px 0;">
              <strong style="color: #006aab;">Email:</strong> ${email}
            </p>
            <p style="font-size: 16px; color: #333; margin: 12px 0;">
              <strong style="color: #006aab;">Message:</strong><br/>
              <span style="display: inline-block; margin-top: 8px; padding: 12px; background: #f5f5f5; border-radius: 6px; width: 100%;">
                ${message.replace(/\n/g, "<br/>")}
              </span>
            </p>
          </div>
          
          <div style="margin-top: 24px; padding: 16px; background: #e8f4fd; border-radius: 8px;">
            <p style="font-size: 14px; color: #006aab; margin: 0;">
              <strong>📧 Automated Message</strong><br/>
              This email was sent from the contact form on ProAddis Marketing website.
            </p>
          </div>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 13px; color: #aaa; text-align: center;">
            ProAddis Marketing &copy; ${new Date().getFullYear()}<br/>
            Mexico to Kera road, next to Total station, Metamen Building 2nd Floor<br/>
            Addis Ababa, Ethiopia
          </p>
        </div>
      `,
    };

    const result = await sendEmail(mailOptions);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to send email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

module.exports = router;
