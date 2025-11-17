// /server/routes/recyclerRoutes.js
const express = require('express');
const router = express.Router();
const { 
    registerRecycler,
    getRecyclerProfile,
    getRecyclerById,
    updateAvailability,
    getAssignedPickups,
    getRecyclerStats,
    getProfileForEdit,
    updateProfileForEdit
} = require('../controllers/recyclerController');
const {
    getAvailableRecyclers,
    getRecyclerDetails,
    checkRecyclerCapacity
} = require('../controllers/recyclerFilterController');
const { getAnalytics } = require('../controllers/recyclerAnalyticsController');
const { getCustomers, getAnnouncements, createAnnouncement } = require('../controllers/customerCommunicationController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/recyclers/register
// @desc    Register a new recycler user and their business profile
// @access  Public
router.post('/register', registerRecycler);

// @route   GET /api/recyclers/search
// @desc    Get available recyclers with filtering (capacity, waste types, location, etc)
// @access  Private
// @query   capacity=bulk, wasteTypes=paper,plastic, clientType=community, city=Bangalore, specialty=E-Waste, rating=4
router.get('/search', authMiddleware, getAvailableRecyclers);

// @route   GET /api/recyclers/profile
// @desc    Get logged-in recycler's profile
// @access  Private
router.get('/profile', authMiddleware, getRecyclerProfile);

// @route   GET /api/recyclers/:recyclerId
// @desc    Get recycler details by ID (for customer viewing)
// @access  Public
router.get('/:recyclerId', getRecyclerById);

// @route   POST /api/recyclers/:recyclerId/check-capacity
// @desc    Check if recycler can handle specific waste and quantity
// @access  Private
router.post('/:recyclerId/check-capacity', authMiddleware, checkRecyclerCapacity);

// @route   PUT /api/recyclers/availability
// @desc    Update recycler availability
// @access  Private
router.put('/availability', authMiddleware, updateAvailability);

// @route   GET /api/recyclers/pickups/assigned
// @desc    Get recycler's assigned pickups
// @access  Private
router.get('/pickups/assigned', authMiddleware, getAssignedPickups);

// @route   GET /api/recyclers/stats
// @desc    Get recycler statistics
// @access  Private
router.get('/stats', authMiddleware, getRecyclerStats);

// @route   GET /api/recyclers/:recyclerId/analytics
// @desc    Get detailed analytics for a recycler with date range filtering
// @access  Private
router.get('/:recyclerId/analytics', authMiddleware, getAnalytics);

// @route   GET /api/recyclers/:recyclerId/customers
// @desc    Get list of all unique customers for a recycler
// @access  Private
router.get('/:recyclerId/customers', authMiddleware, getCustomers);

// @route   GET /api/recyclers/:recyclerId/announcements
// @desc    Get all sent announcements by a recycler
// @access  Private
router.get('/:recyclerId/announcements', authMiddleware, getAnnouncements);

// @route   POST /api/recyclers/:recyclerId/announcements
// @desc    Create and send a new announcement to all customers
// @access  Private
router.post('/:recyclerId/announcements', authMiddleware, createAnnouncement);

// @route   GET /api/recyclers/:recyclerId/profile/edit
// @desc    Get recycler profile for editing (with all editable fields)
// @access  Private
router.get('/:recyclerId/profile/edit', authMiddleware, getProfileForEdit);

// @route   PUT /api/recyclers/:recyclerId/profile/edit
// @desc    Update recycler profile (business info, description, service details)
// @access  Private
router.put('/:recyclerId/profile/edit', authMiddleware, updateProfileForEdit);

module.exports = router;