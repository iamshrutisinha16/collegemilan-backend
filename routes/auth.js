const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

// ✅ Google Client Setup
const client = new OAuth2Client(
  "601784931771-190n8hdisb0crckht1g3v26aml6pntlc.apps.googleusercontent.com"
);

/* =========================
   REGISTER (Email/Password)
========================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user.id,
      email: user.email,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================
   LOGIN (Email/Password)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        email: user.email,
        role: user.role,
        message: "Login Successful",
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================
   GOOGLE LOGIN
========================= */
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "601784931771-190n8hdisb0crckht1g3v26aml6pntlc.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If not exist, create new user
    if (!user) {
      user = await User.create({
        email,
        password: null, // No password for Google users
      });
    }

    res.json({
      _id: user.id,
      email: user.email,
      message: "Google Login Successful",
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google Login Failed" });
  }
});

module.exports = router;
