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
        res.status(201).json({ 
          token,
          user: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            phone: adminUser.phone,
            communityId: newCommunity.id
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAdminCommunity = async (req, res) => {
  try {
    const community = await Community.findOne({ admin: req.user.id });
    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }
    res.json(community);
  } catch (err) {
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

    console.log('Searching communities with query:', q);

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

    console.log('Found communities:', communities.length);

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

    res.json({
      data: communitiesWithStatus,
      msg: `Found ${communitiesWithStatus.length} communities`
    });
  } catch (err) {
    console.error('Search error:', err.message);
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

    res.json({
      data: communities,
      msg: `Found ${communities.length} communities`
    });
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
      data: {
        posts,
        pages: Math.ceil(total / limitNum),
        totalItems: total,
        currentPage: pageNum
      }
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
    const community = await Community.findById(communityId)
      .populate('admin')
      .populate('members', 'name email')
      .populate('pendingRequests.user', 'name email');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to access this dashboard' });
    }

    // Get all pickups for this community to calculate real impact stats
    const Pickup = require('../models/Pickup');
    const communityPickups = await Pickup.find({
      community: communityId,
      status: 'completed'
    });

    // Calculate impact statistics from real data
    const totalWeight = communityPickups.reduce((sum, pickup) => sum + (pickup.estimatedWeight || 0), 0);
    // CO₂ calculation: roughly 3.67 kg CO₂ per kg of waste diverted
    const co2Saved = Math.round(totalWeight * 3.67);
    
    const impactStats = {
      co2Saved: co2Saved,
      wasteDiverted: totalWeight,
      pickupsCompleted: communityPickups.length
    };

    // Engagement metrics
    const members = community.members.length;
    const householdCount = parseInt(community.householdCount?.split('-')[1]) || community.memberCount || members;
    const pendingRequests = community.pendingRequests?.length || 0;
    
    // Calculate participation rate from completed pickups
    let participationRate = 0;
    if (members > 0) {
      const uniqueMembersWithPickups = new Set(communityPickups.map(p => p.user.toString())).size;
      participationRate = Math.round((uniqueMembersWithPickups / members) * 100);
    }

    const engagementStats = {
      activeResidents: members,
      totalHouseholds: householdCount,
      participationRate: participationRate,
      pendingRequests: pendingRequests
    };

    // Get upcoming events/drives (from CommunityPost with future dates)
    const upcomingEvents = await CommunityPost.find({
      community: communityId,
      type: 'drive',
      scheduledDate: { $gt: new Date() }
    })
      .sort({ scheduledDate: 1 })
      .limit(3)
      .select('title description scheduledDate');

    const formattedEvents = upcomingEvents.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description || 'Community drive',
      date: event.scheduledDate
    }));

    // Get recent activity (last 5 member approvals, joins, and completed drives)
    const recentApprovals = community.pendingRequests
      ?.slice(-5)
      .reverse()
      .map(req => ({
        id: req._id,
        action: `${req.user.name} request awaiting approval`,
        type: 'approval',
        timestamp: req.requestedAt
      })) || [];

    // Get recent completed drives
    const recentCompletedPickups = communityPickups
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 3)
      .map(pickup => ({
        id: pickup._id,
        action: `Community pickup completed - ${pickup.wasteTypes.join(', ')}`,
        type: 'drive_completed',
        timestamp: pickup.updatedAt
      }));

    // Combine and sort recent activity
    const recentActivity = [...recentApprovals, ...recentCompletedPickups]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

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
      upcomingEvents: formattedEvents,
      recentActivity
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Schedule a pickup for the community
 * POST /api/communities/:communityId/schedule-pickup
 */
