const jwt = require("jsonwebtoken");

// Use environment variable first, fallback to hardcoded secret
const SECRET_KEY = process.env.JWT_SECRET || "MY_SECRET_KEY_123";

// 🔐 Protect routes (check token)
const protect = (req, res, next) => {
  let token;

  // Check for Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // verify JWT
    req.user = decoded; // attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// 🛡 Only allow admin users
const protectAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

module.exports = { protect, protectAdmin };