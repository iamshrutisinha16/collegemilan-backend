const express = require("express")
const router = express.Router()

const Page = require("../models/AdminHome")


// =============================
// GET HOME PAGE DATA
// =============================

router.get("/home-page", async (req,res)=>{

 try{

   const homeData = await Page.findOne({pageName:"home"})

   res.json(homeData)

 }catch(error){

   res.status(500).json({
     message:"Error fetching home page",
     error
   })

 }

})



// =============================
// UPDATE HOME PAGE DATA
// =============================

router.put("/home-page", async (req,res)=>{

 try{

   const updatedHome = await Page.findOneAndUpdate(

     {pageName:"home"},
     req.body,
     {new:true}

   )

   res.json({
     message:"Home Page Updated Successfully",
     data:updatedHome
   })

 }catch(error){

   res.status(500).json({
     message:"Error updating home page",
     error
   })

 }

})



module.exports = router