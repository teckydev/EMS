const express = require('express');
const { 
    applyForLeave,
    viewOwnLeaves,
    getSpecificLeave,
    cancelLeave
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are protected and inherently scoped to the authenticated employee

// 1. POST /api/leaves - Apply for Leave
router.post('/', protect, applyForLeave);

// 2. GET /api/leaves - View Own Leaves
router.get('/', protect, viewOwnLeaves);

// 3. GET /api/leaves/:id - View Specific Leave Detail
router.get('/:id', protect, getSpecificLeave);

// 4. DELETE /api/leaves/:id - Cancel Leave (Only if Pending)
router.delete('/:id', protect, cancelLeave);

module.exports = router;