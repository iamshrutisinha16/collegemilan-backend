const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Test = require("../models/Test");
const Payment = require("../models/Payment");

router.get("/dashboard-data", auth, async (req, res) => {
    try {
        // 1. Profile fetch karein
        const profile = await User.findById(req.user.id).select("-password");
        
        // 2. Tests fetch karein
        const tests = await Test.find({ user: req.user.id });

        const payments = await Payment.find({ user: req.user.id }).populate("test");
        res.json({ 
            profile, 
            tests, 
            payments 
        });
        
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;