const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register Admin
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Admin
const login = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
    const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
    const token = generateToken(user);
        res.json({ 
            message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Allows authenticated user to change their password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.id; // Get user ID securely from the JWT

        // 1. Basic Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: 'All password fields are required.' });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match.' });
        }
        // Optional: Add complexity checks (min length, special characters)

        // 2. Retrieve User (including the stored password hash)
        // Note: The '+password' selector is crucial to retrieve the hash
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 3. Verify Current Password (Authentication Step)
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }
        
        // 4. Update and Hash the New Password
        // The User model's pre('save') hook handles the hashing automatically.
        user.password = newPassword; 
        await user.save(); 

        // 5. Update Employee Record (Optional but recommended for consistency)
        // Since the Employee model also stores the password hash, update it here too.
        await Employee.findOneAndUpdate(
            { user: userId },
            { password: newPassword } // Mongoose hooks on the Employee model will hash this field
        );

        // 6. Success Response
        res.status(200).json({ message: 'Password changed successfully. Please re-login.' });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: 'Server error during password update.', error: error.message });
    }
};
module.exports = {
  register,
  login,
  changePassword
};


