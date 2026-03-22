const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); 

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // CLOUDINARY LOGIC:
    // req.file.path mein pehle se hi poora URL hota hai (https://res.cloudinary.com/...)
    const imageUrl = req.file.path;

    // Ab direct wahi URL bhej dijiye frontend ko
    res.status(200).json({ imageUrl: imageUrl });
    
  } catch (error) {
    console.error("Upload Error Details:", error);
    res.status(500).json({ 
      message: "Server Error during upload", 
      error: error.message // Isse asli error dikhega
    });
  }
});

module.exports = router;