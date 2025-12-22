const Attendance = require("../models/Attendance");
const Settings = require("../models/AttendanceSetting"); // later part
const Employee = require("../models/Employee");
// Helper: Get employee ID from logged in user

const getEmployeeId = async (userId) => {
  const employee = await Employee.findOne({ user: userId }).select('_id');
  if (!employee) {
    throw new Error("Employee profile not linked to this user.");
  }
  return employee._id;
};

// ➤ 1️⃣ CHECK-IN
const checkIn = async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ employee: employeeId, date: today });

    // If no record exists, create one
    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        date: today,
        sessions: [{ checkIn: new Date() }],
        status: "Present"
      });
    } else {
      // Check if last session is still open (no checkout yet)
      const lastSession = attendance.sessions[attendance.sessions.length - 1];
      if (lastSession && !lastSession.checkOut) {
        return res.status(400).json({ message: "You are already checked in." });
      }

      // Otherwise, start a new session
      attendance.sessions.push({ checkIn: new Date() });
    }

    await attendance.save();
    res.status(200).json({ message: "Checked in successfully", attendance });

  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ 2️⃣ CHECK-OUT
const checkOut = async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: "No active session found. Please check in first." });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    if (!lastSession || lastSession.checkOut) {
      return res.status(400).json({ message: "You are not currently checked in." });
    }

    // Close the session
    lastSession.checkOut = new Date();

    // Calculate duration of this session (in hours)
    const diffMs = new Date(lastSession.checkOut) - new Date(lastSession.checkIn);
    const hours = diffMs / (1000 * 60 * 60);

    attendance.totalHours = (attendance.totalHours || 0) + hours;

    await attendance.save();
    res.status(200).json({ message: "Checked out successfully", attendance });

  } catch (error) {
    console.error("Check-out Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ 3. Get My Attendance History
const getMyAttendance = async (req, res) => {

    try {
        const attendance = await Attendance.find({ employee: employeeId })
  .populate({
    path: "employee",
    select: "empId firstName lastName department position",
    populate: {
      path: "department",
      select: "name",
    },
  })
  .sort({ date: -1 });

if (!attendance.length) {
  return res.status(404).json({ message: "No attendance found" });
}

const emp = attendance[0].employee;

const response = {
  employee: {
    id: emp._id,
    name: `${emp.firstName} ${emp.lastName}`,
    empId: emp.empId,
    department: emp.department?.name || emp.department,
    position: emp.position, // ✅ Add this
  },
  totalDays: attendance.length,
  records: attendance,
};

res.status(200).json(response);


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ➤ 4. Admin – Get All Attendance
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("employee", "firstName lastName empId department")
            .sort({ date: -1 });

        res.status(200).json(attendance);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ➤ 5. Admin – Mark Absent for a specific day
const markAbsent = async (req, res) => {
  try {
    const { employeeId, date } = req.body;

    // ✅ Find employee details
    const employee = await Employee.findById(employeeId).populate("department", "name");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ✅ Normalize the date (so it doesn't store time differences)
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    // ✅ Check if already marked for that date
    const existingRecord = await Attendance.findOne({ employee: employeeId, date: entryDate });
    if (existingRecord) {
      return res.status(200).json({ message: "Attendance already exists", attendance: existingRecord });
    }

    // ✅ Create attendance with employee info
    const attendance = await Attendance.create({
      employee: employeeId,
      empId: employee.empId,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department?.name || "N/A",
      position: employee.position || "N/A",
      date: entryDate,
      status: "Absent",
      totalHours: 0,
      sessions: []
    });

    res.status(201).json({ message: "Marked Absent successfully", attendance });
  } catch (error) {
    console.error("❌ Error marking absent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all employees’ attendance (Admin View)
 * @route GET /api/attendance/all
 * @access Admin/HR
 */
const getAllAttendanceAdmin = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee", "firstName lastName empId department position")
      .sort({ date: -1 });

    if (!attendance || attendance.length === 0) {
      return res.status(200).json({ message: "No attendance records found", records: [] });
    }

    res.status(200).json({
      count: attendance.length,
      records: attendance
    });

  } catch (error) {
    console.error("Admin Fetch Attendance Error:", error);
    res.status(500).json({ message: "Server error fetching all attendance.", error: error.message });
  }
};

/**
 * @desc Get specific employee’s attendance by ID (Admin View)
 * @route GET /api/attendance/:employeeId
 * @access Admin/HR
 */
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Verify employee exists
    const employee = await Employee.findById(employeeId).select("firstName lastName empId department");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch attendance records
    const records = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .populate("employee", "firstName lastName empId department position");

    res.status(200).json({
      employee: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        empId: employee.empId,
        department: employee.department
      },
      totalDays: records.length,
      records
    });

  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({ message: "Server error fetching attendance", error: error.message });
  }
};

/**
 * @desc Get attendance history for logged-in employee
 * @route GET /api/attendance/me
 * @access Private (Employee)
 */
const getMeAttendance = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT by authMiddleware
    console.log("👤 Logged-in user:", userId);

    // Get employeeId linked to this user
    const employeeId = await getEmployeeId(userId);

    // Fetch all attendance records for this employee
    const attendanceRecords = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .select("-__v");

    // If no attendance found
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(200).json({
        message: "No attendance records found.",
        count: 0,
        records: []
      });
    }

    // Format for readability
    const formatted = attendanceRecords.map((rec) => ({
      date: rec.date,
      totalHours: rec.totalHours || 0,
      status: rec.status || "N/A",
      sessions: rec.sessions || [],
      createdAt: rec.createdAt,
      updatedAt: rec.updatedAt,
    }));

    res.status(200).json({
      message: "Attendance records fetched successfully.",
      count: formatted.length,
      records: formatted,
    });
  } catch (error) {
    console.error("❌ getMyAttendance Error:", error.message);
    res.status(500).json({
      message: "Server error fetching your attendance records.",
      error: error.message,
    });
  }
};
module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    markAbsent,
    getAllAttendanceAdmin,
    getAttendanceByEmployee,
    getMeAttendance   
};
