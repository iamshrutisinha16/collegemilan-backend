const express = require("express");
const router = express.Router();
const Settings = require("../models/AdminSetting");
const bcrypt = require("bcryptjs");

// GET Settings
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT / Update Settings
router.put("/", async (req, res) => {
  try {
    const updates = req.body;

    if (updates.admin?.password) {
      // Hash password if updated
      updates.admin.password = await bcrypt.hash(updates.admin.password, 10);
    }

    const settings = await Settings.findOneAndUpdate({}, updates, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;