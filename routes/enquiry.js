const express = require("express");
const router = express.Router();
const axios = require("axios");
const Enquiry = require("../models/Enquiry");
const University = require("../models/University");

// ================= CAPTCHA VERIFY =================
//const verifyCaptcha = async (token) => {
  //try {
  //  const secret = process.env.RECAPTCHA_SECRET_KEY;

   // const res = await axios.post(
     // "https://www.google.com/recaptcha/api/siteverify",
    //  null,
    //  {
     //   params: {
       //   secret: secret,
        //  response: token,
      //  },
    //  }
  //  );

  //  return res.data.success;
 // } catch (err) {
//    console.error("Captcha Error:", err.message);
 //   return false;
 // }
//};

// ================= MAIN ROUTE =================
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
      source,
      campus
     // captchaToken,
    } = req.body;

    // ================= COMMON VALIDATION =================
    if (!fullName || !mobile || !email || !city) {
      return res.status(400).json({
        success: false,
        message: "Basic required fields missing",
      });
    }

    // ================= HOMEPAGE FORM =================
    //if (source === "Book a Session Form") {
     // if (!captchaToken) {
      //  return res.status(400).json({
       //   success: false,
      //    message: "Captcha missing",
     //   });
    //  }

     // const isValidCaptcha = await verifyCaptcha(captchaToken);

   //   if (!isValidCaptcha) {
     //   return res.status(400).json({
        //  success: false,
        //  message: "Invalid captcha",
      //  });
    //  }
 //   }

    // ================= FULL FORM VALIDATION =================
    if (!source) {
      // means full form
      if (!course || !university) {
        return res.status(400).json({
          success: false,
          message: "Course and University required",
        });
      }
    }

    // ================= UNIVERSITY CHECK =================
    let selectedUniversity = null;

    if (university) {
      selectedUniversity = await University.findById(university);

      if (!selectedUniversity) {
        return res.status(400).json({
          success: false,
          message: "Invalid University",
        });
      }
    }

    // ================= SAVE DATA =================
    const enquiry = new Enquiry({
      fullName,
      email,
      mobile,
      course: course || null,
      university: university || null,
      qualification: qualification || null,
      gender: gender || null,
      city,
      state: state || null,
      address: address || null,
      learningMode: learningMode || null,
      message: message || null,
      campus: campus || "School of Art and Architecture",
      status: "New",
    });

    await enquiry.save();

    // ================= SEND TO NPF =================
try {
  await axios.post(
    "https://api.nopaperforms.com/dataporting/712/milan_consultancy_services",
    {
      name: fullName,
      email: email,
      mobile: mobile,
      state: state,
      city: city,
      campus: campus || "School of Art and Architecture",
      course: course,
      source: "milan consultancy services",
      college_id: "712",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "access-key": "7f71cef029a77f941f86814f89177ab0",
      },
    }
  );

    console.log("NPF SUCCESS:", response.data);
} catch (npfError) {
  console.error("NPF Error:", npfError.response?.data || npfError.message);
}

    // ================= RESPONSE =================
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink: selectedUniversity?.bitlink || null,
      data: enquiry,
    });

  } catch (err) {
    console.error("Create Enquiry Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;

/* const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const University = require("../models/University"); 
const Qualification = require("../models/Qualification");

// Submit form
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
    } = req.body;

    if (!fullName || !mobile || !course || !university) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Fetch selected university to get bitlink
    const selectedUniversity = await University.findById(university);

    if (!selectedUniversity) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Create enquiry
    const enquiry = new Enquiry({
      fullName,
      email,
      mobile,
      course,
      university,
      qualification,
      gender,
      city,
      state,
      address,
      learningMode,
      message,
      status: "New",
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink: selectedUniversity.bitlink || null, // ✅ send bitlink if exists
      data: enquiry,
    });

  } catch (err) {
    console.error("Create Enquiry Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// Submit form 
router.post("/", async (req, res) => {
   try { const enquiry = new Enquiry(req.body); 
    await enquiry.save();
     res.json({ message: "Enquiry submitted successfully" }); 
    } catch (err) { 
      res.status(500).json({ error: err.message }); 
    } });

  // Get all enquiries (admin)
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router; */
