const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/:universityId", async (req, res) => {
  try {
    const { universityId } = req.params;

    const courses = await Course.find({
      university: universityId,
      status: "active",
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;