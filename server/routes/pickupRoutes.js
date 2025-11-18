// /server/routes/pickupRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createPickup, 
    getMyPickups,
    getAvailableRecyclers,
    getTimeSlots,
    updatePickupWithRecycler,
    getPickupDetails,
    ratePickup
} = require('../controllers/pickupController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/pickups
// @desc    Create a new pickup request
// @access  Private
router.post('/', authMiddleware, createPickup);

// @route   GET /api/pickups/my-pickups
// @desc    Get all pickups for the logged-in user
// @access  Private
router.get('/my-pickups', authMiddleware, getMyPickups);

// @route   POST /api/pickups/available-recyclers
// @desc    Get available recyclers for a specific date, time slot, and waste types
// @access  Private
router.post('/available-recyclers', authMiddleware, getAvailableRecyclers);

// @route   POST /api/pickups/time-slots
// @desc    Get available time slots for a specific date
// @access  Private
router.post('/time-slots', authMiddleware, getTimeSlots);

// @route   POST /api/pickups/assign-recycler
// @desc    Assign a recycler to a pickup request
// @access  Private
router.post('/assign-recycler', authMiddleware, updatePickupWithRecycler);

// @route   GET /api/pickups/:pickupId
// @desc    Get details of a specific pickup
// @access  Private
router.get('/:pickupId', authMiddleware, getPickupDetails);

// @route   POST /api/pickups/:pickupId/rate
// @desc    Rate a completed pickup
// @access  Private
router.post('/:pickupId/rate', authMiddleware, ratePickup);

module.exports = router;