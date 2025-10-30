

//This defines the new endpoint and uses the security middleware.

const express = require('express');
const { addSalaryRecord,getSalaryHistory,updateSalaryRecord,deleteSalaryRecord,getSalaryById,getEmployeeSalary } = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/salaries - Only accessible by Admin/HR roles
router.post('/', protect, authorizeRoles('admin', 'HR'), addSalaryRecord);

router.get('/salary-history/:employeeId', protect, getSalaryHistory);

router.get(
    '/view-salary', 
    protect, // Authentication required
    getEmployeeSalary
);
// Get salary by ID
router.get('/:id', protect, getSalaryById);  // 👈 new route

// GET /api/salaries/me - Employee Dashboard Salary History

// Update salary record
router.put('/:salaryId', protect, authorizeRoles('admin', 'HR'), updateSalaryRecord);

// Delete salary record
router.delete('/:salaryId', protect, authorizeRoles('admin', 'HR'), deleteSalaryRecord);

module.exports = router;