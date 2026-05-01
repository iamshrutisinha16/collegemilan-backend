const mongoose = require("mongoose");

// Feature schema
const featureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  link: { type: String, default: "/default-link", trim: true },
  color: { type: String, default: "#000000", trim: true }
});

// Service schema
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true }
});

// Stat schema
const statSchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true }, 
  image: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }, 
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Founder section schema
const founderSectionSchema = new mongoose.Schema({
  since: { type: String, trim: true },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  founderName: { type: String, trim: true },
  image1: { type: String, trim: true },
  image2: { type: String, trim: true },
  image3: { type: String, trim: true }
});

const videoSectionSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  videoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+/.test(v);
      }
    }
  }
});

// Testimonial schema
const testimonialSchema = new mongoose.Schema({
  quote: { type: String, trim: true },
  name: { type: String, trim: true },
  role: { type: String, trim: true }
});

// Main page schema
const pageSchema = new mongoose.Schema({
  pageName: { type: String, required: true, trim: true },

  heroSection: {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    buttonText: { type: String, trim: true },
    heroImage: { type: String, trim: true }
  },

  featuresSection: [featureSchema],

  founderSection: founderSectionSchema,

  videoSection: videoSectionSchema,

  servicesSection: [serviceSchema],

  statsSection: [statSchema],

  blogSection: [blogSchema],

  testimonialSection: testimonialSchema,

  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true }
}, { timestamps: true }); // timestamps for createdAt & updatedAt

module.exports = mongoose.model("Page", pageSchema);