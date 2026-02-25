// routes/events.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Event = require('../models/Event');

// Image upload setup
const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, 'uploads/'); },
  filename: function(req, file, cb){ cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// GET all events
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// POST add event
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file.path; // local upload
  const event = new Event({ title, description, imageUrl });
  await event.save();
  res.json({ success: true, event });
});

// PUT update event
router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const updateData = { title, description, updatedAt: Date.now() };
  if(req.file) updateData.imageUrl = req.file.path;
  const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json({ success: true, event });
});

// DELETE event
router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;