const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);
// ✅ Cascade delete hook
departmentSchema.pre('findOneAndDelete', async function (next) {
  const departmentId = this.getQuery()['_id'];
  try {
    // Import models here to avoid circular dependency
    const Employee = mongoose.model('Employee');
    const SalaryRecord = mongoose.model('SalaryRecord');
    const Leave = mongoose.model('Leave');

    // Find all employees under this department
    const employees = await Employee.find({ department: departmentId });

    if (employees.length > 0) {
      const employeeIds = employees.map(emp => emp._id);

      // Delete related Salary records
      await SalaryRecord.deleteMany({ employee: { $in: employeeIds } });

      // Delete related Leave records
      await Leave.deleteMany({ employee: { $in: employeeIds } });

      // Delete employees themselves
      await Employee.deleteMany({ department: departmentId });
    }

    console.log(`✅ Cascade deleted related Employees, Salaries, and Leaves for department ${departmentId}`);
    next();
  } catch (error) {
    console.error('❌ Cascade delete failed:', error);
    next(error);
  }
});
const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
