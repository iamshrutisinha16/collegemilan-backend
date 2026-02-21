const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Enquiry = require("../models/Enquiry");
const Course = require("../models/Course");
const Test = require("../models/Test");
const University = require("../models/University");

const { protect, protectAdmin } = require("../middleware/authMiddleware");

// GET Dashboard Stats
router.get(
  "/stats",
  protect,
  protectAdmin,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalEnquiries = await Enquiry.countDocuments();
      const totalCourses = await Course.countDocuments();
      const totalTests = await Test.countDocuments();
      const totalUniversities = await University.countDocuments();

      // 🔥 Send direct object (frontend friendly)
      res.status(200).json({
        totalUsers,
        totalEnquiries,
        totalCourses,
        totalTests,
        totalUniversities,
      });

    } catch (error) {
      console.error("Dashboard Stats Error:", error.message);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

module.exports = router;