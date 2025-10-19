const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate employee IDs
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  photo: {
    type: String,
    required: false,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hireDate: {
    type: Date,
    default: Date.now,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'Manager', 'employee', 'HR'],
    default: 'employee',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  salary: {
    type: Number,
    required: true,
  },
  maritalStatus: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  // Field used for the Active Employee Count API
  status: { 
    type: String, 
    enum: ['Active', 'On Leave', 'Terminated'], 
    default: 'Active' 
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
