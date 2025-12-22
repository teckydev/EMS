const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskProgress
} = require("../controllers/taskController");

// 🟢 Admin creates task
router.post("/", protect, authorizeRoles("admin", "HR"), createTask);

// 🟡 Admin gets all tasks
router.get("/", protect, authorizeRoles("admin", "HR"), getAllTasks);

// 🟣 Employee gets own tasks
router.get("/my-tasks", protect, authorizeRoles("Employee"), getMyTasks);

// 🔵 Employee updates progress
router.put("/:id/progress", protect, authorizeRoles("Employee"), updateTaskProgress);

module.exports = router;
