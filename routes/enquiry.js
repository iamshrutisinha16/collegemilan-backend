const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

// Submit form
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
