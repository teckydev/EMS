const mongoose = require('mongoose');

const SalaryRecordSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  department: { // Redundant but included for quick lookups/reports
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  payDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  netPay: { // Calculated field: basicSalary + allowances - deductions
    type: Number,
    required: true,
  },
  // Link to the admin user who created the record
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SalaryRecord', SalaryRecordSchema);