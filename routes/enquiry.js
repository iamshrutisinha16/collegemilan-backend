const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const University = require("../models/University");
const axios = require("axios");

// ✅ SINGLE FINAL ROUTE
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
      captchaToken,
    } = req.body;

    // ================= CAPTCHA =================
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

    // ================= SMART VALIDATION =================

    // 👉 FULL FORM (course + university present)
    if (course && university) {
      if (!fullName || !mobile || !course || !university) {
        return res.status(400).json({
          success: false,
          message: "Full form required fields missing",
        });
      }
    } else {
      // 👉 HOMEPAGE FORM
      if (!fullName || !mobile) {
        return res.status(400).json({
          success: false,
          message: "Name and Mobile required",
        });
      }
    }

    // ================= UNIVERSITY LOGIC =================
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

    // ================= SAVE =================
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
      source,
      status: "New",
    });

    await enquiry.save();

    // ================= RESPONSE =================
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

// ================= GET ALL (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
