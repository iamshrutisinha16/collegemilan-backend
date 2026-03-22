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

// --- ADMIN: ADD NEW EVENT ---
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) return res.status(400).json({ message: "Title and image required" });

    const newEvent = new Event({
      title,
      // CHANGE HERE: req.file.path mein Cloudinary ka poora URL hota hai
      image: req.file.path 
    });

    await newEvent.save();
    res.status(201).json({ message: "Event added successfully", event: newEvent });
  } catch (err) {
    console.log("Error details:", err); // Taaki Render logs mein dikhe
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// --- ADMIN: UPDATE EVENT ---
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };

    // CHANGE HERE: Agar new image hai, toh req.file.path save karein
    if (req.file) {
      updateData.image = req.file.path; 
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
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