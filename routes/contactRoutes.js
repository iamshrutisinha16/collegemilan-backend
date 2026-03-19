const express = require("express");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  try {
    // ===============================
    // 1️⃣ VALIDATION
    // ===============================
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ===============================
    // 2️⃣ SAVE TO DB
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
    // 3️⃣ EMAIL SETUP (FIXED ✅)
    // ===============================
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // 🔥 check connection
    await transporter.verify();
    console.log("✅ SMTP Connected");

    // ===============================
    // 4️⃣ SEND EMAIL (ONLY 1 MAIL)
    // ===============================
    await transporter.sendMail({
      from: `"College Milan" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // 👉 tumhe hi mail ayega
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Enquiry</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("📩 Email sent");

    // ===============================
    // 5️⃣ RESPONSE
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Form submitted & email sent successfully!",
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Email failed or server error",
    });
  }
});

module.exports = router;