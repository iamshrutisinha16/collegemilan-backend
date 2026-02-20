const express = require("express");
const router = express.Router();
const College = require("../models/College");
const { protectAdmin } = require("../middleware/authMiddleware");

/* CREATE */
router.post("/", protectAdmin, async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: "Create Failed" });
  }
});

/* GET ALL */
router.get("/", protectAdmin, async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Fetch Failed" });
  }
});

/* UPDATE */
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
});

/* DELETE */
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ message: "College Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
});

module.exports = router;