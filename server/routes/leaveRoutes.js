const express = require('express');
const { 
    applyForLeave,
    viewOwnLeaves,
    getSpecificLeave,
    cancelLeave,
    getAllLeaves,
    updateLeaveStatus
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

// All routes here are protected and inherently scoped to the authenticated employee

// 1. POST /api/leaves - Apply for Leave
router.post('/', protect, applyForLeave);

router.get(
    '/all', 
    protect, 
    authorizeRoles('admin', 'HR'), 
    getAllLeaves
);

// 2. GET /api/leaves - View Own Leaves
router.get('/', protect, viewOwnLeaves);

// 3. GET /api/leaves/:id - View Specific Leave Detail
router.get('/:id', protect, getSpecificLeave);
// 1. PUT /api/leaves/:id/status - Approve/Reject
router.put(
    '/:id/status', 
    protect, 
    authorizeRoles('admin', 'HR'), 
    updateLeaveStatus
);

// 2. GET /api/leaves/all - Fetch All Leaves with Filters

// 4. DELETE /api/leaves/:id - Cancel Leave (Only if Pending)
router.delete('/:id', protect, cancelLeave);

module.exports = router;