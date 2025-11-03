const express = require("express");
const {
  addEmployee,
  getEmployees,
  getEmployeesByDepartment,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
  getActiveEmployeeCount,
  getNewHiresCount,
  getEmployeeProfileSelf,
  updateEmployeeSelf
  
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/photoUpload");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();
router.get("/count", protect, getEmployeeCount);

// 2. NEW: GET /api/employees/active-count - Active Employee Count
router.get(
  '/active-count', 
  protect, 
  getActiveEmployeeCount
);
// NEW: GET /api/employees/new - New Hires Count
router.get(
  '/new', 
  protect, 
  getNewHiresCount
);
// Employee fetch self
router.get("/me", protect, getEmployeeProfileSelf);

// Get all employees (accessible to all authenticated users)
router.get("/", protect, getEmployees);

// Get a single employee by ID (accessible to all authenticated users)
router.get("/:id", protect, getEmployeeById);
router.get("/department/:id", protect, getEmployeesByDepartment);


// Add a new employee (admin only)
router.post(
  "/add",
  protect,
  authorizeRoles("admin"),
  upload.single("photo"),
  addEmployee
);

// ✅ PUT /api/employees/self → update profile info
router.put(
  "/self",
  protect, // only logged-in user can update self
  upload.single("photo"), // optional photo upload
  updateEmployeeSelf
);
// Update an employee by ID (admin only)
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("photo"),
  updateEmployee
);

// Delete an employee by ID (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteEmployee);

module.exports = router;
