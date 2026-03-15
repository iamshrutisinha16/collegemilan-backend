const mongoose = require("mongoose")

const featureSchema = new mongoose.Schema({
  title:{
    type:String,
    default:""
  },
  description:{
    type:String,
    default:""
  },
  icon:{
    type:String,
    default:""
  }
})


const serviceSchema = new mongoose.Schema({
  title:{
    type:String,
    default:""
  },
  description:{
    type:String,
    default:""
  }
})


const statSchema = new mongoose.Schema({
  number:{
    type:String,
    default:""
  },
  title:{
    type:String,
    default:""
  }
})

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    default:""
  },
  category:{
    type:String,
    default:""
  },
  image:{
    type:String,
    default:""
  }
})

const pageSchema = new mongoose.Schema({

  pageName:{
    type:String,
    required:true,
    default:"home",
    unique:true
  },

  heroSection:{
    title:{
      type:String,
      default:""
    },
    description:{
      type:String,
      default:""
    },
    buttonText:{
      type:String,
      default:""
    },
    heroImage:{
      type:String,
      default:""
    }
  },

  featuresSection:[featureSchema],

  founderSection:{
    since:{
      type:String,
      default:""
    },
    title:{
      type:String,
      default:""
    },
    description:{
      type:String,
      default:""
    },
    founderName:{
      type:String,
      default:""
    },
    image:{
      type:String,
      default:""
    }
  },

  videoSection:{
    title:{
      type:String,
      default:""
    },
    videoUrl:{
      type:String,
      default:""
    }
  },

  servicesSection:[serviceSchema],
  statsSection:[statSchema],
  blogSection:[blogSchema],
  testimonialSection:{
    quote:{
      type:String,
      default:""
    },
    name:{
      type:String,
      default:""
    },
    role:{
      type:String,
      default:""
    }
  },

  metaTitle:{
    type:String,
    default:""
  },

  metaDescription:{
    type:String,
    default:""
  }

},
{
  timestamps:true
})

module.exports = mongoose.model("Page",pageSchema)