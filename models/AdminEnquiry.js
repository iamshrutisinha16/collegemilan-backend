const mongoose = require("mongoose");

const adminenquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
  },

  mobile: {
    type: String,
    required: true,
  },

  gender: String,
  city: String,
  address: String,

  learningMode: {
    type: String,
    enum: ["Online", "Offline", "Distance"],
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
  },

  status: {
    type: String,
    enum: ["New", "Contacted", "Follow-up", "Converted", "Rejected"],
    default: "New",
  },

  remarks: {
    type: String, 
  },

}, { timestamps: true });

module.exports = mongoose.model("AdminEnquiry", adminenquirySchema);