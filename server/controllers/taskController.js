const Task = require("../models/Task");
const Employee = require("../models/Employee");

// 🟢 Admin creates & assigns a new task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, department, dueDate, priority } = req.body;
    const adminId = req.user.userId;

    if (!title || !description || !assignedTo || !department || !dueDate) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // ✅ Check if employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: "Assigned employee not found." });
    }

    // ✅ Create new task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      department,
      dueDate,
      priority,
      createdBy: adminId
    });

    // 🔔 Optional: send notification logic later (email / websocket)
    res.status(201).json({
      message: "Task created and assigned successfully.",
      task
    });

  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Server error creating task.", error: error.message });
  }
};

// 🟡 Get all tasks (Admin/Manager)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "firstName lastName empId position")
      .populate("department", "name")
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All tasks fetched successfully.",
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching tasks.", error: error.message });
  }
};

// 🟣 Employee - Get my tasks
const getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    const tasks = await Task.find({ assignedTo: employeeId })
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "My tasks fetched successfully.",
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching my tasks.", error: error.message });
  }
};

// 🔵 Update task progress or status (Employee)
const updateTaskProgress = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { progress, status } = req.body;
    const employeeId = req.user.employeeId;

    const task = await Task.findOne({ _id: taskId, assignedTo: employeeId });
    if (!task) {
      return res.status(404).json({ message: "Task not found or not assigned to you." });
    }

    if (progress !== undefined) task.progress = progress;
    if (status) task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully.",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating task.", error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskProgress
};
