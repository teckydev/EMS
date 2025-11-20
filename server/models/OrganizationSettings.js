const mongoose = require('mongoose');
const OrganizationSettingSchema = new mongoose.Schema({

    companyName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  logo: {
    type: String // path to uploaded logo (e.g., /uploads/logo.png)
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  workingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('OrganizationSetting', OrganizationSettingSchema);