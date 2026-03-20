const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message, captchaToken } = req.body;

  if (!firstName || !lastName || !email || !subject || !message || !captchaToken) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields or Captcha token",
    });
  }

  try {
    // CAPTCHA VERIFY
    const params = new URLSearchParams();
    params.append("secret", process.env.GOOGLE_RECAPTCHA_SECRET_KEY);
    params.append("response", captchaToken);

    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

    console.log("GOOGLE CAPTCHA RESULT:", captchaResponse.data);

    // ❌ STOP if captcha fails
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

    // ✅ SEND RESPONSE FAST (IMPORTANT 🔥)
    res.status(200).json({
      success: true,
      message: "Your message has been received!",
    });

    // 🔥 SEND EMAIL ASYNC (NO DELAY)
    (async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Admin email
        await transporter.sendMail({
          from: `"College Milan Website" <${process.env.EMAIL_USER}>`,
          to: "iamshrutisinha16@gmail.com",
          subject: `New Enquiry: ${subject}`,
          html: `
            <h3>New Message</h3>
            <p><b>Name:</b> ${firstName} ${lastName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b> ${message}</p>
          `,
        });

        // User confirmation email
        await transporter.sendMail({
          from: `"College Milan" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "We received your enquiry - College Milan",
          text: `Hi ${firstName}, we will contact you soon!`,
        });

        console.log("Emails sent successfully!");
      } catch (mailError) {
        console.error("Mail Sending Failed:", mailError.message);
      }
    })();

  } catch (error) {
    console.error("SERVER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;