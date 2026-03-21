const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // image path ya URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);