const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post("/upload", (req, res) => {

  upload.single("image")(req, res, function (err) {

    if (err) {
      console.error("❌ MULTER ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const imageUrl = req.file.path;

    console.log("✅ Uploaded:", imageUrl);

    res.status(200).json({ imageUrl });

  });

});

module.exports = router;