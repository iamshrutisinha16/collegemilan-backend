const express = require("express");
const router = express.Router();

const Qualification = require("../models/Qualification");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// CREATE Qualification
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    const qualification = await Qualification.create({ name });

    res.status(201).json(qualification);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET All Qualifications
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ createdAt: -1 });
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE Qualification
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.status(200).json(qualification);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE Qualification
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Qualification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;