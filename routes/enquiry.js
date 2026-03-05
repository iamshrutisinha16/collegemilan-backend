const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const University = require("../models/University"); // ✅ university model

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

// Get all enquiries (admin)
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;