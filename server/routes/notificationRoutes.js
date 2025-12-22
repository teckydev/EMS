const express = require('express');
const router = express.Router();
const {
  getNotificationsByEmployee,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require('../controllers/notification');

// 📥 GET all notifications for an employee
router.get('/employee/:id', getNotificationsByEmployee);

// ✳️ PATCH mark single notification as read
router.patch('/:id/read', markNotificationAsRead);

// ✳️ PATCH mark all as read
router.patch('/employee/:id/read-all', markAllNotificationsAsRead);

// ❌ DELETE notification
router.delete('/:id', deleteNotification);

module.exports = router;
