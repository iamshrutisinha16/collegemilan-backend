const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Qualification", qualificationSchema);