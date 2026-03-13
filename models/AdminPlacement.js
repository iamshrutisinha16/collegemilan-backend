const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({

  heroBadge:String,
  heroTitle:String,
  heroHighlight:String,
  heroDescription:String,
  heroImage:String,

  aboutTitle:String,
  aboutDescription:String,
  aboutImage:String,
  placementRate:String,

  features:[
    {
      icon:String,
      title:String,
      description:String
    }
  ],

  recruiters:[
    {
      name:String,
      logo:String
    }
  ],

  highlights:[
    {
      icon:String,
      title:String,
      description:String
    }
  ],

  ctaTitle:String,
  ctaDescription:String,
  ctaButton:String

},{timestamps:true})

module.exports = mongoose.model("Placement",placementSchema)