const express = require('express');
const { body } = require('express-validator');
const { register, login, changePassword,getAdminProfile,updateAdminProfile } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const photoUpload = require('../middleware/photoUpload');

/**
 * @route POST /auth/register
 * @summary Register a new user
 * @param {string} name.body.required - User's name
 * @param {string} email.body.required - User's email
 * @param {string} password.body.required - Password (min 6 chars)
 * @returns {object} 201 - User registered
 * @returns {object} 400 - Validation error
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password 6+ chars')
  ],
  register
);

/**
 * @route POST /auth/login
 * @summary Login user
 * @param {string} email.body.required - User's email
 * @param {string} password.body.required - User's password
 * @returns {object} 200 - Login successful
 * @returns {object} 400 - Validation error
 * @returns {object} 401 - Invalid credentials
 */

// GET /api/auth/profile - Fetch Profile for Logged-in User (Admin/HR Dashboard)
router.get(
    '/profile', 
    protect, 
    // Allow Admins and HR to fetch their profile. (Employees use /api/employees/profile)
    authorizeRoles('admin', 'HR'), 
    getAdminProfile
);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  login
);
// PUT /api/auth/profile - Update Profile (NEW)
// NOTE: Use photoUpload.single('photo') if you are handling file upload (multipart/form-data)
router.put(
    '/profile', 
    protect, 
    authorizeRoles('admin', 'HR'), 
    photoUpload.single('photo'), // Middleware for photo file upload
    updateAdminProfile
);
// NEW: PUT /api/auth/change-password
router.put(
  '/change-password',
    protect, // Must be logged in
    changePassword
);


module.exports = router;
