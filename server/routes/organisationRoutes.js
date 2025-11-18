// /server/routes/organisationRoutes.js
const express = require('express');
const router = express.Router();
const { registerOrganisation } = require('../controllers/organisationController');

// @route   POST /api/organisations/register
// @desc    Register a new organisation and its admin user
// @access  Public
router.post('/register', registerOrganisation);

module.exports = router;
