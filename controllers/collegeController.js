const College = require("../models/College");

//GET
const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//POST
const addCollege = async (req, res) => {
  try {
    const { name, location, state, website, description } = req.body;

    const newCollege = new College({
      name, location, state, website, description
    });

    await newCollege.save();
    res.status(201).json({ message: "College added successfully", college: newCollege });
  } catch (error) {
    res.status(500).json({ message: "Error adding college", error: error.message });
  }
};

//PUT
const updateCollege = async (req, res) => {
  try {
    const { id } = req.params; 
    
    const updatedCollege = await College.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true } 
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ message: "College updated", college: updatedCollege });
  } catch (error) {
    res.status(500).json({ message: "Error updating college", error: error.message });
  }
};

//DELETE
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCollege = await College.findByIdAndDelete(id);

    if (!deletedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};

module.exports = { getColleges, addCollege, updateCollege, deleteCollege };