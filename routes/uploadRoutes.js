const express = require("express");
const router = express.Router();

const upload = require("../config/multer"); 

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const protocol = req.protocol;
    const host = req.get("host");
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl: imageUrl });
    
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error during upload" });
  }
});

module.exports = router;