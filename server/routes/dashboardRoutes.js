// routes/dashboardRoutes.js
const express = require('express');
const { getAdminDashboardStats,getRecentActivity } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/stats', protect, authorizeRoles('admin', 'HR'), getAdminDashboardStats);
router.get('/recent-activity', protect, authorizeRoles('admin','HR'), getRecentActivity);

module.exports = router;
