const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary Configuration (Ye details aapko Cloudinary dashboard se milengi)
cloudinary.config({
  cloud_name: 'dfkbi63ro', 
  api_key: '513638623697344',      
  api_secret: '**********' 
});

// 2. Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'milan_education', // Is naam ka folder Cloudinary par ban jayega
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => {
      const safeFileName = file.originalname.replace(/\s+/g, '-').split('.')[0];
      return Date.now() + "-" + safeFileName;
    }
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB (Cloudinary free tier ke liye kaafi hai)
  }
});

module.exports = upload;

/*const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Original name se spaces hatakar '-' laga dega 
    // Example: "my image.jpg" ban jayega "my-image.jpg"
    const safeFileName = file.originalname.replace(/\s+/g, '-');
    
    cb(null, Date.now() + "-" + safeFileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB limit (Image/Video dono ke liye enough hai)
  }
});

module.exports = upload;*/