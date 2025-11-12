const mongoose = require("mongoose");

const leaveSettingSchema = new mongoose.Schema({
  maxAnnualLeaves: {
    type: Number,
    default: 12
  },
  maxCasualLeaves: {
    type: Number,
    default: 6
  },
  maxSickLeaves: {
    type: Number,
    default: 6
  },
  allowCarryForward: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LeaveSetting", leaveSettingSchema);
