const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); 

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    // Check karein file aayi ya nahi
    if (!req.file) {
      console.log("No file received in req.file");
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // CLOUDINARY LOGIC: req.file.path ko use karein
    // Ye hamesha https://res.cloudinary.com/... se shuru hota hai
    const imageUrl = req.file.path; 

    console.log("Upload Success! Image URL:", imageUrl);
    res.status(200).json({ imageUrl: imageUrl });
    
  } catch (error) {
    console.error("UPLOAD CRASH ERROR:", error);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
});
module.exports = router;