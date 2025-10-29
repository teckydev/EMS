const Leave = require('../models/Leave');
const Employee = require('../models/Employee'); // Needed to find the employeeId from the User ID

// Helper to find the employee ID from the authenticated user ID
const getEmployeeId = async (userId) => {
    const employee = await Employee.findOne({ userId }).select('_id');
    if (!employee) {
        throw new Error("Employee profile not linked to this user.");
    }
    return employee._id;
};

/**
 * @desc    Employee applies for a new leave
 * @route   POST /api/leaves
 * @access  Private (Employee)
 */
const applyForLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        
        // 1. Get the authenticated employee's ID
        const employeeId = await getEmployeeId(req.user.userId);

        // Basic validation
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'Start date cannot be after end date.' });
        }
        
        // 2. Create the leave record (status defaults to 'Pending')
        const leave = await Leave.create({
            employee: employeeId,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json({ 
            message: 'Leave request submitted successfully.', 
            leave 
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error applying for leave.', error: error.message });
    }
};

/**
 * @desc    Employee views all their own leave requests
 * @route   GET /api/leaves
 * @access  Private (Employee)
 */
const viewOwnLeaves = async (req, res) => {
    try {
        const employeeId = await getEmployeeId(req.user.userId);
        
        // Filter by the employee's ID and sort by newest request first
        const leaves = await Leave.find({ employee: employeeId })
            .select('-employee -__v') // Hide unnecessary fields
            .sort({ createdAt: -1 }); 

        res.status(200).json(leaves);

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching leave history.', error: error.message });
    }
};

/**
 * @desc    Employee views details of a specific leave request
 * @route   GET /api/leaves/:id
 * @access  Private (Employee)
 */
const getSpecificLeave = async (req, res) => {
    try {
        const employeeId = await getEmployeeId(req.user.userId);
        const leaveId = req.params.id;

        // Find the leave by ID AND ensure it belongs to the authenticated employee
        const leave = await Leave.findOne({ _id: leaveId, employee: employeeId })
            .select('-employee -__v');

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found or unauthorized.' });
        }

        res.status(200).json(leave);

    } catch (error) {
        // Handle MongoDB Cast Error if ID is invalid format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Leave ID format.' });
        }
        res.status(500).json({ message: 'Server error fetching leave detail.', error: error.message });
    }
};

/**
 * @desc    Employee cancels a pending leave request
 * @route   DELETE /api/leaves/:id
 * @access  Private (Employee)
 */
const cancelLeave = async (req, res) => {
    try {
        const employeeId = await getEmployeeId(req.user.userId);
        const leaveId = req.params.id;

        // 1. Find the leave, ensure it belongs to the employee, and is currently 'Pending'
        const leave = await Leave.findOne({
            _id: leaveId,
            employee: employeeId,
            status: 'Pending'
        });

        if (!leave) {
            // Either the ID is wrong, the leave doesn't belong to the user, OR it's already approved/rejected
            return res.status(400).json({ message: 'Cannot cancel: Leave not found, or its status is not Pending.' });
        }

        // 2. Update the status to 'Cancelled'
        leave.status = 'Cancelled';
        await leave.save();

        res.status(200).json({ message: 'Leave request successfully cancelled.', leave });

    } catch (error) {
        res.status(500).json({ message: 'Server error during leave cancellation.', error: error.message });
    }
};

module.exports = {
    applyForLeave,
    viewOwnLeaves,
    getSpecificLeave,
    cancelLeave,
};