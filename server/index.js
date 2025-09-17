const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();
dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Angular app
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
