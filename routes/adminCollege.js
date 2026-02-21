const express = require("express");
const router = express.Router();

const { 
  getColleges, 
  addCollege, 
  updateCollege, 
  deleteCollege 
} = require("../controllers/collegeController");

const { protect } = require("../middleware/authMiddleware"); 

// All routes protected
router.get("/", protect, getColleges);
router.post("/", protect, addCollege);             
router.put("/:id", protect, updateCollege);        
router.delete("/:id", protect, deleteCollege);    

module.exports = router;