const express = require("express");
const router = express.Router();

const Page = require("../models/AdminHome");

/*
=====================================
GET HOME PAGE DATA
=====================================
*/
router.get("/home-page", async (req, res) => {
  try {
    let homeData = await Page.findOne({ pageName: "home" });

    // if data not exist, create default document
    if (!homeData) {
      homeData = new Page({
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

      await homeData.save();
    }

    res.status(200).json(homeData);
  } catch (err) {
    console.error("GET /home-page error:", err);
    res.status(500).json({ message: "Error fetching home page", error: err.message });
  }
});

/*
=====================================
UPDATE FULL HOME PAGE
=====================================
*/
router.put("/home-page", async (req, res) => {
  try {

    console.log("BODY:", req.body)

    const updateData = { ...req.body }

    // remove fields that should not update
    delete updateData._id
    delete updateData.pageName

    const updatedHome = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    )

    res.json({
      message: "Home Page Updated Successfully",
      data: updatedHome
    })

  } catch (err) {

    console.log("ERROR:", err)

    res.status(500).json({
      message: "Update Error",
      error: err.message
    })

  }
})

/*
=====================================
UPDATE SINGLE SECTION
(optional CMS feature)
=====================================
*/
router.patch("/home-page/:section", async (req, res) => {
  try {
    const section = req.params.section;
    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: { [section]: req.body } },
      { new: true, runValidators: true }
    );

    res.json({ message: `${section} updated`, data: updated });
  } catch (err) {
    console.error("PATCH /home-page/:section error:", err);
    res.status(500).json({ message: "Section update error", error: err.message });
  }
});

/*
=====================================
ADD ITEM TO ARRAY SECTIONS
(features, services, blogs, stats)
=====================================
*/
router.post("/home-page/:section", async (req, res) => {
  try {
    const section = req.params.section;
    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $push: { [section]: req.body } },
      { new: true, runValidators: true }
    );

    res.json({ message: `Item added to ${section}`, data: updated });
  } catch (err) {
    console.error("POST /home-page/:section error:", err);
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
});

/*
=====================================
DELETE ARRAY ITEM
=====================================
*/
router.delete("/home-page/:section/:index", async (req, res) => {
  try {
    const { section, index } = req.params;
    let page = await Page.findOne({ pageName: "home" });

    if (!page || !page[section]) {
      return res.status(400).json({ message: "Section not found" });
    }

    page[section].splice(index, 1);
    await page.save();

    res.json({ message: "Item deleted", data: page });
  } catch (err) {
    console.error("DELETE /home-page/:section/:index error:", err);
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});

module.exports = router;