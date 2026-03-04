const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const { protect, protectAdmin } = require("../middleware/authMiddleware");


// ================= CREATE COURSE =================
router.post("/", protect, protectAdmin, async (req, res) => {
  try {
    const {
      course_name,
      university,
      qualification,
      duration,
      fees,
      description,
      status,
    } = req.body;

    // 🔥 Basic Validation
    if (!course_name || !university) {
      return res.status(400).json({
        success: false,
        message: "Course Name and University are required",
      });
    }

    const course = await Course.create({
      course_name: course_name.trim(),
      university,
      qualification: qualification || null,
      duration: duration || "",
      fees: fees || 0,
      description: description || "",
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });

  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while creating course",
    });
  }
});


// ================= GET ALL COURSES =================
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate("university", "name")
      .populate("qualification", "name");

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });

  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching courses",
    });
  }
});


// ================= UPDATE COURSE =================
router.put("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const {
      course_name,
      university,
      qualification,
      duration,
      fees,
      description,
      status,
    } = req.body;

    const updateData = {};

    if (course_name !== undefined) updateData.course_name = course_name.trim();
    if (university !== undefined) updateData.university = university;
    if (qualification !== undefined)
      updateData.qualification = qualification || null;
    if (duration !== undefined) updateData.duration = duration;
    if (fees !== undefined) updateData.fees = fees;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while updating course",
    });
  }
});


// ================= DELETE COURSE =================
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while deleting course",
    });
  }
});

module.exports = router;