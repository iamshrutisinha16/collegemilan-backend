const express = require('express');
const router = express.Router();
const University = require('../models/University'); 

//ADD University 
router.post('/', async (req, res) => {
    try {
        const { name, website } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: "University name is required" });
        }

        const newUniversity = new University({ name, website });
        await newUniversity.save();
        
        res.status(201).json(newUniversity);
    } catch (error) {
        console.error("Create University Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//GET All Universities (GET) 
router.get('/', async (req, res) => {
    try {
        const universities = await University.find();
        res.status(200).json(universities);
    } catch (error) {
        console.error("Get Universities Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//UPDATE University (PUT) 
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, website } = req.body;

        const updatedUniversity = await University.findByIdAndUpdate(
            id,
            { name, website },
            { new: true } 
        );

        if (!updatedUniversity) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json(updatedUniversity);
    } catch (error) {
        console.error("Update University Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 4. DELETE University (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUniversity = await University.findByIdAndDelete(id);
        
        if (!deletedUniversity) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json({ message: "University deleted successfully" });
    } catch (error) {
        console.error("Delete University Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;