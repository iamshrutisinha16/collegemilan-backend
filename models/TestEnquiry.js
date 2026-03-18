const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  fullName: String,
  email: String,
  mobile: String,
  city: String,
  course: String
});

module.exports = mongoose.model("TestEnquiry", schema);