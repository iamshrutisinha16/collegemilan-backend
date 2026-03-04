require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/db');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("./models/Payment");

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://milaneducation.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true
};

app.use(cors(corsOptions));

// Connect MongoDB
mongoDB.connect();

// Razorpay Setup
//const razorpay = new Razorpay({
 // key_id: process.env.RAZORPAY_KEY_ID,
  //key_secret: process.env.RAZORPAY_KEY_SECRET,
//});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});


// ================= PAYMENT ROUTES =================

// 1️⃣ Create Order
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
    });

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});


// 2️⃣ Verify Payment
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      qualificationId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // Save payment in DB
    await Payment.create({
      userId,
      qualificationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
});


// ================= NORMAL ROUTES =================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/universities', require('./routes/university'));
app.use('/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/enquiries', require('./routes/enquiry'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/qualifications", require("./routes/adminQualificationRoutes"));
app.use("/api/admin/courses", require("./routes/adminCourseRoutes"));
app.use("/api/admin/enquiries", require("./routes/adminEnquiryRoutes"));
app.use("/api/admin/universities", require("./routes/adminUniversitiesRoutes"));
app.use("/api/admin/settings", require("./routes/adminSettingRoutes"));
app.use("/api/admin/events", require("./routes/events"));
app.use("/api/admin/careers", require("./routes/adminCareerRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});