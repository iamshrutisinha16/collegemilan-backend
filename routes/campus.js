const express = require("express");
const router = express.Router();
const Campus = require("../models/Campus");
const { protectAdmin } = require("../middleware/authMiddleware");

// 1. GET ALL (Debug mode: Ise temporary bina protectAdmin ke rakhte hain check karne ke liye)
router.get("/", async (req, res) => {
  try {
    const data = await Campus.find().sort("-createdAt");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 2. CREATE (Admin Required)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const newCampus = new Campus({ name: req.body.name });
    await newCampus.save();
    res.status(201).json(newCampus);
  } catch (err) {
    res.status(400).json({ message: "Add failed", error: err.message });
  }
});

// 3. UPDATE (Admin Required)
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const updated = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// 4. DELETE (Admin Required)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await Campus.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;