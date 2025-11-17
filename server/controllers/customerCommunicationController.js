// /server/controllers/customerCommunicationController.js
const RecyclerProfile = require('../models/RecyclerProfile');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const Announcement = require('../models/Announcement');

// Get list of unique customers for a recycler
exports.getCustomers = async (req, res) => {
  try {
    const { recyclerId } = req.params;

    // Verify recycler exists
    const recyclerProfile = await RecyclerProfile.findById(recyclerId);
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    // Get all completed pickups for this recycler
    const completedPickups = await Pickup.find({
      recyclerProfile: recyclerId,
      status: 'completed'
    })
      .populate('user', 'name email')
      .lean();

    // Extract unique customers
    const customerMap = new Map();

    for (const pickup of completedPickups) {
      if (pickup.user && pickup.user._id) {
        const userId = pickup.user._id.toString();
        if (!customerMap.has(userId)) {
          // Get full user details for additional info
          const fullUser = await User.findById(pickup.user._id);
          customerMap.set(userId, {
            _id: pickup.user._id,
            name: pickup.user.name,
            email: pickup.user.email,
            pickupCount: 0,
            lastPickupDate: null,
            customerType: 'individual'
          });
        }
        
        const customer = customerMap.get(userId);
        customer.pickupCount += 1;
        customer.lastPickupDate = pickup.updatedAt;
      }
    }

    // Get community/organization customers
    const communityPickups = await Pickup.find({
      recyclerProfile: recyclerId,
      status: 'completed',
      community: { $ne: null }
    })
      .populate('community', 'name')
      .lean();

    for (const pickup of communityPickups) {
      if (pickup.community && pickup.community._id) {
        const communityId = `community_${pickup.community._id.toString()}`;
        if (!customerMap.has(communityId)) {
          customerMap.set(communityId, {
            _id: pickup.community._id,
            name: pickup.community.name,
            email: '', // Communities may not have direct email
            pickupCount: 0,
            lastPickupDate: null,
            customerType: 'community'
          });
        }

        const customer = customerMap.get(communityId);
        customer.pickupCount += 1;
        customer.lastPickupDate = pickup.updatedAt;
      }
    }

    const orgPickups = await Pickup.find({
      recyclerProfile: recyclerId,
      status: 'completed',
      organization: { $ne: null }
    })
      .populate('organization', 'name')
      .lean();

    for (const pickup of orgPickups) {
      if (pickup.organization && pickup.organization._id) {
        const orgId = `org_${pickup.organization._id.toString()}`;
        if (!customerMap.has(orgId)) {
          customerMap.set(orgId, {
            _id: pickup.organization._id,
            name: pickup.organization.name,
            email: '',
            pickupCount: 0,
            lastPickupDate: null,
            customerType: 'organization'
          });
        }

        const customer = customerMap.get(orgId);
        customer.pickupCount += 1;
        customer.lastPickupDate = pickup.updatedAt;
      }
    }

    // Convert map to sorted array
    const customers = Array.from(customerMap.values())
      .sort((a, b) => new Date(b.lastPickupDate) - new Date(a.lastPickupDate));

    res.json({
      totalCustomers: customers.length,
      customers
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get sent announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { recyclerId } = req.params;

    const recyclerProfile = await RecyclerProfile.findById(recyclerId);
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    const announcements = await Announcement.find({
      recycler: recyclerId,
      status: 'sent'
    })
      .sort({ sentAt: -1 })
      .lean();

    res.json({
      total: announcements.length,
      announcements
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Create and send announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { recyclerId } = req.params;
    const { subject, message } = req.body;

    // Validate inputs
    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }

    // Verify recycler exists
    const recyclerProfile = await RecyclerProfile.findById(recyclerId);
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    // Get all unique customers (same logic as getCustomers)
    const completedPickups = await Pickup.find({
      recyclerProfile: recyclerId,
      status: 'completed'
    })
      .populate('user', '_id')
      .lean();

    // Extract unique user IDs
    const customerIds = [...new Set(
      completedPickups
        .filter(p => p.user && p.user._id)
        .map(p => p.user._id.toString())
    )];

    const recipientCount = customerIds.length;

    if (recipientCount === 0) {
      return res.status(400).json({ 
        msg: 'No customers to send announcement to. You need completed pickups first.' 
      });
    }

    // Create announcement
    const announcement = new Announcement({
      recycler: recyclerId,
      subject,
      message,
      recipients: customerIds,
      recipientCount,
      status: 'sent',
      sentAt: new Date()
    });

    await announcement.save();

    // TODO: In production, send notifications to all recipients
    // This could be implemented with email, push notifications, SMS, etc.

    res.status(201).json({
      success: true,
      message: `Announcement sent to ${recipientCount} customers`,
      announcement: {
        _id: announcement._id,
        subject: announcement.subject,
        recipientCount: announcement.recipientCount,
        sentAt: announcement.sentAt
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
