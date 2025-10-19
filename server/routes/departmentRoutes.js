const express = require('express');
const { addDepartment,getDepartments,updateDepartment,deleteDepartment,getDepartmentCount} = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/departments/count - Total Department Count KPI
router.get(
  '/count', 
  protect, 
  getDepartmentCount
);

// POST /api/departments/add - only accessible by users with 'admin' role
// The `protect` middleware handles token verification
// The `authorizeRoles` middleware ensures the user's role is 'admin'
router.post('/add', protect, authorizeRoles('admin'), addDepartment);

// GET /api/departments - Accessible to any authenticated user
router.get('/', protect, getDepartments);

// New route for updating a department by its ID
router.put('/:id', protect, authorizeRoles('admin'), updateDepartment);

// New route to delete a department by its ID
router.delete('/:id', protect, authorizeRoles('admin'), deleteDepartment);
module.exports = router;