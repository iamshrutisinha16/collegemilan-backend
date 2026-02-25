const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');      // Folder banane ke liye zaroori hai
const path = require('path');  // Path handle karne ke liye
const Event = require('../models/Event'); // Model import

// --- 1. SMART STORAGE CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'uploads/';
    
    // Check karo folder hai ya nahi, nahi hai toh bana do
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    // File name ko unique banao (Date + Original Name without spaces)
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// --- 2. ROUTES START HERE ---

// GET: Sabhi events lao
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST: Naya Event Add karo (Image Upload ke sath)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // 1. Check karo image upload hui ya nahi
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file." });
    }

    const { title, description } = req.body;

    // 2. Windows path fix: '\' ko '/' mein badlo
    // Example: "uploads\image.jpg" -> "uploads/image.jpg"
    const imagePath = req.file.path.replace(/\\/g, "/");

    const event = new Event({
      title,
      description,
      imageUrl: imagePath // DB me sahi URL save hoga
    });

    await event.save();
    res.status(201).json({ success: true, event });

  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Failed to add event", error: error.message });
  }
});

// PUT: Event Update karo
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    let updateData = {
      title,
      description,
      updatedAt: Date.now()
    };

    // Agar nayi image upload hui hai, tabhi purani replace karo
    if (req.file) {
      updateData.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ success: true, event });

  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
});

// DELETE: Event Delete karo
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // (Optional) Agar chaho toh yahan fs.unlink use karke image bhi delete kar sakte ho
    
    res.status(200).json({ success: true, message: "Event deleted successfully" });

  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
});

module.exports = router;