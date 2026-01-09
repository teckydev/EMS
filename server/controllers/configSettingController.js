const LeaveSetting = require("../models/LeaveSetting");
const AttendanceSetting = require("../models/AttendanceSetting");


// ✅ GET /api/settings/leave
const getLeaveSettings = async (req, res) => {
  try {
    let settings = await LeaveSetting.findOne();
    if (!settings) {
      settings = await LeaveSetting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching leave settings:", error);
    res.status(500).json({ message: "Server error fetching leave settings.", error: error.message });
  }
};


// ✅ PUT /api/settings/leave
const updateLeaveSettings = async (req, res) => {
  try {
    const { maxAnnualLeaves, maxCasualLeaves, maxSickLeaves, allowCarryForward } = req.body;

    let settings = await LeaveSetting.findOne();
    if (!settings) {
      settings = new LeaveSetting(req.body);
    } else {
      settings.maxAnnualLeaves = maxAnnualLeaves ?? settings.maxAnnualLeaves;
      settings.maxCasualLeaves = maxCasualLeaves ?? settings.maxCasualLeaves;
      settings.maxSickLeaves = maxSickLeaves ?? settings.maxSickLeaves;
      settings.allowCarryForward = allowCarryForward ?? settings.allowCarryForward;
      settings.updatedAt = new Date();
    }

    await settings.save();
    res.status(200).json({ message: "Leave settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating leave settings:", error);
    res.status(500).json({ message: "Server error updating leave settings.", error: error.message });
  }
};


// ✅ GET /api/settings/attendance
const getAttendanceSettings = async (req, res) => {
  try {
    let settings = await AttendanceSetting.findOne();
    if (!settings) {
      settings = await AttendanceSetting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching attendance settings:", error);
    res.status(500).json({ message: "Server error fetching attendance settings.", error: error.message });
  }
};


// ✅ PUT /api/settings/attendance
const updateAttendanceSettings = async (req, res) => {
  try {
    const { defaultStartTime, defaultEndTime, overtimeEnabled, publicHolidays } = req.body;

    let settings = await AttendanceSetting.findOne();
    if (!settings) {
      settings = new AttendanceSetting(req.body);
    } else {
      settings.defaultStartTime = defaultStartTime ?? settings.defaultStartTime;
      settings.defaultEndTime = defaultEndTime ?? settings.defaultEndTime;
      settings.overtimeEnabled = overtimeEnabled ?? settings.overtimeEnabled;
      
      // Optional: replace or merge holiday list
      if (Array.isArray(publicHolidays)) {
        settings.publicHolidays = publicHolidays;
      }

      settings.updatedAt = new Date();
    }

    await settings.save();
    res.status(200).json({ message: "Attendance settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating attendance settings:", error);
    res.status(500).json({ message: "Server error updating attendance settings.", error: error.message });
  }
};


module.exports = {
  getLeaveSettings,
  updateLeaveSettings,
  getAttendanceSettings,
  updateAttendanceSettings
};
