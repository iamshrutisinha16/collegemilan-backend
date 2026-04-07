const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Campus", campusSchema);