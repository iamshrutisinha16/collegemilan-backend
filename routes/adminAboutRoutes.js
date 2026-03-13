const express = require("express");
const AboutUs = require("../models/AdminAboutus");

const router = express.Router();

// GET about content
router.get("/about", async (req, res) => {
  try {
    const data = await AboutUs.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE about content
router.put("/about", async (req, res) => {
  try {
    const updated = await AboutUs.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;