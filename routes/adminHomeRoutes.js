const express = require("express");
const router = express.Router();
const Page = require("../models/AdminHome");

router.get("/", async (req, res) => {
 try {

  let homeData = await Page.findOne({ pageName: "home" });

  if (!homeData) {

   homeData = await Page.create({
    pageName: "home",
    heroSection: {},
    featuresSection: [],
    founderSection: {},
    videoSection: {},
    servicesSection: [],
    statsSection: [],
    blogSection: [],
    testimonialSection: {},
    metaTitle: "",
    metaDescription: ""
   });

  }

  res.json(homeData);

 } catch (err) {

  console.error(err);
  res.status(500).json(err);

 }
});

router.put("/", async (req, res) => {

 try {

  const updateData = req.body;

  const updatedHome = await Page.findOneAndUpdate(

   { pageName: "home" },

   {
    ...updateData,
    pageName: "home"
   },

   {
    new: true,
    runValidators: true,
    upsert: true
   }

  );

  res.json(updatedHome);

 } catch (err) {

  console.error(err);
  res.status(500).json(err);

 }

});

router.patch("/:section", async (req, res) => {

 try {

  const section = req.params.section;

  const updated = await Page.findOneAndUpdate(

   { pageName: "home" },

   { $set: { [section]: req.body } },

   { new: true }

  );

  res.json(updated);

 } catch (err) {

  console.error(err);
  res.status(500).json(err);

 }

});

router.post("/:section", async (req, res) => {

 try {

  const section = req.params.section;

  const updated = await Page.findOneAndUpdate(

   { pageName: "home" },

   { $push: { [section]: req.body } },

   { new: true }

  );

  res.json(updated);

 } catch (err) {

  console.error(err);
  res.status(500).json(err);

 }

});

router.delete("/:section/:index", async (req, res) => {

 try {

  const { section, index } = req.params;

  const page = await Page.findOne({ pageName: "home" });

  if (!page) return res.status(404).json({message:"Page not found"});

  page[section].splice(index,1);

  await page.save();

  res.json(page);

 } catch (err) {

  console.error(err);
  res.status(500).json(err);

 }

});

module.exports = router;