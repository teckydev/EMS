// controllers/dashboardController.js
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Leave = require('../models/Leave');



const getAdminDashboardStats = async (req, res) => {
    try {
        // 1️⃣ Total Employees
        const totalEmployees = await Employee.countDocuments();

        // 2️⃣ Active Employees
        const activeEmployees = await Employee.countDocuments({ status: "Active" });

        // 3️⃣ On Leave Today
        const today = new Date().toISOString().split("T")[0];
        const onLeaveToday = await Leave.countDocuments({
            status: "Approved",
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        // 4️⃣ Employees per Department
        const employeesByDepartment = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "departments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "department"
                }
            },
            { $unwind: "$department" },
            {
                $project: {
                    name: "$department.name",
                    count: 1
                }
            }
        ]);

        // 5️⃣ Gender Distribution
        const genderStats = await Employee.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        // 6️⃣ Role Distribution
        const roleStats = await Employee.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // 7️⃣ New Hires (last 30 days)
        const past30 = new Date();
        past30.setDate(past30.getDate() - 30);

        const newHires = await Employee.countDocuments({
            hireDate: { $gte: past30 }
        });

        // 8️⃣ Attrition Rate — Employees who left (status = Inactive)
        const inactiveEmployees = await Employee.countDocuments({ status: "Inactive" });

        const attritionRate =
            totalEmployees === 0
                ? 0
                : ((inactiveEmployees / totalEmployees) * 100).toFixed(1);

        // ⭐ Final Response
        res.json({
            totalEmployees,
            activeEmployees,
            onLeaveToday,
            newHires,
            attritionRate,
            employeesByDepartment,
            genderStats,
            roleStats
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            message: "Server error fetching dashboard stats",
            error: error.message
        });
    }
};

const getRecentActivity = async (req, res) => {
  try {
    const leaveActivities = await Leave.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('employee', 'firstName lastName')
      .select('status updatedAt leaveType');

    const employeeActivities = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName status createdAt');

    // Format Leave Activity
    const leaveLogs = leaveActivities.map(item => ({
      employee: `${item.employee.firstName} ${item.employee.lastName}`,
      action: `Applied ${item.leaveType}`,
      date: item.updatedAt,
      status: item.status
    }));

    // Format Employee Activity
    const employeeLogs = employeeActivities.map(item => ({
      employee: `${item.firstName} ${item.lastName}`,
      action: item.status === 'Active' ? 'Joined' : 'Updated',
      date: item.createdAt,
      status: item.status
    }));

    // Merge & Sort
    const recentActivity = [...leaveLogs, ...employeeLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json(recentActivity);

  } catch (err) {
    console.error("Recent Activity Error:", err);
    res.status(500).json({ message: "Error fetching recent activity", error: err.message });
  }
};

module.exports = { getAdminDashboardStats, getRecentActivity };