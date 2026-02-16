const mongoose = require('mongoose');
const enquirySchema = new mongoose.Schema({
  course: String,
  university: String,
  learningMode: String,
  fullName: String,
  gender: String,
  email: String,
  mobile: String,
  city: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Enquiry", enquirySchema);