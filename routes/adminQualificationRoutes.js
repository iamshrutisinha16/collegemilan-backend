const express = require("express");
const router = express.Router();

const Qualification = require("../models/Qualification");
const { protect, protectAdmin } = require("../middleware/authMiddleware");


// CREATE Qualification
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    const { name, price, oldPrice } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }

    const qualification = await Qualification.create({
      name,
      price,
      oldPrice,
    });

    res.status(201).json(qualification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET All Qualifications
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ createdAt: -1 });
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE Qualification
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const { name, price, oldPrice } = req.body;

    const updatedQualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      { name, price, oldPrice },
      { new: true }
    );

    res.status(200).json(updatedQualification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE Qualification
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Qualification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;