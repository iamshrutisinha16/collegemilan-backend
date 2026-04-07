const express = require("express");
const router = express.Router();
const axios = require("axios");
const Enquiry = require("../models/Enquiry");
const University = require("../models/University");
const CourseModel = require("../models/Course"); // ✅ IMPORTANT

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
    } = req.body;

    // ================= COMMON VALIDATION =================
    if (!fullName || !mobile || !email || !city) {
      return res.status(400).json({
        success: false,
        message: "Basic required fields missing",
      });
    }

    // ================= FULL FORM VALIDATION =================
    if (!source) {
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

    // ================= COURSE FIND (STRING → OBJECTID) =================
    let courseId = null;

    if (course) {
      const foundCourse = await CourseModel.findOne({
        course_name: course
      });

      if (foundCourse) {
        courseId = foundCourse._id;
      } else {
        console.log("⚠️ Course not found in DB:", course);
      }
    }

    // ================= FORMAT COURSE FOR NPF =================
    const formattedCourse = course
      ? course.replace(/\./g, "").trim()
      : null;

    console.log("Original Course:", course);
    console.log("Formatted Course:", formattedCourse);

    // ================= SAVE DATA =================
    const enquiry = new Enquiry({
      fullName,
      email,
      mobile,
      course: courseId, // ✅ FIXED (ObjectId)
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
      if (!process.env.NPF_SECRET_KEY) {
        console.warn("⚠️ NPF SECRET KEY MISSING");
      }

      const response = await axios.post(
        "https://api.nopaperforms.com/dataporting/712/milan_consultancy_services",
        {
          name: fullName,
          email: email,
          mobile: mobile,
          state: state,
          city: city,
          campus: campus || "School of Art and Architecture",
          course: formattedCourse, // ✅ STRING for NPF

          source: "milan_consultancy_services",
          college_id: "712",
          secret_key: process.env.NPF_SECRET_KEY,
        }
      );

      console.log("✅ NPF SUCCESS:", response.data);

    } catch (err) {
      console.error("❌ NPF ERROR:", err.response?.data || err.message);
      // ❗ IMPORTANT: yaha throw nahi karna
    }

    // ================= FINAL RESPONSE =================
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      redirectLink: selectedUniversity?.bitlink || null,
      data: enquiry,
    });

  } catch (err) {
    console.error("❌ Create Enquiry Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;

/*const express = require("express");
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
      course: null,
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
  const response = await axios.post(
    "https://api.nopaperforms.com/dataporting/712/milan_consultancy_services",
    {
      name: fullName,
      email: email,
      mobile: mobile,
      state: state,
      city: city,
      campus: campus || "School of Art and Architecture",
      course: course,

      // 👇 IMPORTANT (sheet ke according)
      source: "milan_consultancy_services",
      college_id: "712",
      secret_key: process.env.NPF_SECRET_KEY, // ✅ yaha use hoga
    }
  );

  console.log("NPF SUCCESS:", response.data);

} catch (err) {
  console.error("NPF ERROR:", err.response?.data || err.message);
}
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

module.exports = router; */

