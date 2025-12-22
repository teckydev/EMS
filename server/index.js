const express = require('express');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const path = require('path');
const expressJSDocSwagger = require("express-jsdoc-swagger");
const salaryRoutes = require('./routes/salaryRoutes'); // Import new salary routes
const leaveRoutes = require('./routes/leaveRoutes');
const settingRoutes = require('./routes/organizationRoutes');
const configSetting = require("./routes/configSettingRoutes")
const statistic = require('./routes/dashboardRoutes')
const attendance = require("./routes/attendanceRoutes")
const task = require("./routes/taskRoutes");
const notification = require('./routes/notificationRoutes')
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

// 1️⃣ Create HTTP server
const server = http.createServer(app);

// 2️⃣ Attach socket.io to server
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',// in real app, specify Angular URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// 3️⃣ Make io globally available (simple way)
global.io = io;

// 4️⃣ Handle socket connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Client will tell us which employeeId they are
  socket.on('register', (employeeId) => {
    console.log(`Employee ${employeeId} joined`);
    socket.join(employeeId); // join room with employeeId
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

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

app.use("/api/tasks", task);

app.use('/api/notifications', notification);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
