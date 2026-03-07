const express = require("express");
const router = express.Router();
const Page = require("../models/AdminHome");


// =======================
// GET HOME PAGE DATA
// =======================

router.get("/", async (req, res) => {

  try {

    let homeData = await Page.findOne({ pageName: "home" });

    if (!homeData) {

      homeData = new Page({
        pageName: "home"
      });

      await homeData.save();
    }

    res.json(homeData);

  } catch (err) {

    res.status(500).json({
      message: "Error fetching home page",
      error: err.message
    });

  }

});


// =======================
// UPDATE HOME PAGE DATA
// =======================

router.put("/", async (req, res) => {

  try {

    const updatedHome = await Page.findOneAndUpdate(
      { pageName: "home" },
      req.body,
      {
        new: true,
        upsert: true
      }
    );

    res.json({
      message: "Home Page Updated Successfully",
      data: updatedHome
    });

  } catch (err) {

    res.status(500).json({
      message: "Error updating home page",
      error: err.message
    });

  }

});


module.exports = router;