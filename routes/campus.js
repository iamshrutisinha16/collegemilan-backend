const express = require("express");
const router = express.Router();
const Campus = require("../models/Campus");

// Yahan maine 'protect' ko bhi add kiya hai
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// 1. GET ALL (Sabke liye open hai)
router.get("/", async (req, res) => {
  try {
    const data = await Campus.find().sort("-createdAt");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 2. CREATE (Ab 'protect' pehle token check karega, phir 'protectAdmin' role dekhega)
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    // Body se 'name' le rahe hain (frontend se yahi bhej rahe honge aap)
    const newCampus = new Campus({ name: req.body.name });
    await newCampus.save();
    res.status(201).json(newCampus);
  } catch (err) {
    res.status(400).json({ message: "Add failed", error: err.message });
  }
});

// 3. UPDATE (Isme bhi protect add kiya)
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const updated = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// 4. DELETE (Isme bhi protect add kiya)
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Campus.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;