// /server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUserHistory,
    getUserProfile,
    updateUserProfile,
    changePassword,
    updateNotificationPreferences
} = require('../controllers/userController');
const {
    getUserCoupons,
    redeemCoupon
} = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/user/history
// @desc    Get user's transaction history with filtering and pagination
// @access  Private
router.get('/history', authMiddleware, getUserHistory);

// @route   GET /api/user/profile
// @desc    Get user profile details
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

// @route   PUT /api/user/password
// @desc    Change user password
// @access  Private
router.put('/password', authMiddleware, changePassword);

// @route   PUT /api/user/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', authMiddleware, updateNotificationPreferences);

// @route   GET /api/user/coupons
// @desc    Get user's coupons with optional status filter
// @access  Private
router.get('/coupons', authMiddleware, getUserCoupons);

// @route   POST /api/user/coupons/:couponId/redeem
// @desc    Redeem a coupon
// @access  Private
router.post('/coupons/:couponId/redeem', authMiddleware, redeemCoupon);

module.exports = router;
