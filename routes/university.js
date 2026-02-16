const express = require("express");
const router = express.Router();
const University = require("../models/University");

//Get all universities
router.get("/", async(req,res) => {
    try{
      const universities = await University.find();
      res.json(universities);
    }catch(err){
      res.status(500).json({ error: err.message });
    }
});

//POST all universities
router.post("/", async(req,res) => {
    try{
    const uni = new University(req.body);
    await uni.save();
    res.json(uni)
    }catch(err){
       res.status(500).json({ error: err.message });
    }
});

module.exports = router;
