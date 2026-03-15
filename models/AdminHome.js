const mongoose = require("mongoose")

const featureSchema = new mongoose.Schema({
 title:String,
 description:String,
})

const serviceSchema = new mongoose.Schema({
 title:String,
 description:String
})

const statSchema = new mongoose.Schema({
 number:String,
 title:String
})

const blogSchema = new mongoose.Schema({
 title:String,
 category:String,
 image:String
})

const pageSchema = new mongoose.Schema({

 pageName:{
  type:String,
  required:true
 },

 heroSection:{
  title:String,
  description:String,
  buttonText:String,
  heroImage:String
 },

 featuresSection:[featureSchema],

 founderSection:{
  since:String,
  title:String,
  description:String,
  founderName:String,
  image:String
 },

 videoSection:{
  title:String,
  videoUrl:String
 },

 servicesSection:[serviceSchema],

 statsSection:[statSchema],

 blogSection:[blogSchema],

 testimonialSection:{
  quote:String,
  name:String,
  role:String
 },

 metaTitle:String,
 metaDescription:String

})

module.exports = mongoose.model("Page",pageSchema)