const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// CREATE Course
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    console.log("Incoming Course Payload:", req.body);

    const { course_name, university, qualification, duration } = req.body;

    if (!course_name || !university) {
      console.log("Validation failed:", req.body);
      return res.status(400).json({ message: "Course Name and University are required" });
    }

    const course = await Course.create({
      course_name,
      university,
      qualification: qualification || null,
      duration,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: error.message });
  }
});
// GET All Courses
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).populate([
      { path: "university", select: "name" },
      { path: "qualification", select: "name" },
    ]);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Courses Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE Course
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const { course_name, university, qualification, duration } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        course_name,
        university,
        qualification: qualification || null,
        duration,
      },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    console.error("Update Course Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE Course
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;