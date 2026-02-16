const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET courses by University ID
router.get("/:universityId", async (req, res) => {
    try {
        // 1. Param ka naam aur niche wala naam SAME hona chahiye (Dono small 'u')
        const { universityId } = req.params; 
        
        console.log("Searching courses for Univ ID:", universityId); // Debugging ke liye

        const courses = await Course.find({
            university: universityId, // Aapke DB mein field ka naam 'university' hai
        });

        res.json(courses);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: error.message }); // 'err' ko 'error' kiya
    }
});

router.post("/", async (req, res) => {
    try {
        // 'course' lowercase mein model nahi variable hona chahiye
        const newCourse = new Course(req.body); 
        await newCourse.save();
        res.json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;