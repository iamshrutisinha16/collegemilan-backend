const express = require("express");
const PaymentSetting = require("../models/PaymentSetting");
const router = express.Router();

// Get Current Settings (For Admin Panel)
router.get("/", async (req, res) => {
  try {
    let settings = await PaymentSetting.findOne();
    // Agar pehli baar khul raha hai toh khali document return karein
    if (!settings) {
      settings = await PaymentSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Settings (When Sir clicks Save in Admin Panel)
router.put("/", async (req, res) => {
  try {
    const { razorpayKeyId, razorpayKeySecret, isActive } = req.body;
    
    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      {}, // updates the first document it finds
      { razorpayKeyId, razorpayKeySecret, isActive },
      { new: true, upsert: true }
    );
    
    res.json({ message: "Payment settings updated successfully", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;