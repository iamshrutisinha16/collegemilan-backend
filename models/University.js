const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔥 Redirect ke liye most important field
    bitlink: {
      type: String,
      trim: true,
      default: "",  // empty rahe toh redirect nahi hoga
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("University", universitySchema);