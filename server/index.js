const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // ✅ must be first

const connectDB = require('./config/db');
const expressJSDocSwagger = require("express-jsdoc-swagger");

// Routes
const salaryRoutes = require('./routes/salaryRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const settingRoutes = require('./routes/organizationRoutes');
const configSetting = require("./routes/configSettingRoutes");
const statistic = require('./routes/dashboardRoutes');
const attendance = require("./routes/attendanceRoutes");
const task = require("./routes/taskRoutes");
const notification = require('./routes/notificationRoutes');

const app = express();

/* =========================
   ✅ SAFE CORS CONFIG
========================= */
const corsOptions = {
  origin: true, // ✅ allow Render + Netlify + localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

/* =========================
   ✅ HEALTH CHECK (MANDATORY)
========================= */
app.get('/', (req, res) => {
  res.send('EMS Backend is running');
});

/* =========================
   ✅ SWAGGER (RENDER SAFE)
========================= */
const options = {
  info: {
    version: "1.0.0",
    title: "EMS API",
    description: "Employee Management System APIs",
  },
  servers: [
    {
      url: process.env.BASE_URL || "http://localhost:5000",
    },
  ],
  baseDir: __dirname,
  filesPattern: "./routes/*.js",
  swaggerUIPath: "/api-docs",
  exposeSwaggerUI: true,
};

expressJSDocSwagger(app)(options);

/* =========================
   ✅ ROUTES
========================= */
app.use('/api/admin', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/salaries', salaryRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/settings', configSetting);
app.use('/api/dashboard', statistic);
app.use('/api/attendance', attendance);
app.use('/api/tasks', task);
app.use('/api/notifications', notification);
app.use('/uploads', express.static('public/uploads'));

/* =========================
   ✅ CREATE HTTP SERVER
========================= */
const server = http.createServer(app);

/* =========================
   ✅ SOCKET.IO (RENDER SAFE)
========================= */
const io = socketIO(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

global.io = io;

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('register', (employeeId) => {
    socket.join(employeeId);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

/* =========================
   ✅ START SERVER FIRST
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   ✅ CONNECT DATABASE (SAFE)
========================= */
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
  }
})();
