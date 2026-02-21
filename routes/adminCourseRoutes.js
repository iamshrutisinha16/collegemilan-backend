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
      qualification,
      duration,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET All Courses
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("qualification", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE Course
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const { name, qualification, duration } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, qualification, duration },
      { new: true }
    );

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE Course
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;