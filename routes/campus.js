const express = require("express");
const router = express.Router();
const Campus = require("../models/Campus");
const { protectAdmin } = require("../middleware/authMiddleware");

// 1. GET ALL CAMPUSES (Public: Enquiry form aur Admin dono use kar sakein)
// Isse 'protectAdmin' se bahar rakha hai taaki Enquiry form load ho sake
router.get("/", async (req, res) => {
  try {
    // Sabhi active campuses ko fetch karein, newest first
    const campuses = await Campus.find().sort({ createdAt: -1 });
    res.json(campuses);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// 2. CREATE NEW CAMPUS (Admin Only)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Campus name is required" });
    }

    // Case-insensitive duplicate check (e.g., 'ABC' and 'abc' will be same)
    const exists = await Campus.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Campus already exists" });
    }

    const newCampus = new Campus({ name, status: "active" });
    await newCampus.save();
    res.status(201).json(newCampus);
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to add campus", error: err.message });
  }
});

// 3. UPDATE CAMPUS (Admin Only)
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { name, status } = req.body;
    const updatedCampus = await Campus.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true, runValidators: true }
    );

    if (!updatedCampus) {
      return res.status(404).json({ success: false, message: "Campus not found" });
    }

    res.json(updatedCampus);
  } catch (err) {
    res.status(400).json({ success: false, message: "Update failed", error: err.message });
  }
});

// 4. DELETE CAMPUS (Admin Only)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const deletedCampus = await Campus.findByIdAndDelete(req.params.id);
    
    if (!deletedCampus) {
      return res.status(404).json({ success: false, message: "Campus not found" });
    }

    res.json({ success: true, message: "Campus deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
});

module.exports = router;