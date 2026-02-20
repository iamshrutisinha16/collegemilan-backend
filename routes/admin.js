const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Course = require("../models/Course");
const College = require("../models/College");
const Enquiry = require("../models/Enquiry");

// ✅ Import both middlewares
const { protect, protectAdmin } = require("../middleware/authMiddleware");


// GET DASHBOARD STATS
router.get(
  "/dashboard-stats",
  protect,          // 🔐 First verify token
  protectAdmin,     // 🛡 Then check admin role
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalColleges = await College.countDocuments();
      const totalCourses = await Course.countDocuments();
      const totalEnquiries = await Enquiry.countDocuments();

      res.json({
        totalUsers,
        totalColleges,
        totalCourses,
        totalEnquiries,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      res.status(500).json({ message: "Dashboard Error" });
    }
  }
);

module.exports = router;