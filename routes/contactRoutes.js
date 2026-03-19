const express = require("express");
// const axios = require("axios");
// const nodemailer = require("nodemailer");
// const qs = require("querystring");

const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  try {
    // ===============================
    // 1️⃣ CHECK REQUIRED FIELDS
    // ===============================
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ===============================
    // ❌ CAPTCHA TEMP DISABLED
    // ===============================
    // if (!captchaToken) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Captcha token missing",
    //   });
    // }

    // ===============================
    // ❌ CAPTCHA VERIFY DISABLED
    // ===============================
    /*
    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      qs.stringify({
        secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
      });
    }
    */

    // ===============================
    // 2️⃣ SAVE TO DATABASE
    // ===============================
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    await newContact.save();

    // ===============================
    // ❌ EMAIL DISABLED
    // ===============================
    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({ ... });
    await transporter.sendMail({ ... });
    */

    // ===============================
    // ✅ SUCCESS RESPONSE
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully!",
    });

  } catch (error) {
    console.error("Contact Route Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;