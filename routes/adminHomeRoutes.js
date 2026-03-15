const express = require("express");
const router = express.Router();

const Page = require("../models/AdminHome");


/*
=====================================
GET HOME PAGE
=====================================
*/
router.get("/", async (req, res) => {
  try {

    let homeData = await Page.findOne({ pageName: "home" });

    // Create default page if not exist
    if (!homeData) {

      homeData = await Page.create({
        pageName: "home"
      });

    }

    res.status(200).json(homeData);

  } catch (err) {

    console.error("GET HOME ERROR:", err);

    res.status(500).json({
      message: "Error fetching home page",
      error: err.message
    });

  }
});



/*
=====================================
UPDATE FULL HOME PAGE
=====================================
*/
router.put("/", async (req, res) => {

  try {

    console.log("BODY:", req.body);

    // Remove restricted fields
    const { _id, __v, pageName, ...updateData } = req.body;

    const updatedHome = await Page.findOneAndUpdate(

      { pageName: "home" },

      { $set: updateData },

      {
        new: true,
        runValidators: true,
        upsert: true
      }

    );

    res.status(200).json({
      message: "Home Page Updated Successfully",
      data: updatedHome
    });

  } catch (err) {

    console.error("HOME UPDATE ERROR:", err);

    res.status(500).json({
      message: "Update Error",
      error: err.message
    });

  }

});



/*
=====================================
UPDATE SINGLE SECTION
=====================================
*/
router.patch("/:section", async (req, res) => {

  try {

    const section = req.params.section;

    const allowedSections = [
      "heroSection",
      "featuresSection",
      "founderSection",
      "videoSection",
      "servicesSection",
      "statsSection",
      "blogSection",
      "testimonialSection",
      "metaTitle",
      "metaDescription"
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        message: "Invalid section name"
      });
    }

    const updated = await Page.findOneAndUpdate(

      { pageName: "home" },

      { $set: { [section]: req.body } },

      {
        new: true,
        runValidators: true,
        upsert: true
      }

    );

    res.json({
      message: `${section} updated successfully`,
      data: updated
    });

  } catch (err) {

    console.error("PATCH /:section ERROR:", err);

    res.status(500).json({
      message: "Section update error",
      error: err.message
    });

  }

});



/*
=====================================
ADD ITEM TO ARRAY SECTIONS
=====================================
*/
router.post("/:section", async (req, res) => {

  try {

    const section = req.params.section;

    const allowedArrays = [
      "featuresSection",
      "servicesSection",
      "statsSection",
      "blogSection"
    ];

    if (!allowedArrays.includes(section)) {
      return res.status(400).json({
        message: "Invalid section"
      });
    }

    const updated = await Page.findOneAndUpdate(

      { pageName: "home" },

      { $push: { [section]: req.body } },

      {
        new: true,
        runValidators: true,
        upsert: true
      }

    );

    res.json({
      message: `Item added to ${section}`,
      data: updated
    });

  } catch (err) {

    console.error("POST /:section ERROR:", err);

    res.status(500).json({
      message: "Error adding item",
      error: err.message
    });

  }

});



/*
=====================================
DELETE ARRAY ITEM
=====================================
*/
router.delete("/:section/:index", async (req, res) => {

  try {

    const { section, index } = req.params;

    const allowedArrays = [
      "featuresSection",
      "servicesSection",
      "statsSection",
      "blogSection"
    ];

    if (!allowedArrays.includes(section)) {
      return res.status(400).json({
        message: "Invalid section"
      });
    }

    const page = await Page.findOne({ pageName: "home" });

    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }

    const idx = parseInt(index);

    if (isNaN(idx)) {
      return res.status(400).json({
        message: "Invalid index"
      });
    }

    if (!page[section] || page[section].length <= idx) {
      return res.status(400).json({
        message: "Item not found"
      });
    }

    page[section].splice(idx, 1);

    await page.save();

    res.json({
      message: "Item deleted successfully",
      data: page
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      message: "Delete error",
      error: err.message
    });

  }

});



module.exports = router;