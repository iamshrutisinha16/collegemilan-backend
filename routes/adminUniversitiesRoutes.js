const express = require("express");
const router = express.Router();
const University = require("../models/University");


// ================= ADD UNIVERSITY =================
router.post("/", async (req, res) => {
  try {
    const { name, state, bitlink, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "University name is required",
      });
    }

    const newUniversity = await University.create({
      name,
      state: state || "",
      bitlink: bitlink || "",
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      data: newUniversity,
    });

  } catch (error) {
    console.error("Create University Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ================= GET ALL UNIVERSITIES =================
router.get("/", async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });

  } catch (error) {
    console.error("Get Universities Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ================= UPDATE UNIVERSITY =================
router.put("/:id", async (req, res) => {
  try {
    const { name, state, bitlink, status } = req.body;

    const updatedUniversity = await University.findByIdAndUpdate(
      req.params.id,
      {
        name,
        state,
        bitlink: bitlink || "",
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUniversity) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUniversity,
    });

  } catch (error) {
    console.error("Update University Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ================= DELETE UNIVERSITY =================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUniversity = await University.findByIdAndDelete(req.params.id);

    if (!deletedUniversity) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });

  } catch (error) {
    console.error("Delete University Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;