//This function calculates the `netPay` and saves the full record.

const SalaryRecord = require('../models/SalaryRecord');
const Employee = require('../models/Employee'); // Needed to verify employee/department

// @desc    Add a new salary record for an employee
// @route   POST /api/salaries
// @access  Private/Admin

const addSalaryRecord = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

    // 1. Validate Employee and fetch Department
    const employee = await Employee.findById(employeeId).select('department');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 2. Calculate Net Pay
    const netPay = basicSalary + (allowances || 0) - (deductions || 0);

    // 3. Create the Record
    const record = await SalaryRecord.create({
      employee: employeeId,
      department: employee.department,
      basicSalary,
      allowances,
      deductions,
      netPay,
      payDate: payDate || Date.now(),
      createdBy: req.user?.id || null, // handle if no auth
    });

    res.status(201).json({ message: 'Salary record added successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get Salary History
/**
 * @desc    Get all salary records (Admin/HR access)
 * @route   GET /api/salaries
 * @access  Private/Admin, HR
 */
// GET /api/salaries/salary-history/:employeeId
const getSalaryHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    console.log("EmployeeId from params:", employeeId); // Debugging

    // 1. Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 2. Fetch salary records only for that employee
    const salaries = await SalaryRecord.find({ employee: employeeId })
      .populate('employee', 'empId firstName lastName')  // populate employee details
      .populate('department', 'name')                   // populate department name
      .sort({ payDate: -1 });                           // newest first

    // 3. Return salary history
    res.status(200).json({
      employee: {
        id: employee._id,
        empId: employee.empId,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
      },
      salaryHistory: salaries,
    });

  } catch (error) {
    console.error("Error in getSalaryHistory:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =========================
// UPDATE SALARY RECORD
// =========================
const updateSalaryRecord = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { basicSalary, allowances, deductions, payDate } = req.body;
 console.log('Updating salary:', salaryId, req.body); // 👈 Add this
    const salary = await SalaryRecord.findById(salaryId);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    // Recalculate net pay
    salary.basicSalary = basicSalary ?? salary.basicSalary;
    salary.allowances = allowances ?? salary.allowances;
    salary.deductions = deductions ?? salary.deductions;
    salary.netPay = salary.basicSalary + (salary.allowances || 0) - (salary.deductions || 0);
    salary.payDate = payDate ?? salary.payDate;

    const updatedSalary = await salary.save();

    res.status(200).json({
      message: 'Salary record updated successfully',
      updatedSalary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =========================
// DELETE SALARY RECORD
// =========================
const deleteSalaryRecord = async (req, res) => {
  try {
    const { salaryId } = req.params;

    const salary = await SalaryRecord.findById(salaryId);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    await salary.deleteOne();

    res.status(200).json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};// @desc    Get a single salary record by ID
// @route   GET /api/salaries/:id
// @access  Private/Admin, HR
const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the salary record by ID and populate related data
    const salary = await SalaryRecord.findById(id)
      .populate('employee', 'empId firstName lastName department')
      .populate('department', 'name');

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.status(200).json(salary);
  } catch (error) {
    console.error('Error fetching salary by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { addSalaryRecord,getSalaryHistory,updateSalaryRecord,deleteSalaryRecord,getSalaryById };