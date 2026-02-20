const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Admin");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const College = require("../models/College");
const Enquiry = require("../models/Enquiry");

const { protect, protectAdmin } = require("../middleware/authMiddleware");

const SECRET_KEY = "MY_SECRET_KEY_123";

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//DASHBOARD
router.get(
  "/dashboard-stats",
  protect,
  protectAdmin,
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