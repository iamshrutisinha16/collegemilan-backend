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
      default: null, 
    },

    duration: {
      type: String,
      trim: true,
      default: "",
    },

    fees: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    strictPopulate: false, 
  }
);

module.exports = mongoose.model("Course", courseSchema);