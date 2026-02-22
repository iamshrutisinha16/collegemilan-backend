const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: "College Milan" },
    logoUrl: { type: String, default: "" },
    primaryColor: { type: String, default: "#4D96FF" },
    secondaryColor: { type: String, default: "#FFD93D" },
    footerText: { type: String, default: "© 2026 College Milan" },
    defaultLanguage: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Kolkata" },
  },
  admin: {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }, 
  },
  notifications: {
    newUser: { type: Boolean, default: true },
    newEnquiry: { type: Boolean, default: true },
    newCourse: { type: Boolean, default: true },
  },
  security: {
    minPasswordLength: { type: Number, default: 8 },
    sessionTimeout: { type: Number, default: 60 }, 
  },
  integrations: {
    smtp: {
      host: { type: String, default: "" },
      port: { type: Number, default: 587 },
      user: { type: String, default: "" },
      pass: { type: String, default: "" },
    },
    paymentGatewayKey: { type: String, default: "" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);