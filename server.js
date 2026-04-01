require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoDB = require('./config/db');
const crypto = require("crypto");
const Payment = require("./models/Payment");

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://milaneducation.vercel.app", "https://milaneducation.web2onlinesolutions.com", "http://milaneducation.web2onlinesolutions.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true
};

app.use(cors(corsOptions));

mongoDB.connect();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/universities', require('./routes/university'));
app.use('/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/enquiries', require('./routes/enquiry'));
app.use("/api/payment", require("./routes/paymentRoutes")); 
app.use("/api/general-enquiry", require("./routes/testenquiry")); 

// Admin routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));
app.use("/api/admin/users", require("./routes/adminUserRoutes"));
app.use("/api/admin/qualifications", require("./routes/adminQualificationRoutes"));
app.use("/api/admin/courses", require("./routes/adminCourseRoutes"));
app.use("/api/admin/enquiries", require("./routes/adminEnquiryRoutes"));
app.use("/api/admin/universities", require("./routes/adminUniversitiesRoutes"));
app.use("/api/admin/settings", require("./routes/adminSettingRoutes"));
app.use("/api/events", require("./routes/events"));
app.use("/api/admin/careers", require("./routes/adminCareerRoutes"));
app.use("/api/admin/home", require("./routes/adminHomeRoutes"));
app.use("/api/admin/about", require("./routes/adminAboutRoutes"));
app.use("/api/admin", require("./routes/adminPlacement"));
app.use("/api/admin/payment-settings", require("./routes/adminPaymentSettings"));

app.use("/api/admin", require("./routes/uploadRoutes")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});