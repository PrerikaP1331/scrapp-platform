// /server/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerCommunity,
  searchCommunities,
  getUserCommunities,
  requestJoinCommunity,
  getCommunityPosts,
  createCommunityPost,
  claimItem,
  addComment,
  likePost,
  getCommunityDashboard,
  schedulePickup,
  getCommunityMembers,
  approveMemberRequest,
  rejectMemberRequest,
  inviteResident,
  getDrives,
  createDrive,
  getDriveDetails,
  updateDrive,
  deleteDrive,
  getDriveStats,
} = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/communities/register
// @desc    Register a new community and admin account
// @access  Public
router.post('/register', registerCommunity);

// @route   GET /api/communities/search
// @desc    Search communities by name or postal code
// @access  Private
router.get('/search', authMiddleware, searchCommunities);

// @route   GET /api/communities/my-communities
// @desc    Get user's communities
// @access  Private
router.get('/my-communities', authMiddleware, getUserCommunities);

// @route   POST /api/communities/:communityId/join
// @desc    Request to join a community
// @access  Private
router.post('/:communityId/join', authMiddleware, requestJoinCommunity);

// @route   GET /api/communities/:communityId/posts
// @desc    Get community posts
// @access  Private
router.get('/:communityId/posts', authMiddleware, getCommunityPosts);

// @route   POST /api/communities/:communityId/posts
// @desc    Create a community post
// @access  Private
router.post('/:communityId/posts', authMiddleware, createCommunityPost);

// @route   POST /api/communities/posts/:postId/claim
// @desc    Claim a giveaway item
// @access  Private
router.post('/posts/:postId/claim', authMiddleware, claimItem);

// @route   POST /api/communities/posts/:postId/comment
// @desc    Add comment to a post
// @access  Private
router.post('/posts/:postId/comment', authMiddleware, addComment);

// @route   POST /api/communities/posts/:postId/like
// @desc    Like a post
// @access  Private
router.post('/posts/:postId/like', authMiddleware, likePost);

// @route   GET /api/community/:communityId/dashboard
// @desc    Get community admin dashboard data
// @access  Private
router.get('/:communityId/dashboard', authMiddleware, getCommunityDashboard);

// @route   POST /api/communities/:communityId/schedule-pickup
// @desc    Schedule a pickup for the community
// @access  Private
router.post('/:communityId/schedule-pickup', authMiddleware, schedulePickup);

// @route   GET /api/communities/:communityId/members
// @desc    Get community members and pending requests
// @access  Private
router.get('/:communityId/members', authMiddleware, getCommunityMembers);

// @route   POST /api/communities/:communityId/members/:userId/approve
// @desc    Approve a member request
// @access  Private
router.post('/:communityId/members/:userId/approve', authMiddleware, approveMemberRequest);

// @route   POST /api/communities/:communityId/members/:userId/reject
// @desc    Reject a member request
// @access  Private
router.post('/:communityId/members/:userId/reject', authMiddleware, rejectMemberRequest);

// @route   POST /api/communities/:communityId/invite
// @desc    Send email invitation to resident
// @access  Private
router.post('/:communityId/invite', authMiddleware, inviteResident);

// @route   GET /api/communities/:communityId/drives
// @desc    Get all drives for a community
// @access  Private
router.get('/:communityId/drives', authMiddleware, getDrives);

// @route   POST /api/communities/:communityId/drives
// @desc    Create a new drive
// @access  Private
router.post('/:communityId/drives', authMiddleware, createDrive);

// @route   GET /api/communities/:communityId/drives/:driveId
// @desc    Get a specific drive
// @access  Private
router.get('/:communityId/drives/:driveId', authMiddleware, getDriveDetails);

// @route   PUT /api/communities/:communityId/drives/:driveId
// @desc    Update a drive
// @access  Private
router.put('/:communityId/drives/:driveId', authMiddleware, updateDrive);

// @route   DELETE /api/communities/:communityId/drives/:driveId
// @desc    Delete a drive
// @access  Private
router.delete('/:communityId/drives/:driveId', authMiddleware, deleteDrive);

// @route   GET /api/communities/:communityId/drives/:driveId/stats
// @desc    Get drive statistics
// @access  Private
router.get('/:communityId/drives/:driveId/stats', authMiddleware, getDriveStats);

module.exports = router;