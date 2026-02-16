const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  qualification: {
    type: String,
    required: true
  },
  career: {
    type: String,
    required: true
  },
  steps: [
    {
      type: String
    }
  ]
});

module.exports = mongoose.model('Careerpaths', careerPathSchema);
