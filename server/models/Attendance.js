// models/Attendance.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  totalHours: {
    type: Number, // calculated in hours
    default: 0
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "On Leave"],
    default: "Present"
  },
  isLate: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
