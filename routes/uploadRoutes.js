const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post("/upload", (req, res) => {

  upload.single("image")(req, res, function (err) {

    // ❌ Multer / Cloudinary error
    if (err) {
      console.error("❌ MULTER ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log("📁 FILE DATA:", req.file);

      // ❌ Agar file nahi aayi
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }

      // ✅ Cloudinary URL
      const imageUrl = req.file.path;

      console.log("✅ SUCCESS URL:", imageUrl);

      return res.status(200).json({ imageUrl });

    } catch (error) {
      console.error("🔥 SERVER ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

  });

});

module.exports = router;