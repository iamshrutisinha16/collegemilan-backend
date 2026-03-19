const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message, captchaToken } = req.body;

  // 1️⃣ पक्का करें कि डेटा आ रहा है
  if (!firstName || !lastName || !email || !subject || !message || !captchaToken) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields or Captcha token",
    });
  }

  try {
    // 2️⃣ VERIFY GOOGLE CAPTCHA
    // नोट: यहाँ URLSearchParams का उपयोग करना ज्यादा आसान है
    const params = new URLSearchParams();
    params.append('secret', process.env.GOOGLE_RECAPTCHA_SECRET_KEY);
    params.append('response', captchaToken);

    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

    console.log("GOOGLE CAPTCHA RESULT:", captchaResponse.data);

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed. Please try again.",
        errors: captchaResponse.data["error-codes"]
      });
    }

    // 3️⃣ SAVE TO DATABASE
    const newContact = new Contact({ firstName, lastName, email, subject, message });
    await newContact.save();

    // 4️⃣ SEND EMAILS (इस हिस्से को try-catch में रखा है ताकि ईमेल फेल होने पर पूरा सर्वर 500 न दे)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // यहाँ Gmail App Password होना चाहिए
        },
      });

      // Admin को ईमेल
      await transporter.sendMail({
        from: `"College Milan Website" <${process.env.EMAIL_USER}>`,
        to: "iamshrutisinha16@gmail.com",
        subject: `New Enquiry: ${subject}`,
        html: `<h3>New Message</h3><p>From: ${firstName} ${lastName}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
      });

      // User को ऑटो-रिप्लाई
      await transporter.sendMail({
        from: `"College Milan" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We received your enquiry - College Milan",
        text: `Hi ${firstName}, we will contact you soon!`,
      });

      console.log("Emails sent successfully!");
    } catch (mailError) {
      console.error("Mail Sending Failed:", mailError.message);
      // हम यहाँ से return नहीं करेंगे क्योंकि डेटाबेस में मैसेज सेव हो चुका है
    }

    // 5️⃣ Final Success Response
    return res.status(200).json({
      success: true,
      message: "Your message has been received!",
    });

  } catch (error) {
    console.error("SERVER ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please check backend logs.",
      details: error.message
    });
  }
});

module.exports = router;