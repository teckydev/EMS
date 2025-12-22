const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTaskProgress,
  updateTaskDetails,
  deleteTask
} = require("../controllers/taskController");
// ✅ Temporary test middleware
//✅ Dummy auth middleware must come BEFORE any routes

// 🟢 Admin creates task
router.post("/", protect, authorizeRoles("admin", "HR"), createTask);

// 🟡 Admin gets all tasks
router.get("/", protect, authorizeRoles("admin", "HR"), getAllTasks);

// 🟣 Employee gets own tasks
router.get("/my-tasks", protect, authorizeRoles("employee"), getMyTasks);

// ✅ Route for Admin or Employee to get task details
router.get("/:id",protect, authorizeRoles("employee", "admin", "HR"), getTaskById);

// 🔵 Employee updates progress
router.put("/:id/progress", protect, authorizeRoles("employee"), updateTaskProgress);

// 🟠 Admin/Manager updates task details
router.put("/:id", protect, authorizeRoles("admin", "HR"), updateTaskDetails);

// ✅ Admin-only route for deleting a task
router.delete("/:id", protect, authorizeRoles("admin", "HR"), deleteTask);
module.exports = router;
