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

        heroSection: {
          title: "",
          description: "",
          buttonText: "",
          heroImage: ""
        },

        featuresSection: [],

        // ✅ FIXED founderSection
        founderSection: {
          since: "",
          title: "",
          description: "",
          founderName: "",
          image1: "",
          image2: "",
          image3: ""
        },

        videoSection: {
          title: "",
          videoUrl: ""
        },

        servicesSection: [],

        statsSection: [],

        blogSection: [],

        testimonialSection: {
          quote: "",
          name: "",
          role: ""
        },

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

    const { _id, __v, pageName, ...updateData } = req.body;

    // ✅ Clean featuresSection
    if (updateData.featuresSection && Array.isArray(updateData.featuresSection)) {
      updateData.featuresSection = updateData.featuresSection.map(item => ({
        title: item.title || "",
        description: item.description || "",
        color: item.color || "#000000",
        link: item.link && item.link.trim() !== "" ? item.link : "/default-link"
      }));
    }

    // ✅ Clean statsSection (🔥 IMPORTANT FIX)
    if (updateData.statsSection && Array.isArray(updateData.statsSection)) {
      updateData.statsSection = updateData.statsSection.map(item => ({
        number: item.number || "",
        title: item.title || "",
        description: item.description || ""
      }));
    }

    // ✅ Clean servicesSection (safe)
    if (updateData.servicesSection && Array.isArray(updateData.servicesSection)) {
      updateData.servicesSection = updateData.servicesSection.map(item => ({
        title: item.title || "",
        description: item.description || ""
      }));
    }

    // ✅ Clean blogSection
    if (updateData.blogSection && Array.isArray(updateData.blogSection)) {
      updateData.blogSection = updateData.blogSection.map(item => ({
        title: item.title || "",
        category: item.category || "",
        image: item.image || ""
      }));
    }

    // ✅ Clean founderSection
    if (updateData.founderSection) {
      updateData.founderSection = {
        since: updateData.founderSection.since || "",
        title: updateData.founderSection.title || "",
        description: updateData.founderSection.description || "",
        founderName: updateData.founderSection.founderName || "",
        image1: updateData.founderSection.image1 || "",
        image2: updateData.founderSection.image2 || "",
        image3: updateData.founderSection.image3 || ""
      };
    }

    // ✅ Clean videoSection
    if (updateData.videoSection) {
      updateData.videoSection = {
        title: updateData.videoSection.title || "",
        videoUrl: updateData.videoSection.videoUrl || ""
      };
    }

    const updatedHome = await Page.findOneAndUpdate(
      { pageName: "home" },
      updateData,
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

    const cleanData = JSON.parse(JSON.stringify(req.body));

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $set: { [section]: cleanData } },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      message: `${section} updated`,
      data: updated
    });

  } catch (err) {
    console.error("PATCH ERROR:", err);
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
    const newItem = JSON.parse(JSON.stringify(req.body));

    // ✅ default for feature link
    if (section === "featuresSection" && (!newItem.link || newItem.link.trim() === "")) {
      newItem.link = "/default-link";
    }

    const updated = await Page.findOneAndUpdate(
      { pageName: "home" },
      { $push: { [section]: newItem } },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({
      message: `Item added to ${section}`,
      data: updated
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({
      message: "Error adding item",
      error: err.message
    });
  }
});

/*
=====================================
DELETE ITEM FROM ARRAY
=====================================
*/
router.delete("/:section/:index", async (req, res) => {
  try {
    const { section, index } = req.params;

    const page = await Page.findOne({ pageName: "home" });

    if (!page || !page[section]) {
      return res.status(400).json({ message: "Section not found" });
    }

    const idx = parseInt(index);
    if (isNaN(idx)) {
      return res.status(400).json({ message: "Invalid index" });
    }

    page[section].splice(idx, 1);
    await page.save();

    res.json({
      message: "Item deleted",
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

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ order: 1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ADD BLOG (ADMIN)
// =========================
router.post("/", async (req, res) => {
  try {
    const { title, category, image, link, order } = req.body;

    if (!title || !category || !image || !link) {
      return res.status(400).json({ message: "All fields required" });
    }

    const blog = await Blog.create({
      title,
      category,
      image,
      link,
      order
    });

    res.json({
      message: "Blog created successfully",
      data: blog
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// UPDATE BLOG
// =========================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Blog updated",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// DELETE BLOG
// =========================
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      message: "Blog deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;