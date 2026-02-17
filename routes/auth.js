const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client("601784931771-190n8hdisb0crckht1g3v26aml6pntlc.apps.googleusercontent.com");

// Token banane ka function (Cleaner code ke liye)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, "MY_SECRET_KEY_123", { expiresIn: "30d" });
};

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user._id, user.role), // TOKEN ADDED
      _id: user.id,
      email: user.email,
      message: "Account Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id, user.role), // TOKEN ADDED
        _id: user.id,
        email: user.email,
        role: user.role,
        message: "Login Successful",
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* GOOGLE LOGIN */
router.post("/google", async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: "601784931771-190n8hdisb0crckht1g3v26aml6pntlc.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, password: null });
    }

    res.json({
      token: generateToken(user._id, user.role), // TOKEN ADDED
      _id: user.id,
      email: user.email,
      message: "Google Login Successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Google Login Failed" });
  }
});

module.exports = router;