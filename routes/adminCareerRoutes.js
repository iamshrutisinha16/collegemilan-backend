const express = require("express");
const router = express.Router();
const CareerPath = require("../models/CareerPath"); // correct model

// GET all careers
router.get("/", async (req, res) => {
  try {
    const careers = await CareerPath.find({});
    res.json(careers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create new career
router.post("/", async (req, res) => {
  try {
    const { qualification, career, steps } = req.body;

    if (!qualification || !career) {
      return res.status(400).json({ message: "Qualification and Career are required" });
    }

    const newCareer = new CareerPath({ qualification, career, steps });
    await newCareer.save();

    res.status(201).json(newCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update career by ID
router.put("/:id", async (req, res) => {
  try {
    const { qualification, career, steps } = req.body;

    if (!qualification || !career) {
      return res.status(400).json({ message: "Qualification and Career are required" });
    }

    const updatedCareer = await CareerPath.findByIdAndUpdate(
      req.params.id,
      { qualification, career, steps },
      { new: true }
    );

    if (!updatedCareer) return res.status(404).json({ message: "Career not found" });

    res.json(updatedCareer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE career by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCareer = await CareerPath.findByIdAndDelete(req.params.id);

    if (!deletedCareer) return res.status(404).json({ message: "Career not found" });

    res.json({ message: "Career deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;