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

    // if data not exist, create default document
    if (!homeData) {

      homeData = await Page.create({
        pageName: "home",
        heroSection: { title: "", description: "", buttonText: "", heroImage: "" },
        featuresSection: [],
        founderSection: { since: "", title: "", description: "", founderName: "", image: "" },
        videoSection: { title: "", videoUrl: "" },
        servicesSection: [],
        statsSection: [],
        blogSection: [],
        testimonialSection: { quote: "", name: "", role: "" },
        metaTitle: "",
        metaDescription: ""
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

    // remove fields that should not update
    const { _id, pageName, ...updateData } = req.body;

    const updatedHome = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: updateData },
      {
        returnDocument: "after",   // replaces deprecated new:true
        runValidators: true,
        upsert: true
      }
    );

    res.json({
      message: "Home Page Updated Successfully",
      data: updatedHome
    });

  } catch (err) {

    console.log("HOME UPDATE ERROR:", err);

    res.status(500).json({
      message: "Update Error",
      error: err.message
    });

  }
});


/*
=====================================
UPDATE SINGLE SECTION
(optional CMS feature)
=====================================
*/
router.patch("/:section", async (req, res) => {
  try {

    const section = req.params.section;

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: { [section]: req.body } },
      {
        returnDocument: "after",
        runValidators: true,
        upsert: true
      }
    );

    res.json({
      message: `${section} updated`,
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
(features, services, blogs, stats)
=====================================
*/
router.post("/:section", async (req, res) => {
  try {

    const section = req.params.section;

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $push: { [section]: req.body } },
      {
        returnDocument: "after",
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

    let page = await Page.findOne({ pageName: "home" });

    if (!page || !page[section]) {
      return res.status(400).json({
        message: "Section not found"
      });
    }

    const idx = parseInt(index);

    if (isNaN(idx)) {
      return res.status(400).json({
        message: "Invalid index"
      });
    }

    page[section].splice(idx, 1);

    await page.save();

    res.json({
      message: "Item deleted",
      data: page
    });

  } catch (err) {

    console.error("DELETE /:section/:index ERROR:", err);

    res.status(500).json({
      message: "Delete error",
      error: err.message
    });

  }
});

module.exports = router;