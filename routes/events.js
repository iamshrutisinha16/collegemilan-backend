// routes/admin/events.js
const express = require("express");
const Event = require("../models/Event");
const { protectAdmin, protect } = require("../middleware/authMiddleware"); // CommonJS style
const upload = require("../config/multer"); // aapka multer setup

const router = express.Router();

// GET all events or banners
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const events = await Event.find(type ? { type } : {}).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add new event/banner
router.post("/", protect, protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, type } = req.body;
    const imageUrl = req.file?.path;

    if (!title || !imageUrl) {
      return res.status(400).json({ error: "Missing title or image" });
    }

    const event = new Event({ title, imageUrl, type: type || "event" });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Add event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update event
router.put("/:id", protect, protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (req.body.title) event.title = req.body.title;
    if (req.file) event.imageUrl = req.file.path;

    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE event
router.delete("/:id", protect, protectAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;