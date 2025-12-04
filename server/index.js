const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const expressJSDocSwagger = require("express-jsdoc-swagger");
const salaryRoutes = require('./routes/salaryRoutes'); // Import new salary routes
const leaveRoutes = require('./routes/leaveRoutes');
const settingRoutes = require('./routes/organizationRoutes');
const configSetting = require("./routes/configSettingRoutes")
const statistic = require('./routes/dashboardRoutes')
const attendance = require("./routes/attendanceRoutes")
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
const options = {
  info: {
    version: "1.0.0",
    title: "Fully Automatic API",
    description: "Swagger docs auto-generated without annotations",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  baseDir: __dirname, // Directory where your route files are located
  filesPattern: "./routes/*.js", // All files to scan for routes
  swaggerUIPath: "/api-docs",
  exposeSwaggerUI: true,
  exposeApiDocs: true,
};
expressJSDocSwagger(app)(options);
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));

// New employee routes
app.use('/api/employees', require('./routes/employeeRoutes'));
//salary
app.use('/api/salaries', salaryRoutes); 

app.use('/uploads', express.static('public/uploads'));
//leave
app.use('/api/leaves', leaveRoutes);
//admin-setting
app.use('/api/settings', settingRoutes);
//admin-leave-setting
app.use("/api/settings", configSetting);

app.use('/api/dashboard', statistic);

app.use("/api/attendance", attendance);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
