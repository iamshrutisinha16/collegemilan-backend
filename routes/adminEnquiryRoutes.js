const express = require("express");
const router = express.Router();

const Enquiry = require("../models/Enquiry");
const University = require("../models/University");

const { protect, protectAdmin } = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      course,
      university,
      qualification, // Added
      message,
    } = req.body;

    if (!name || !phone || !course || !university) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const selectedUniversity = await University.findById(university);
    if (!selectedUniversity) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      course,
      university,
      qualification, // Save qualification too
      message,
      status: "New",
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink: selectedUniversity.bitlink || null,
      data: enquiry,
    });

  } catch (error) {
    console.error("Create Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while submitting enquiry",
      error: error.message, // helpful for debugging
    });
  }
});

// ==========================================
// ADMIN: GET ALL ENQUIRIES (FILTER SUPPORT)
// ==========================================
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const enquiries = await Enquiry.find(filter)
      .populate("course", "course_name")
      .populate("university", "name bitlink")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });

  } catch (error) {
    console.error("Get Enquiries Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching enquiries",
    });
  }
});


// ==========================================
// ADMIN: GET SINGLE ENQUIRY
// ==========================================
router.get("/:id", protect, protectAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("course", "course_name")
      .populate("university", "name bitlink");

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
    console.error("Get Single Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================================
// ADMIN: UPDATE STATUS
// ==========================================
router.put("/:id/status", protect, protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "New",
      "Contacted",
      "Converted",
      "Rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("course", "course_name")
      .populate("university", "name bitlink");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================================
// ADMIN: UPDATE REMARKS
// ==========================================
router.put("/:id/remarks", protect, protectAdmin, async (req, res) => {
  try {
    const { remarks } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { remarks },
      { new: true }
    )
      .populate("course", "course_name")
      .populate("university", "name bitlink");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Remarks updated successfully",
      data: enquiry,
    });

  } catch (error) {
    console.error("Update Remarks Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================================
// ADMIN: DELETE ENQUIRY
// ==========================================
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
    console.error("Delete Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;