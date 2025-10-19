const Department = require('../models/Department');

// Add Department
const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get All Departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Department name and description are required' });
    }

    // Find the department and update it
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the department and delete it
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get the total count of all departments
 * @route   GET /api/departments/count
 * @access  Private
 */
const getDepartmentCount = async (req, res) => {
    try {
        // Count all documents in the Department collection
        const count = await Department.countDocuments({}); 

        res.status(200).json({ 
            totalDepartments: count 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error fetching department count.', 
            error: error.message 
        });
    }
};
module.exports = { addDepartment,getDepartments,updateDepartment,deleteDepartment,getDepartmentCount};
