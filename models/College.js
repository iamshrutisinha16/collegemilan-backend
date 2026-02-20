const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true
    },
    location: { type: String },
    website: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);