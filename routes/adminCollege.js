// backend/routes/collegeRoutes.js
const express = require("express");
const router = express.Router();

const { 
  getColleges, 
  addCollege, 
  updateCollege, 
  deleteCollege 
} = require("../controllers/collegeController");

const protect = require("../middleware/authMiddleware"); 

//router.get("/", protect, getColleges)
router.get("/", getColleges);            
router.post("/", addCollege);             
router.put("/:id", updateCollege);        
router.delete("/:id", deleteCollege);    

module.exports = router;