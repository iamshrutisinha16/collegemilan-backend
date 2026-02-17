const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  qualification: {
    type: String,
    required: true
  },

  title: String,
  price: Number,
  oldPrice: Number,
  deliverables: [String],
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
});

module.exports = mongoose.model('test', testSchema);