const Leave = require('../models/Leave');
const Employee = require('../models/Employee'); // Needed to find the employeeId from the User ID

// Helper to find the employee ID from the authenticated user ID
const getEmployeeId = async (userId) => {
    const employee = await Employee.findOne({ user: userId }).select('_id');
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
// const getSpecificLeave = async (req, res) => {
//     try {
//         const employeeId = await getEmployeeId(req.user.userId);
//         const leaveId = req.params.id;

//         // Find the leave by ID AND ensure it belongs to the authenticated employee
//         const leave = await Leave.findOne({ _id: leaveId, employee: employeeId })
//             .select('-employee -__v');

//         if (!leave) {
//             return res.status(404).json({ message: 'Leave request not found or unauthorized.' });
//         }

//         res.status(200).json(leave);

//     } catch (error) {
//         // Handle MongoDB Cast Error if ID is invalid format
//         if (error.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid Leave ID format.' });
//         }
//         res.status(500).json({ message: 'Server error fetching leave detail.', error: error.message });
//     }
// };

// const getSpecificLeave = async (req, res) => {
//   try {
//     const employeeId = await getEmployeeId(req.user.userId);
//     const leaveId = req.params.id;

//     // Find the leave by ID and ensure it belongs to the logged-in employee
//     const leave = await Leave.findOne({ _id: leaveId, employee: employeeId })
//       .populate({
//         path: 'employee',
//         select: 'firstName lastName empId department position',
//         populate: { path: 'department', select: 'name' } // ✅ populate department name
//       })
//       .select('-__v');

//     if (!leave) {
//       return res.status(404).json({ message: 'Leave request not found or unauthorized.' });
//     }

//     // Prepare clean, readable response
//     const response = {
//       empId: leave.employee?.empId,
//       employeeName: `${leave.employee?.firstName} ${leave.employee?.lastName}`,
//       department: leave.employee?.department?.name || 'N/A', // ✅ fixed department
//       leaveType: leave.leaveType,
//       position: leave.employee?.position,
//       startDate: leave.startDate,
//       endDate: leave.endDate,
//       reason: leave.reason,
//       status: leave.status,
//       appliedAt: leave.appliedAt,
//       updatedAt: leave.updatedAt,
//       numberOfDays: leave.numberOfDays,
//       _id: leave._id
//     };

//     res.status(200).json(response);

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({ message: 'Invalid Leave ID format.' });
//     }
//     console.error("Error fetching leave detail:", error);
//     res.status(500).json({ message: 'Server error fetching leave detail.', error: error.message });
//   }
// };

const getSpecificLeave = async (req, res) => {
  try {
    // Optional: Only allow Admins/HR
    if (!['admin', 'hr'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }

    const leaveId = req.params.id;

    // Find leave by ID without employee restriction
    const leave = await Leave.findById(leaveId)
      .populate({
        path: 'employee',
        select: 'firstName lastName empId department position',
        populate: { path: 'department', select: 'name' },
      })
      .select('-__v');

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found.' });
    }

    const response = {
      empId: leave.employee?.empId,
      employeeName: `${leave.employee?.firstName} ${leave.employee?.lastName}`,
      department: leave.employee?.department?.name || 'N/A',
      leaveType: leave.leaveType,
      position: leave.employee?.position,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      appliedAt: leave.appliedAt,
      updatedAt: leave.updatedAt,
      numberOfDays: leave.numberOfDays,
      _id: leave._id,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching leave for admin:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Leave ID format.' });
    }
    res.status(500).json({
      message: 'Server error fetching leave detail.',
      error: error.message,
    });
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
/**
 * @desc    Admin/HR approves or rejects a leave request
 * @route   PUT /api/leaves/:id/status
 * @access  Private/Admin, HR
 */
const updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id;
        console.log("Leave ID to update:", leaveId);
        const adminId = req.user.userId; // Admin/HR performing the action
        console.log("Admin/HR User ID:", adminId);
        const { status, comments } = req.body || {}; // ✅ comment is optional

        // 1️⃣ Validate status input
        if (!status || !['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid or missing status. Must be "Approved" or "Rejected".'
            });
        }

        // 2️⃣ Prepare update data
        const updateData = {
            status,
            approvedBy: adminId
        };

        // Only add comment if admin provided it
        if (comments && comments.trim() !== '') {
            updateData.comments = comments;
        }

        // 3️⃣ Find and update leave
        const leave = await Leave.findByIdAndUpdate(
            leaveId,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee', 'firstName lastName empId department');

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        // 4️⃣ Respond success
        res.status(200).json({
            message: `Leave request ${status.toLowerCase()} successfully.`,
            updatedLeave: leave
        });

    } catch (error) {
        console.error('Leave Status Update Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Leave ID format.' });
        }

        res.status(500).json({
            message: 'Server error updating leave status.',
            error: error.message
        });
    }
};



/**
 * @desc    Admin/HR views all leave requests with optional filtering
 * @route   GET /api/leaves/all
 * @access  Private/Admin, HR
 * @query   status, department, from, to
 */
const getAllLeaves = async (req, res) => {
    try {
        const { status, department, from, to } = req.query;
        let filter = {};

        // 1. Status Filter (e.g., ?status=Pending)
        if (status) {
            filter.status = status;
        }

        // 2. Date Range Filter (e.g., ?from=2025-10-01&to=2025-10-31)
        if (from || to) {
            filter.$and = [];
            if (from) {
                const startDate = new Date(from);
                filter.$and.push({ startDate: { $gte: startDate } });
            }
            if (to) {
                const endDate = new Date(to);
                // Search for leaves that END before or on the 'to' date
                filter.$and.push({ endDate: { $lte: endDate } });
            }
        }
        
        // 3. Department Filter (Requires an efficient way to filter employees by department ID)
        if (department) {
             // Find all employees belonging to the specified department ID
            const employeesInDept = await Employee.find({ department: department }).select('_id');
            const employeeIds = employeesInDept.map(emp => emp._id);
            
            // Add employee filter using the IDs found
            filter.employee = { $in: employeeIds };
        }

        // 4. Execute the query
        const leaves = await Leave.find(filter)
            .populate('employee', 'firstName lastName empId department position') // Populate employee details
            .populate('approvedBy', 'email role') // Show who took action
            .sort({ appliedAt: -1 });

        res.status(200).json(leaves);

    } catch (error) {
        console.error("Fetch All Leaves Error:", error);
        res.status(500).json({ message: 'Server error fetching all leave requests.', error: error.message });
    }
};
module.exports = {
    applyForLeave,
    viewOwnLeaves,
    getSpecificLeave,
    cancelLeave,
    updateLeaveStatus,
    getAllLeaves
};