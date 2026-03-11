const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  bannerImage: String,

  story: {
    smallTitle: String,
    mainTitle: String,
    description1: String,
    description2: String,
    description3: String,
    image: String,
    since: String
  },

  stats: [
    {
      number: String,
      label: String,
      icon: String
    }
  ],

  mission: {
    title: String,
    description: String
  },

  vision: {
    title: String,
    description: String
  },

  values: [
    {
      title: String,
      desc: String,
      icon: String
    }
  ],
   ctaTitle: { type: String, default: "" },
   ctaDesc: { type: String, default: "" }
});

module.exports = mongoose.model("AboutUs", aboutSchema);