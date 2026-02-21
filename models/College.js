const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: "", 
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Active", 
  },
}, { timestamps: true }); 

module.exports = mongoose.model("College", collegeSchema);