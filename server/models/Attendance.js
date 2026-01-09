const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  checkIn: { type: Date },
  checkOut: { type: Date }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  sessions: [sessionSchema], // multiple sessions per day
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
