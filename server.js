require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/db');

const app = express();
app.use(express.json()); 

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://milaneducation.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
};
app.use(cors(corsOptions)); 

// Connect MongoDB
mongoDB.connect();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// ROUTES
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});