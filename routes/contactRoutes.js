const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message, captchaToken } = req.body;

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

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Captcha token missing",
      });
    }

    // ===============================
    // 2️⃣ VERIFY GOOGLE CAPTCHA
    // ===============================
    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
      });
    }

    // ===============================
    // 3️⃣ SAVE TO DATABASE
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
    // 4️⃣ CREATE EMAIL TRANSPORTER
    // ===============================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // Gmail address
        pass: process.env.EMAIL_PASS,   // Gmail App Password
      },
    });

    // ===============================
    // 5️⃣ SEND MAIL TO COLLEGE
    // ===============================
    await transporter.sendMail({
      from: `"College Milan Website" <${process.env.EMAIL_USER}>`,
      to: "iamshrutisinha16@gmail.com",  // 👈 Yaha mail receive hoga
      subject: `New Student Enquiry: ${subject}`,
      html: `
        <h2>New Student Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // ===============================
    // 6️⃣ AUTO REPLY TO STUDENT (OPTIONAL BUT PROFESSIONAL)
    // ===============================
    await transporter.sendMail({
      from: `"College Milan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting College Milan",
      html: `
        <h3>Dear ${firstName},</h3>
        <p>Thank you for contacting College Milan.</p>
        <p>We have received your enquiry and our team will contact you soon.</p>
        <br/>
        <p>Regards,<br/>College Milan Team</p>
      `,
    });

    // ===============================
    // 7️⃣ SUCCESS RESPONSE
    // ===============================
    res.status(200).json({
      success: true,
      message: "Form submitted successfully and email sent!",
    });

  } catch (error) {
    console.error("Contact Route Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

module.exports = router;