const express = require('express');
const axios = require('axios');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
    const { firstName, lastName, email, subject, message, captchaToken } = req.body;

    // Captcha check
    if (!captchaToken) {
        return res.status(400).json({ success: false, message: "Captcha token missing" });
    }

    try {
        // ReCAPTCHA verification
       const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY || "YOUR_SECRET_KEY_HERE";
       const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
       const response = await axios.post(verifyUrl);

        if (!response.data.success) {
           return res.status(400).json({ success: false, message: "Captcha verification failed" });
        }

        // Save form to DB
        const newContact = new Contact({ firstName, lastName, email, subject, message });
        await newContact.save();

        res.json({ success: true, message: "Form submitted successfully!" });
    } catch (err) {
        console.error("Contact route error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
