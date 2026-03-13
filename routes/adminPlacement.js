const express = require("express");
const router = express.Router();
const Placement = require("../models/AdminPlacement");

// GET Placement Data
router.get("/placement", async (req, res) => {

try {

const data = await Placement.findOne();

res.status(200).json({
success: true,
data: data
});

} catch (error) {

res.status(500).json({
success: false,
message: error.message
});

}

});




// UPDATE Placement (Admin Panel)

router.put("/placement", async (req, res) => {

try {

let placement = await Placement.findOne();

if (!placement) {

placement = new Placement(req.body);

await placement.save();

} else {

placement = await Placement.findOneAndUpdate(
{ _id: placement._id },
req.body,
{ new: true }
);

}

res.status(200).json({
success: true,
data: placement
});

} catch (error) {

res.status(500).json({
success: false,
message: error.message
});

}

});



module.exports = router;