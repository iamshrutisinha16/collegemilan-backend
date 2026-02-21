const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

//Get All Users
router.get("/", protect, protectAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete User
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;