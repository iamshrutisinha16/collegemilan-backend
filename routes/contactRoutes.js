const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message, captchaToken } = req.body;

  // ✅ VALIDATION
  if (!firstName || !lastName || !email || !subject || !message || !captchaToken) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields or Captcha token",
    });
  }

  try {
    // ✅ CAPTCHA VERIFY
    const params = new URLSearchParams();
    params.append("secret", process.env.GOOGLE_RECAPTCHA_SECRET_KEY.trim());
    params.append("response", captchaToken);

    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

    console.log("CAPTCHA RESULT:", captchaResponse.data);

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha expired or invalid. Please try again.",
        errors: captchaResponse.data["error-codes"],
      });
    }

    // ✅ SAVE TO DB
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    await newContact.save();
    console.log("✅ Data saved to DB");

    // ✅ SEND RESPONSE FAST
    res.status(200).json({
      success: true,
      message: "Your message has been received!",
    });

    // 🔥 EMAIL SEND (ASYNC + SAFE)
    (async () => {
      try {
        console.log("📧 Starting email process...");

        // ✅ STRONG SMTP CONFIG (NO 'service: gmail')
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // ✅ VERIFY CONNECTION
        await transporter.verify();
        console.log("✅ SMTP Connected");

        // 📩 ADMIN EMAIL
        await transporter.sendMail({
          from: `"College Milan Website" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, // send to yourself
          subject: `New Enquiry: ${subject}`,
          html: `
            <h3>New Message</h3>
            <p><b>Name:</b> ${firstName} ${lastName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b> ${message}</p>
          `,
        });

        // 📩 USER EMAIL
        await transporter.sendMail({
          from: `"College Milan" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "We received your enquiry - College Milan",
          text: `Hi ${firstName}, we will contact you soon!`,
        });

        console.log("✅ Emails sent successfully");

      } catch (mailError) {
        console.error("❌ FULL MAIL ERROR:", mailError);
      }
    })();

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;