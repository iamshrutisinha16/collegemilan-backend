const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    duration: {
      type: String,
    },

    fees: {
      type: Number,
    },

    description: {
      type: String,
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