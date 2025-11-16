// /server/routes/pickupRoutes.js
const express = require('express');
const router = express.Router();
const { createPickup, getMyPickups } = require('../controllers/pickupController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/pickups
// @desc    Create a new pickup request
// @access  Private
router.post('/', authMiddleware, createPickup);

// @route   GET /api/pickups/my-pickups
// @desc    Get all pickups for the logged-in user
// @access  Private
router.get('/my-pickups', authMiddleware, getMyPickups); // <-- Add this new route

module.exports = router;