const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: false,
    },

    learningMode: {
      type: String,
      enum: ["online", "offline", "distance"],
      required: false,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
    type: String,
    required: false,
    trim: true,
},

    address: {
      type: String,
      required: false,
      trim: true,
    },

    //ADMIN IMPORTANT FIELD
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-Up", "Converted", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);