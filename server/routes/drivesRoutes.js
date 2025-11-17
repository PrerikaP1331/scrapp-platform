const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  getDriveStats,
  updateDriveStats,
} = require('../controllers/drivesController');

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(authMiddleware);

// Get all drives for a community
router.get('/', getDrives);

// Get single drive
router.get('/:driveId', getDriveById);

// Create new drive
router.post('/', createDrive);

// Update drive
router.put('/:driveId', updateDrive);

// Delete drive
router.delete('/:driveId', deleteDrive);

// Get drive statistics
router.get('/:driveId/stats', getDriveStats);

// Update drive statistics
router.put('/:driveId/stats', updateDriveStats);

module.exports = router;
