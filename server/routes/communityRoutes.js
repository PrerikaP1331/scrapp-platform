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

module.exports = router;