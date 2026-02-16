const express = require('express');
const router = express.Router();
const CareerPath = require('../models/CareerPath'); // correct model

// ----------------------
// GET all careers (for dropdown)
// ----------------------
router.get('/', async (req, res) => {
  try {
    // Fetch only career names and qualification for dropdown
    const careers = await CareerPath.find({}, { _id: 0, qualification: 1, career: 1 });
    res.json(careers);
  } catch (error) {
    console.error("GET /api/careers error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// POST user selection (/submit)
// ----------------------
router.post('/submit', async (req, res) => {
  try {
    const { qualification, dreamCareer } = req.body;

    // Find the career path in DB
    const path = await CareerPath.findOne({
      qualification: qualification,
      career: dreamCareer
    });

    if (!path) {
      return res.status(404).json({ message: "No career path found" });
    }

    // Send full path steps along with input
    res.json({
      message: "Career data received",
      qualification: path.qualification,
      dreamCareer: path.career,
      steps: path.steps
    });

  } catch (error) {
    console.error("POST /api/careers/submit error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

