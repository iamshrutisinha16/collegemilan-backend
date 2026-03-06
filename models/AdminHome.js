const mongoose = require("mongoose")

const AdminHomeSchema = new mongoose.Schema({

hero:{
 title:String,
 description:String,
 button:String
},

about:{
 title:String,
 description:String
},

video:{
 title:String,
 url:String
},

stats:{
 students:String,
 workshops:String,
 years:String,
 impact:String
},

testimonial:{
 name:String,
 course:String,
 review:String
},

blogs:[
{
 category:String,
 title:String
}
]

})

module.exports = mongoose.model("AdminHome", AdminHomeSchema)