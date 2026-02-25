const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
      trim: true,
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    qualification: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Qualification",
      required: false,   
    },

    duration: {
      type: String,
      trim: true,
    },

    fees: {
      type: Number,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);