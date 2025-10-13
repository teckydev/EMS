const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

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
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  login
);

module.exports = router;