exports.schedulePickup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;
    const {
      wasteTypes,
      quantity,
      scheduledDate,
      timeSlot,
      collectionPoint,
      notes,
      recyclerId,
      isRecurring,
      frequency,
      dayOfWeek,
      endDate
    } = req.body;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to schedule pickups' });
    }

    // Validate required fields
    if (!wasteTypes || wasteTypes.length === 0) {
      return res.status(400).json({ msg: 'wasteTypes are required' });
    }

    if (isRecurring) {
      if (!frequency || !dayOfWeek) {
        return res.status(400).json({ msg: 'frequency and dayOfWeek are required for recurring pickups' });
      }
      if (!timeSlot) {
        return res.status(400).json({ msg: 'timeSlot is required' });
      }
    } else {
      if (!scheduledDate || !timeSlot) {
        return res.status(400).json({ msg: 'scheduledDate and timeSlot are required for one-time pickups' });
      }
    }

    // Create a community pickup record
    const Pickup = require('../models/Pickup');
    const pickupData = {
      user: userId, // Community admin creating the pickup
      community: communityId,
      pickupType: 'community_bulk',
      wasteTypes,
      quantity: quantity || 'Multiple Large Bags',
      status: isRecurring ? 'scheduled' : 'pending',
      timeSlot,
      address: {
        addressLine1: community.address.addressLine1,
        addressLine2: community.address.addressLine2,
        city: community.address.city,
        postalCode: community.address.postalCode,
        state: community.address.state,
        coordinates: community.address.coordinates
      },
      notes: notes || `Community pickup at ${collectionPoint || 'designated location'}`
    };

    // Handle one-time vs recurring
    if (isRecurring) {
      pickupData.scheduledDate = getNextOccurrenceDate(dayOfWeek, timeSlot);
      pickupData.recurringSchedule = {
        isRecurring: true,
        frequency,
        dayOfWeek: parseInt(dayOfWeek),
        endDate: endDate ? new Date(endDate) : null
      };
    } else {
      pickupData.scheduledDate = new Date(scheduledDate);
    }

    // Assign recycler if provided
    if (recyclerId) {
      const User = require('../models/User');
      const recycler = await User.findById(recyclerId);
      if (recycler && recycler.role === 'recycler') {
        pickupData.recycler = recyclerId;
        pickupData.status = 'scheduled';
      }
    }

    const newPickup = new Pickup(pickupData);
    await newPickup.save();

    // If recurring, create additional instances for future occurrences (optional: create next 12 months)
    if (isRecurring) {
      const futurePickups = generateRecurringPickups(newPickup, frequency, dayOfWeek, endDate);
      if (futurePickups.length > 0) {
        await Pickup.insertMany(futurePickups);
      }
    }

    res.status(201).json({
      msg: 'Community pickup scheduled successfully',
      pickup: newPickup,
      isRecurring
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Helper: Calculate next occurrence date based on day of week
 */
function getNextOccurrenceDate(dayOfWeek, timeSlot) {
  const now = new Date();
  const targetDay = parseInt(dayOfWeek); // 0-6
  const currentDay = now.getDay();

  let daysAhead = targetDay - currentDay;
  if (daysAhead <= 0) {
    daysAhead += 7;
  }

  const result = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  result.setHours(9, 0, 0, 0); // Set to 9 AM by default
  return result;
}

/**
 * Helper: Generate recurring pickup instances for future dates
 */
function generateRecurringPickups(basePickup, frequency, dayOfWeek, endDate) {
  const pickups = [];
  const dayNum = parseInt(dayOfWeek);
  let currentDate = new Date(basePickup.scheduledDate);
  const maxEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year max

  // Generate recurring instances (up to 12 months or until endDate)
  const maxIterations = 52; // Max ~1 year of recurring pickups
  let iterations = 0;

  while (currentDate < maxEndDate && iterations < maxIterations) {
    let nextDate;

    if (frequency === 'weekly') {
      nextDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (frequency === 'bi-weekly') {
      nextDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else if (frequency === 'monthly') {
      nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    if (nextDate && nextDate <= maxEndDate) {
      const pickupCopy = {
        ...basePickup.toObject(),
        _id: undefined,
        scheduledDate: nextDate,
        recurringSchedule: basePickup.recurringSchedule
      };
      pickups.push(pickupCopy);
      currentDate = nextDate;
    }

    iterations++;
  }

  return pickups;
}

/**
 * Get community members
 * GET /api/communities/:communityId/members
 */
exports.getCommunityMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;

    const community = await Community.findById(communityId)
      .populate('admin')
      .populate('members', 'name email phone')
      .populate('pendingRequests.user', 'name email phone');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json({
      approvedMembers: community.members,
      pendingRequests: community.pendingRequests
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Approve a member request
 * POST /api/communities/:communityId/members/:userId/approve
 */
exports.approveMemberRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, userId: requestingUserId } = req.params;

    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Find and remove from pending requests
    const requestIndex = community.pendingRequests.findIndex(
      req => req.user.toString() === requestingUserId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    community.pendingRequests.splice(requestIndex, 1);

    // Add to members if not already there
    if (!community.members.includes(requestingUserId)) {
      community.members.push(requestingUserId);
    }

    await community.save();

    res.json({ msg: 'Member request approved' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Reject a member request
 * POST /api/communities/:communityId/members/:userId/reject
 */
exports.rejectMemberRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, userId: requestingUserId } = req.params;

    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Remove from pending requests
    community.pendingRequests = community.pendingRequests.filter(
      req => req.user.toString() !== requestingUserId
    );

    await community.save();

    res.json({ msg: 'Member request rejected' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Send invite to resident
 * POST /api/communities/:communityId/invite
 */
exports.inviteResident = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;
    const { email, message } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // In production, this would send an actual email
    // For now, just log it
    console.log(`Invitation sent to ${email} for community ${community.name}`);
    console.log(`Message: ${message || 'No personal message'}`);

    res.json({
      msg: 'Invitation sent successfully',
      invitedEmail: email,
      communityName: community.name
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get all drives for a community
 * GET /api/communities/:communityId/drives
 * Query: ?status=upcoming|completed|all
 */
exports.getDrives = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;
    const { status = 'all' } = req.query;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const Drive = require('../models/Drive');
    const filter = { community: communityId };

    if (status !== 'all') {
      filter.status = status;
    }

    const drives = await Drive.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: -1 });

    res.json(drives);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Create a new drive
 * POST /api/communities/:communityId/drives
 */
exports.createDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId } = req.params;
    const {
      title,
      description,
      coverPhoto,
      date,
      location,
      acceptedWasteTypes,
      visibility,
      notes
    } = req.body;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Validate required fields
    if (!title || !description || !date || !location?.venue || !acceptedWasteTypes || acceptedWasteTypes.length === 0) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const Drive = require('../models/Drive');
    const newDrive = new Drive({
      community: communityId,
      title,
      description,
      coverPhoto: coverPhoto || null,
      date: new Date(date),
      location: {
        venue: location.venue,
        address: location.address || {}
      },
      acceptedWasteTypes,
      visibility: visibility || 'private',
      organizer: userId,
      notes: notes || '',
      status: 'upcoming'
    });

    await newDrive.save();
    await newDrive.populate('organizer', 'name email');

    res.status(201).json({
      msg: 'Drive created successfully',
      drive: newDrive
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get a specific drive
 * GET /api/communities/:communityId/drives/:driveId
 */
exports.getDriveDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, driveId } = req.params;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const Drive = require('../models/Drive');
    const drive = await Drive.findById(driveId)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    if (drive.community.toString() !== communityId) {
      return res.status(403).json({ msg: 'Drive does not belong to this community' });
    }

    res.json(drive);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Update a drive
 * PUT /api/communities/:communityId/drives/:driveId
 */
exports.updateDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, driveId } = req.params;
    const updates = req.body;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const Drive = require('../models/Drive');
    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    if (drive.community.toString() !== communityId) {
      return res.status(403).json({ msg: 'Drive does not belong to this community' });
    }

    // Update only allowed fields
    const allowedFields = ['title', 'description', 'coverPhoto', 'date', 'location', 'acceptedWasteTypes', 'visibility', 'notes', 'status'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        drive[field] = updates[field];
      }
    });

    await drive.save();
    await drive.populate('organizer', 'name email');

    res.json({
      msg: 'Drive updated successfully',
      drive
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Delete a drive
 * DELETE /api/communities/:communityId/drives/:driveId
 */
exports.deleteDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, driveId } = req.params;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const Drive = require('../models/Drive');
    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    if (drive.community.toString() !== communityId) {
      return res.status(403).json({ msg: 'Drive does not belong to this community' });
    }

    await Drive.findByIdAndDelete(driveId);

    res.json({ msg: 'Drive deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get drive statistics
 * GET /api/communities/:communityId/drives/:driveId/stats
 */
exports.getDriveStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { communityId, driveId } = req.params;

    // Verify user is admin of this community
    const community = await Community.findById(communityId).populate('admin');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    if (community.admin.id.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const Drive = require('../models/Drive');
    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    if (drive.community.toString() !== communityId) {
      return res.status(403).json({ msg: 'Drive does not belong to this community' });
    }

    // If drive is not completed, calculate stats from pickups linked to this drive
    if (drive.status !== 'completed') {
      const Pickup = require('../models/Pickup');
      const pickups = await Pickup.find({ 
        community: communityId,
        status: 'completed',
        scheduledDate: {
          $gte: new Date(drive.date.getTime() - 24 * 60 * 60 * 1000), // 1 day before
          $lte: new Date(drive.date.getTime() + 24 * 60 * 60 * 1000)  // 1 day after
        }
      });

      // Calculate stats from pickups
      const totalWeight = pickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
      const co2Saved = Math.round(totalWeight * 3.67);
      const participatingHouseholds = new Set(pickups.map(p => p.user.toString())).size;

      // Build waste type breakdown
      const itemBreakdown = {};
      pickups.forEach(pickup => {
        pickup.wasteTypes.forEach(type => {
          if (!itemBreakdown[type]) {
            itemBreakdown[type] = { quantityKg: 0, count: 0 };
          }
          itemBreakdown[type].quantityKg += pickup.estimatedWeight || 0;
          itemBreakdown[type].count += 1;
        });
      });

      const itemBreakdownArray = Object.entries(itemBreakdown).map(([type, data]) => ({
        wasteType: type,
        quantityKg: data.quantityKg,
        count: data.count
      }));

      const mostCommonItem = itemBreakdownArray.length > 0
        ? itemBreakdownArray.reduce((a, b) => a.count > b.count ? a : b).wasteType
        : null;

      return res.json({
        driveId: drive._id,
        title: drive.title,
        date: drive.date,
        totalWeightCollected: totalWeight,
        participatingHouseholds,
        itemBreakdown: itemBreakdownArray,
        co2Saved,
        mostCommonItem,
        pickupCount: pickups.length
      });
    }

    // If completed, return stored stats
    res.json({
      driveId: drive._id,
      title: drive.title,
      date: drive.date,
      ...drive.stats,
      status: drive.status
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};