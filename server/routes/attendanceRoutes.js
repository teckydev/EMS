const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
    checkIn,
    checkOut,
    getMeAttendance,
    getAllAttendanceAdmin,
    getAttendanceByEmployee,
    markAbsent
} = require("../controllers/AttendanceController");

// Employee Routes
router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/me", protect, getMeAttendance);

// Admin Routes
router.get("/all", protect, authorizeRoles("admin", "HR"), getAllAttendanceAdmin);
router.get("/:employeeId", protect, authorizeRoles("admin", "HR"), getAttendanceByEmployee);
router.post("/mark-absent", protect, authorizeRoles("admin", "HR"), markAbsent);

module.exports = router;
