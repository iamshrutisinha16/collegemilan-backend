const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const University = require("../models/University");
const axios = require("axios");

// ✅ SINGLE CLEAN ROUTE
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
      source,
      captchaToken
    } = req.body;

    // ✅ 1. BASIC VALIDATION (sab forms ke liye)
    if (!fullName || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Mobile are required",
      });
    }

    // ✅ 2. CAPTCHA VERIFY
    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Captcha required",
      });
    }

    const params = new URLSearchParams();
    params.append("secret", process.env.GOOGLE_RECAPTCHA_SECRET_KEY.trim());
    params.append("response", captchaToken);

    const captchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!captchaRes.data.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired captcha",
      });
    }

    // ✅ 3. UNIVERSITY CHECK (only if present)
    let redirectLink = null;

    if (university) {
      const selectedUniversity = await University.findById(university);

      if (!selectedUniversity) {
        return res.status(404).json({
          success: false,
          message: "University not found",
        });
      }

      redirectLink = selectedUniversity.bitlink || null;
    }

    // ✅ 4. SAVE DATA (sab forms ke liye common)
    const enquiry = new Enquiry({
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
      source, // important
      status: "New",
    });

    await enquiry.save();

    // ✅ 5. RESPONSE
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink,
      data: enquiry,
    });

  } catch (err) {
    console.error("Enquiry Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

/* const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const University = require("../models/University"); 
const Qualification = require("../models/Qualification");

// Submit form
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
    } = req.body;

    if (!fullName || !mobile || !course || !university) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Fetch selected university to get bitlink
    const selectedUniversity = await University.findById(university);

    if (!selectedUniversity) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Create enquiry
    const enquiry = new Enquiry({
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
      status: "New",
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink: selectedUniversity.bitlink || null, // ✅ send bitlink if exists
      data: enquiry,
    });

  } catch (err) {
    console.error("Create Enquiry Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// Submit form 
router.post("/", async (req, res) => {
   try { const enquiry = new Enquiry(req.body); 
    await enquiry.save();
     res.json({ message: "Enquiry submitted successfully" }); 
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    } });

  // Get all enquiries (admin)
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router; */
