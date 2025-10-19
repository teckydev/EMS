const Employee = require("../models/Employee");
const User = require('../models/User');
const bcrypt = require('bcrypt');
// @desc    Create a new employee
// @route   POST /api/employees/add
// @desc    Create a new employee
// @route   POST /api/employees/add
// const addEmployee = async (req, res) => {
//   try {
//     const {
//       empId,
//       firstName,
//       lastName,
//       email,
//       phone,
//       department,
//       position,
//       dateOfBirth,
//       gender,
//       salary,
//       password,
//       role,
//     } = req.body;

//     // Check for required fields
//     if (
//       !empId||
//       !firstName ||
//       !lastName ||
//       !email ||
//       !department ||
//       !position ||
//       !role
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Missing required employee fields" });
//     }

//     // Check if employee already exists by email
//     const exists = await Employee.findOne({ email });
//     if (exists) {
//       return res
//         .status(400)
//         .json({ message: "Employee with this email already exists" });
//     }

//     // ✅ Handle address from FormData
//     let address = {};
//     if (req.body.address) {
//       // If Angular sent JSON string
//       try {
//         address = JSON.parse(req.body.address);
//       } catch (err) {
//         address = req.body.address; // fallback
//       }
//     } else {
//       // If Angular sent nested keys
//       address = {
//         street: req.body["address[street]"],
//         city: req.body["address[city]"],
//         state: req.body["address[state]"],
//         zipCode: req.body["address[zipCode]"],
//       };
//     }

//     const photo = req.file ? `uploads/${req.file.filename}` : null;

//     const employee = await Employee.create({
//       empId,
//       firstName,
//       lastName,
//       email,
//       phone,
//       department,
//       position,
//       dateOfBirth,
//       gender,
//       salary,
//       password,
//       address,
//       user: req.user?.id || null, // optional: link to logged-in user
//       photo,
//       role,
//     });

//     res.status(201).json(employee);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const addEmployee = async (req, res) => {
  try {
    const {
      empId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      dateOfBirth,
      gender,
      salary,
      password,
      role,
    } = req.body;

    // 🔹 Validate required fields
    if (!empId || !firstName || !lastName || !email || !department || !position) {
      return res.status(400).json({ message: "Missing required employee fields" });
    }

    // 🔹 Check if email already exists in Employee or User
    const existingEmployee = await Employee.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingEmployee || existingUser) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    // 🔹 Generate or hash password
    // const plainPassword = password || "Emp@" + Math.floor(Math.random() * 10000);
    // const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 🔹 Handle address
    let address = {};
    if (req.body.address) {
      try {
        address = JSON.parse(req.body.address);
      } catch {
        address = req.body.address;
      }
    } else {
      address = {
        street: req.body["address[street]"],
        city: req.body["address[city]"],
        state: req.body["address[state]"],
        zipCode: req.body["address[zipCode]"],
      };
    }

    // 🔹 Handle photo
    const photo = req.file ? `uploads/${req.file.filename}` : null;

    // 🔹 Ensure role is lowercase for consistency
    const roleValue = role ? role.toLowerCase() : "employee";

    // 🔹 Create a User record for login
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: roleValue,
    });

    // 🔹 Create Employee record
    const newEmployee = await Employee.create({
      empId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      dateOfBirth,
      gender,
      salary,
      password,
      address,
      photo,
      role: roleValue,
      user: newUser._id,
    });

    // 🔹 Return response with temporary password
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
      credentials: { email, password },
    });
  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("department");
    employees.forEach((emp) => {
      emp.photoUrl = emp.photo ? `http://localhost:5000/${emp.photo}` : null;
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// GET /api/employees/department/:deptId
// const getEmployeesByDepartment = async (req, res) => {
//   try {
//     // const deptId = mongoose.Types.ObjectId(req.params.deptId);
//     const employees = await Employee.find({ department: deptId });
//     res.status(200).json(employees);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
const getEmployeesByDepartment = async (req, res) => {
  const { id } = req.params; // department id
  console.log("Department ID received:", id); // ✅ Debug

  try {
    const employees = await Employee.find({ department: id })
      .select("_id empId firstName lastName salary department")
      .populate("department", "name"); // optional, to get department name

    console.log("Employees found:", employees); // ✅ Debug

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees by department:", error); // ✅ Log actual error
    return res.status(500).json({
      success: false,
      error: "Server error while fetching employees by department",
    });
  }
};
// GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("department");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    // 1️⃣ Find employee first
    const existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2️⃣ Handle address (parse safely)
    let address = existingEmployee.address || {};
    if (req.body.address) {
      try {
        // If Angular sends FormData with JSON.stringify
        const parsedAddress = JSON.parse(req.body.address);
        address = { ...address, ...parsedAddress }; // merge old + new
      } catch (err) {
        console.log("❌ Address parse failed:", err.message);
      }
    }

    // 3️⃣ Handle photo
    const photo = req.file
      ? `uploads/${req.file.filename}`
      : existingEmployee.photo; // keep old if not updated

    // 4️⃣ Build update object
    const updatedData = {
      ...req.body,
      address,
      photo,
    };

    // 5️⃣ Remove password if not updated
    if (!updatedData.password) {
      delete updatedData.password;
    }

    // 6️⃣ Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete an employee by ID
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get the total count of all active employees
 * @route   GET /api/employees/count
 * @access  Private
 */
const getEmployeeCount = async (req, res) => {
    try {
        // Use countDocuments() for maximum efficiency on large collections
        const count = await Employee.countDocuments({}); 

        res.status(200).json({ 
            totalEmployees: count 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error fetching employee count.', 
            error: error.message 
        });
    }
};

/**
 * @desc    Get the count of employees with a status of "Active"
 * @route   GET /api/employees/active-count
 * @access  Private
 */
const getActiveEmployeeCount = async (req, res) => {
    try {
        // Query to count only documents where the status field is "Active"
        const count = await Employee.countDocuments({ status: "Active" }); 

        res.status(200).json({ 
            activeEmployees: count 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error fetching active employee count.', 
            error: error.message 
        });
    }
};

/**
 * @desc    Get the count of employees hired within the last N days
 * @route   GET /api/employees/new?days=30
 * @access  Private
 * @query   days={number} (Defaults to 30)
 */
const getNewHiresCount = async (req, res) => {
    try {
        // 1. Get the number of days from the query parameter, default to 30
        const days = parseInt(req.query.days) || 30; 

        // 2. Calculate the cutoff date (Today - N days)
        const cutoffDate = new Date();
        // Set the date back by the specified number of days
        cutoffDate.setDate(cutoffDate.getDate() - days); 

        // 3. Define the query: hireDate greater than or equal to the cutoff date
        const query = {
            hireDate: { $gte: cutoffDate },
            // Optional: You might want to exclude terminated employees from the count
            // status: { $ne: 'Terminated' } 
        };

        // 4. Count the documents matching the query
        const count = await Employee.countDocuments(query); 

        res.status(200).json({ 
            newHires: count,
            days: days 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error fetching new hires count.', 
            error: error.message 
        });
    }
};
module.exports = {
  addEmployee,
  getEmployees,
 getEmployeesByDepartment,
 getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
  getActiveEmployeeCount,
  getNewHiresCount
};
