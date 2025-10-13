const express = require('express');
const { 
  addEmployee, 
  getEmployees, 
 getEmployeesByDepartment, 
 getEmployeeById,
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/photoUpload');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Get all employees (accessible to all authenticated users)
router.get('/', protect, getEmployees);

// Get a single employee by ID (accessible to all authenticated users)
router.get('/:id', protect, getEmployeeById);
router.get('/department/:id',protect, getEmployeesByDepartment);


// Add a new employee (admin only)
router.post('/add', protect, authorizeRoles('admin'),upload.single('photo'), addEmployee);

// Update an employee by ID (admin only)
router.put('/:id', protect, authorizeRoles('admin'),upload.single('photo'), updateEmployee);

// Delete an employee by ID (admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteEmployee);

module.exports = router;