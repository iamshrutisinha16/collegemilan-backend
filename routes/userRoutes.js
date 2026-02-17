const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Test = require("../models/Test");
const Payment = require("../models/Payment");

router.get("/dashboard-data", auth, async (req, res) => {
    try {
        // req.user humein middleware se mil raha hai
        const profile = await User.findById(req.user.id).select("-password");
        const tests = await Test.find({ user: req.user.id });

        res.json({ profile, tests });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;