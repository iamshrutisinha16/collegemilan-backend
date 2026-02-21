const express = require("express");
const router = express.Router();

const Enquiry = require("../models/Enquiry");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

//Get All Enquiries
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete Enquiry
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;