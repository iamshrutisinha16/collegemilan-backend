const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protectAdmin } = require("../middleware/authMiddleware");

/* ======================================================
   🌐 WEBSITE ROUTE
   GET courses by University ID (ONLY ACTIVE)
====================================================== */

router.get("/:universityId", async (req, res) => {
  try {
    const { universityId } = req.params;

    const courses = await Course.find({
      university: universityId,
      status: "active", // website only active courses
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ======================================================
   🔐 ADMIN ROUTES (Protected)
====================================================== */

/* 🔐 GET ALL COURSES (Admin) */
router.get("/admin/all", protectAdmin, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("university", "name")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Fetch Failed" });
  }
});

/* 🔐 CREATE COURSE */
router.post("/admin", protectAdmin, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Create Failed" });
  }
});

/* 🔐 UPDATE COURSE */
router.put("/admin/:id", protectAdmin, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
});

/* 🔐 DELETE COURSE */
router.delete("/admin/:id", protectAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
});

module.exports = router;