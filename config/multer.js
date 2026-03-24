const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "milan_education",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

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