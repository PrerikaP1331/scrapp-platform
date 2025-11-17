// /server/routes/migrationRoutes.js
const express = require('express');
const router = express.Router();
const { migrateAddressFields, debugUserAddress } = require('../controllers/migrationController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/migration/address-fields
// @desc    Migrate user address fields - standardize all users
// @access  Public (should be restricted in production)
router.post('/address-fields', migrateAddressFields);

// @route   GET /api/migration/debug-address
// @desc    Debug current user's address
// @access  Private
router.get('/debug-address', authMiddleware, debugUserAddress);

module.exports = router;
