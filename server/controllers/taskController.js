const Task = require("../models/Task");
const Employee = require("../models/Employee");
const mongoose = require('mongoose');
const Notification = require("../models/Notification");

// 🟢 Admin creates & assigns a new task

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, department, dueDate, priority } = req.body;
    const adminId = req.user.userId;

    // ✅ Ensure assignedTo is an Employee ID
    const employee = await Employee.findById(assignedTo);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const task = await Task.create({
      title,
      description,
      assignedTo: employee._id,
      department,
      dueDate,
      priority,
      createdBy: adminId
    });
console.log("✅ Task created:", task._id);
console.log("🔔 Attempting to create notification for:", assignedTo);
    // ✅ Save Notification in DB
    const notification = await Notification.create({
      employeeId: employee._id,
      title: 'New Task Assigned',
      message: `You have been assigned: ${title}`,
      taskId: task._id,
      type: 'task'
    });

     // ✅ Emit using Employee._id
    global.io.to(employee._id.toString()).emit("new-notification", {
      title: "New Task Assigned",
      message: `You have a new task: ${title}`,
      taskId: task._id
    });

    console.log("📢 Notification emitted to employee:", employee._id.toString());

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Server error creating task", error: error.message });
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
    console.log("Inside getMyTasks, req.user:", req.user);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing in token." });
    }

    // ✅ Step 1: find the employee linked to this user
    const employee = await Employee.findOne({ user: new mongoose.Types.ObjectId(userId) });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found for this user." });
    }

    // ✅ Step 2: use the employee._id to fetch tasks
    const tasks = await Task.find({ assignedTo: employee._id })
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "My tasks fetched successfully.",
      employeeId: employee._id,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching my tasks.",
      error: error.message,
    });
  }
};


// 🔵 Update task progress or status (Employee)
const updateTaskProgress = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { progress, status } = req.body;
    const userId = req.user.id || req.user.userId; // ✅ support both key names
  console.log("🧩 Logged-in User ID:", userId);
    console.log("🧩 Task ID from URL:", taskId);
    // ✅ Step 1: find the employee linked to this user (supports both user field types)
    const employee = await Employee.findOne({ user: userId })
    // const employee = await Employee.findOne({
    //   $or: [
    //     { user: new mongoose.Types.ObjectId(userId) },
    //     { "user._id": new mongoose.Types.ObjectId(userId) }
    //   ]
    // });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found for this user." });
    }

    // ✅ Step 2: find the task assigned to that employee
    const task = await Task.findOne({
      _id: taskId,
      assignedTo: employee._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not assigned to you.",
      });
    }

    // ✅ Step 3: update fields
    if (progress !== undefined) task.progress = progress;
    if (status) task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({
      message: "Server error updating task.",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // ✅ Validate ObjectId format
    if (taskId && !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID format." });
    }

    // ✅ Find task by ID and populate references
    const task = await Task.findById(taskId)
      .populate("assignedTo", "firstName lastName email position")  // show employee details
      .populate("department", "name");                              // show department name

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task details fetched successfully.",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching task details.",
      error: error.message,
    });
  }
};

// 🟠 Admin/Manager - Update task details
const updateTaskDetails = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Validate ObjectId
    if (!taskId) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Extract updated fields from request body
    const { title, description, dueDate, priority, assignedTo, status } = req.body;

    // Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully by admin.",
      updatedTask: task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating task details.",
      error: error.message,
    });
  }
};
// 🟠 Delete a task (Admin/Manager)
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID format." });
    }


    // ✅ Try to find and delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
      deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting task.",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTaskProgress,
  updateTaskDetails,
  deleteTask
};
