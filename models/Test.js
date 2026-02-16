const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  qualification: {
    type: String,
    required: true
  },

  title: String,
  price: Number,
  oldPrice: Number,
  deliverables: [String]
});

module.exports = mongoose.model('test', testSchema);