const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    type: {
      type: String,
      enum: ['task', 'leave', 'salary'],
      default: 'task',
    },
    title: String,   // e.g., "New Task Assigned"
    message: String, // e.g., "Prepare Annual Report"
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
