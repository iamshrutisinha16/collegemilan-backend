const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const upload = require("../config/multer"); // tumhara multer setup

// Get all events (frontend)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: add new event with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) return res.status(400).json({ message: "Title and image required" });

    const newEvent = new Event({
      title,
      image: `/uploads/${req.file.filename}` // saved image path
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully", event: newEvent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: update event (title or new image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };

    // Agar new image upload hui hai, update path
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: delete event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;