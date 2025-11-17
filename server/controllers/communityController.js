// /server/controllers/communityController.js
const User = require('../models/User');
const Community = require('../models/Community');
const CommunityPost = require('../models/CommunityPost');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCommunity = async (req, res) => {
  const {
    name, email, phone, password, // Admin details
    communityName, communityType, householdCount, // Community details
    addressLine1, addressLine2, city, postalCode, state // Community address
  } = req.body;

  try {
    // 1. Check if an admin with this email already exists
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    // 2. Create and save the new admin user
    adminUser = new User({
      name,
      email,
      phone,
      password,
      role: 'community_admin', // Assign the correct role
      // The admin's personal address can default to the community address
      address: { addressLine1, addressLine2, city, postalCode, state }
    });

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(password, salt);
    await adminUser.save();

    // 3. Create and save the new community, linking it to the admin
    const newCommunity = new Community({
      admin: adminUser.id, // Link to the newly created user
      name: communityName,
      type: communityType,
      householdCount,
      address: { addressLine1, addressLine2, city, postalCode, state }
    });

    await newCommunity.save();
    
    // 4. Create a JWT for the new admin user to log them in automatically
    const payload = {
      user: {
        id: adminUser.id,
        role: adminUser.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Return the token
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Search communities by name or postal code
 */
exports.searchCommunities = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user?.id;

    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    // Search by name or city or postal code
    const communities = await Community.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } },
        { 'address.postalCode': { $regex: q, $options: 'i' } },
      ],
    })
      .populate('admin', 'name email')
      .select('name description address type memberCount image');

    // Add membership status for each community
    const communitiesWithStatus = await Promise.all(
      communities.map(async (community) => {
        const isMember = userId ? community.members.includes(userId) : false;
        const hasPendingRequest = userId ? community.pendingRequests.some(
          (req) => req.user?.toString() === userId
        ) : false;

        return {
          ...community.toObject(),
          isMember,
          hasPendingRequest,
        };
      })
    );

    res.json(communitiesWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get user's communities
 */
exports.getUserCommunities = async (req, res) => {
  try {
    const userId = req.user.id;

    const communities = await Community.find({ members: userId })
      .populate('admin', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Request to join a community
 */
exports.requestJoinCommunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    // Check if already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ msg: 'Already a member' });
    }

    // Check if already has pending request
    const hasPendingRequest = community.pendingRequests.some(
      (req) => req.user?.toString() === userId
    );

    if (hasPendingRequest) {
      return res.status(400).json({ msg: 'Already have a pending request' });
    }

    // Add to pending requests
    community.pendingRequests.push({ user: userId });
    await community.save();

    res.json({ msg: 'Join request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get community posts
 */
exports.getCommunityPosts = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { type = 'all', page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { community: communityId };

    if (type !== 'all') {
      query.type = type;
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await CommunityPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        totalItems: total,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Create a community post
 */
exports.createCommunityPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;
    const { type, title, description, itemDetails } = req.body;

    // Check if user is a member
    const community = await Community.findById(communityId);

    if (!community || !community.members.includes(userId)) {
      return res.status(403).json({ msg: 'Not a member of this community' });
    }

    const newPost = new CommunityPost({
      community: communityId,
      author: userId,
      type,
      title,
      description,
      itemDetails,
    });

    const post = await newPost.save();
    const populatedPost = await post.populate('author', 'name email');

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Claim a giveaway item
 */
exports.claimItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.status !== 'active') {
      return res.status(400).json({ msg: 'Item is no longer available' });
    }

    post.status = 'claimed';
    post.claimedBy = userId;
    post.claimedAt = new Date();

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Add comment to a post
 */
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { text } = req.body;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.comments.push({
      author: userId,
      text,
    });

    await post.save();
    const updatedPost = await post.populate('comments.author', 'name email');

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Like a post
 */
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get community admin dashboard data
 * GET /api/community/:communityId/dashboard
 */
exports.getCommunityDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to access this dashboard' });
    }

    // Aggregate impact statistics
    const members = community.members.length;
    const householdCount = community.householdCount || members;
    const pendingRequests = community.pendingRequests?.length || 0;
    
    // Mock aggregated data (in production, this would come from Impact model)
    const impactStats = {
      co2Saved: Math.floor(Math.random() * 2000) + 500, // 500-2500 kg
      wasteDiverted: Math.floor(Math.random() * 3000) + 800, // 800-3800 kg
      pickupsCompleted: Math.floor(Math.random() * 400) + 100 // 100-500
    };

    // Engagement metrics
    const engagementStats = {
      activeResidents: members,
      totalHouseholds: householdCount,
      participationRate: Math.min(100, Math.floor((members / householdCount) * 100) + Math.floor(Math.random() * 20)),
      pendingRequests: pendingRequests
    };

    // Get upcoming events/drives (mock data - in production from Drive model)
    const upcomingEvents = [
      {
        id: '1',
        title: 'E-Waste Collection Drive',
        description: 'This Saturday, Nov 22 at the clubhouse',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        type: 'drive'
      },
      {
        id: '2',
        title: 'Community Bulk Pickup',
        description: 'Scheduled for next Friday, Nov 28',
        date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        type: 'pickup'
      },
      {
        id: '3',
        title: 'Paper & Cardboard Drive',
        description: 'December 5 at community center',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        type: 'drive'
      }
    ];

    // Get recent activity log (mock data - in production from Activity model)
    const recentActivity = [
      {
        id: '1',
        action: 'Rohan K. request approved',
        type: 'approval',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        action: 'Priya S. joined the community',
        type: 'member_joined',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        id: '3',
        action: 'Paper & Cardboard drive completed',
        type: 'drive_completed',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        action: 'New bulk pickup scheduled',
        type: 'pickup_scheduled',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    res.json({
      community: {
        id: community._id,
        name: community.name,
        type: community.type,
        address: community.address
      },
      admin: {
        name: community.admin.name,
        email: community.admin.email
      },
      impactStats,
      engagementStats,
      upcomingEvents,
      recentActivity
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};