const express = require("express");
const router = express.Router();
const Qualification = require("../models/Qualification");

// GET all qualifications
router.get("/", async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.json(qualifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;