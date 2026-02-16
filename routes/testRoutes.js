const express = require("express");
const router = express.Router();

const Qualification = require("../models/Qualification");
const Test = require("../models/Test");

// Get all qualifications
router.get("/qualifications", async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.json(qualifications);   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET test by qualification name
router.get("/tests/:qualification", async (req, res) => {
  try {
    const { qualification } = req.params;
    console.log("Requested qualification:", qualification);
    const test = await Test.findOne({ qualification });
    console.log("Found test:", test);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
