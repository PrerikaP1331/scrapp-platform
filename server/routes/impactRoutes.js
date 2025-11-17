// /server/routes/impactRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserImpactStats,
  getMonthlyImpactStats,
} = require('../controllers/impactController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/impact/stats
// @desc    Get user's impact statistics
// @access  Private
router.get('/stats', authMiddleware, getUserImpactStats);

// @route   GET /api/impact/stats/monthly
// @desc    Get user's monthly impact statistics
// @access  Private
router.get('/stats/monthly', authMiddleware, getMonthlyImpactStats);

module.exports = router;
