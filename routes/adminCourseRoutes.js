const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// CREATE Course
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    const { name, qualification, duration } = req.body;

    const course = await Course.create({
      name,
      qualification: qualification || null, 
      duration,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET All Courses
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    try {
      const hasQualification = courses.some((c) => c.qualification);
      if (hasQualification) {
        await Course.populate(courses, { path: "qualification", select: "name" });
      }
    } catch (popErr) {
      console.warn("Populate warning (ignored):", popErr.message);
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Courses Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE Course
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const { name, qualification, duration } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, qualification: qualification || null, duration },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Update Course Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ========================
// DELETE Course
// ========================
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;