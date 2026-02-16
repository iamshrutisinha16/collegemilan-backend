require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoDB = require('./config/db');

const app = express();
app.use(express.json()); 

app.use(cors({
  origin: "https://milaneducation.vercel.app"
}));

mongoDB.connect();

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api', require('./routes/testRoutes'));
app.use('/api/universities', require('./routes/university'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/enquiries', require('./routes/enquiry'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});