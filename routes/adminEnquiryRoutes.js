const express = require("express");
const router = express.Router();

const Enquiry = require("../models/Enquiry");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

//GET All Enquiries 
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const enquiries = await Enquiry.find(filter)
      .populate("course", "name")
      .populate("university", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });

  } catch (error) {
    console.error("Get Enquiries Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


//GET Single Enquiry
router.get("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("course", "name")
      .populate("university", "name");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//UPDATE Status
router.put("/:id/status", protect, protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


//UPDATE Remarks
router.put("/:id/remarks", protect, protectAdmin, async (req, res) => {
  try {
    const { remarks } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { remarks },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//DELETE Enquiry
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;