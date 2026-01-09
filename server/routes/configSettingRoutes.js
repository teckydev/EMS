const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getLeaveSettings,
  updateLeaveSettings,
  getAttendanceSettings,
  updateAttendanceSettings
} = require("../controllers/configSettingController");

// Only Admin & HR can manage configuration
router.get("/leave", protect, authorizeRoles("admin", "HR"), getLeaveSettings);
router.put("/leave", protect, authorizeRoles("admin", "HR"), updateLeaveSettings);

router.get("/attendance", protect, authorizeRoles("admin", "HR"), getAttendanceSettings);
router.put("/attendance", protect, authorizeRoles("admin", "HR"), updateAttendanceSettings);

module.exports = router;
