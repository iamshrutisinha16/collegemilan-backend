const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    course_name: {
    type: String,
    required: true,
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true,
  }
});

module.exports = mongoose.model("Course", courseSchema);