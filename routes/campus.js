const express = require("express");
const router = express.Router();
const Campus = require("../models/Campus");
const { protectAdmin } = require("../middleware/authMiddleware"); // ✅ Token check karne ke liye middleware

// 1. Sabhi Active Campus get karne ke liye (Sab ke liye open - Public)
router.get("/", async (req, res) => {
  try {
    // Newest campus upar dikhega isliye sort({ createdAt: -1 })
    const campuses = await Campus.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(campuses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campuses", error: err.message });
  }
});

// 2. Naya campus add karne ke liye (Admin Only)
// NOTE: Frontend se '/api/admin/campuses' hit hoga
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Campus name is required" });
    }

    // Duplicate check
    const exists = await Campus.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Campus already exists" });
    }

    const newCampus = new Campus({ name, status: "active" });
    await newCampus.save();
    res.status(201).json(newCampus);
  } catch (err) {
    res.status(400).json({ message: "Failed to add campus", error: err.message });
  }
});

// 3. Campus EDIT/UPDATE karne ke liye (Admin Only)
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { name, status } = req.body;
    const updatedCampus = await Campus.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true } // Updated data wapas milega
    );

    if (!updatedCampus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    res.json(updatedCampus);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// 4. Campus DELETE karne ke liye (Admin Only)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const deletedCampus = await Campus.findByIdAndDelete(req.params.id);
    
    if (!deletedCampus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    res.json({ message: "Campus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;