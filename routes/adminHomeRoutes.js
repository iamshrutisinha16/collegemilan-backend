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
    res.status(500).json({ message: "Error fetching home page", error: err.message });
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

    const { _id, __v, pageName, ...updateData } = req.body;

    // ✅ Clean and validate featuresSection
    if (updateData.featuresSection && Array.isArray(updateData.featuresSection)) {
      updateData.featuresSection = updateData.featuresSection.map(item => ({
        title: item.title || "",
        description: item.description || "",
        color: item.color || "#000000",
        link: item.link && item.link.trim() !== "" ? item.link : "/default-link"
      }));
    }

    // Ensure clean JSON to avoid extra React properties
    const cleanData = JSON.parse(JSON.stringify(updateData));

    const updatedHome = await Page.findOneAndUpdate(
      { pageName: "home" },
      cleanData,
      { returnDocument: "after", runValidators: true, upsert: true }
    );

    res.status(200).json({ message: "Home Page Updated Successfully", data: updatedHome });
  } catch (err) {
    console.error("HOME UPDATE ERROR:", err);
    res.status(500).json({ message: "Update Error", error: err.message });
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

    const cleanData = JSON.parse(JSON.stringify(req.body));

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: { [section]: cleanData } },
      { returnDocument: "after", runValidators: true, upsert: true }
    );

    res.json({ message: `${section} updated`, data: updated });
  } catch (err) {
    console.error("PATCH /:section ERROR:", err);
    res.status(500).json({ message: "Section update error", error: err.message });
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
    const newItem = JSON.parse(JSON.stringify(req.body));

    // ✅ Default link for featuresSection
    if (section === "featuresSection" && (!newItem.link || newItem.link.trim() === "")) {
      newItem.link = "/default-link";
    }

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $push: { [section]: newItem } },
      { returnDocument: "after", runValidators: true, upsert: true }
    );

    res.json({ message: `Item added to ${section}`, data: updated });
  } catch (err) {
    console.error("POST /:section ERROR:", err);
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
});

router.delete("/:section/:index", async (req, res) => {
  try {
    const { section, index } = req.params;
    const page = await Page.findOne({ pageName: "home" });

    if (!page || !page[section]) return res.status(400).json({ message: "Section not found" });

    const idx = parseInt(index);
    if (isNaN(idx)) return res.status(400).json({ message: "Invalid index" });

    page[section].splice(idx, 1);
    await page.save();

    res.json({ message: "Item deleted", data: page });
  } catch (err) {
    console.error("DELETE /:section/:index ERROR:", err);
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});

module.exports = router;