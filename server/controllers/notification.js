const Notification = require('../models/Notification');

// 📩 Get all notifications for a specific employee
const getNotificationsByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ recipient: id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

// ✅ Mark one notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notif,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

// ✅ Mark all notifications as read for a specific employee
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.updateMany({ recipient: id }, { isRead: true });

    res.status(200).json({
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking all notifications as read',
      error: error.message,
    });
  }
};

// ✅ Delete a notification (optional enterprise feature)
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};

module.exports = {
  getNotificationsByEmployee,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
