// /server/routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser); // Add this new line

// @route   GET /api/auth/me
// @desc    Get logged in user's data
// @access  Private (requires token)
router.get('/me', authMiddleware, getMe); // Add middleware here

module.exports = router;