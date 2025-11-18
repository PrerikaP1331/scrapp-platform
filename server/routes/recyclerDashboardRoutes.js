// /server/routes/recyclerDashboardRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDashboard,
  acceptPickup,
  declinePickup,
  getTodayRoute,
  updatePickupStatus,
  getPickupsFiltered,
  seedTodayPickups
} = require('../controllers/recyclerDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/recycler/dashboard
// @desc    Get recycler dashboard summary with KPIs and pending requests
// @access  Private
router.get('/dashboard', authMiddleware, getDashboard);

// @route   GET /api/recycler/pickups
// @desc    Get filtered pickups with search, status, and date range filters
// @access  Private
router.get('/pickups', authMiddleware, getPickupsFiltered);

// @route   GET /api/recycler/route/today
// @desc    Get today's optimized route with all accepted pickups
// @access  Private
router.get('/route/today', authMiddleware, getTodayRoute);

// @route   POST /api/recycler/pickup/:pickupId/accept
// @desc    Accept a pending pickup request
// @access  Private
router.post('/pickup/:pickupId/accept', authMiddleware, acceptPickup);

// @route   POST /api/recycler/pickup/:pickupId/decline
// @desc    Decline a pending pickup request
// @access  Private
router.post('/pickup/:pickupId/decline', authMiddleware, declinePickup);

// @route   PUT /api/recycler/pickup/:pickupId/status
// @desc    Update pickup status (scheduled, upcoming, in-transit, completed)
// @access  Private
router.put('/pickup/:pickupId/status', authMiddleware, updatePickupStatus);

router.post('/seed/today', authMiddleware, seedTodayPickups);

module.exports = router;
