const mongoose = require("mongoose");

const attendanceSettingSchema = new mongoose.Schema({
  defaultStartTime: {
    type: String,
    default: "09:00" // 9 AM
  },
  defaultEndTime: {
    type: String,
    default: "18:00" // 6 PM
  },
  overtimeEnabled: {
    type: Boolean,
    default: false
  },
  publicHolidays: [
    {
      date: { type: Date, required: true },
      name: { type: String, required: true }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AttendanceSetting", attendanceSettingSchema);
