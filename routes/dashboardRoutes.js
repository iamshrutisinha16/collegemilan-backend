const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Enquiry = require("../models/Enquiry");
const Course = require("../models/Course");
const Test = require("../models/Test");
const University = require("../models/University");

const { protect, protectAdmin } = require("../middleware/authMiddleware");


// =============================
// 1️⃣ Dashboard Stats
// =============================
router.get("/stats", protect, protectAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalUniversities = await University.countDocuments();

    res.status(200).json({
      totalUsers,
      totalEnquiries,
      totalCourses,
      totalTests,
      totalUniversities,
    });

  } catch (error) {
    console.error("Stats Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// =============================
// 2️⃣ Recent Enquiries
// =============================
router.get("/recent-enquiries", protect, protectAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry
      .find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(enquiries);

  } catch (error) {
    console.error("Recent Enquiries Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// =============================
// 3️⃣ Monthly Enquiries Data
// =============================
router.get("/monthly-enquiries", protect, protectAdmin, async (req, res) => {
  try {
    const monthlyData = await Enquiry.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(monthlyData);

  } catch (error) {
    console.error("Monthly Enquiries Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;