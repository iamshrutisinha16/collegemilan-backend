const express = require("express");
const router = express.Router();
const GeneralEnquiry = require("../models/TestEnquiry");

router.post("/general-enquiry", async (req, res) => {
  try {
    const { fullName, email, mobile, city, course } = req.body;

    if (!fullName || !email || !mobile || !city || !course) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = new GeneralEnquiry(req.body);
    await data.save();

    res.status(201).json({ message: "Success" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;