const express = require("express");
const router = express.Router();

const Test = require("../models/Test");

// GET test by qualification name
router.get("/:qualification", async (req, res) => {
  try {
    const { qualification } = req.params;
    console.log("Requested qualification:", qualification);

    const test = await Test.findOne({ qualification });

    console.log("Found test:", test);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;