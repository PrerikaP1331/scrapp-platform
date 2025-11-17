// /server/controllers/userController.js
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const Coupon = require('../models/Coupon');

/**
 * Get user's transaction history with filtering, searching, and pagination
 * Query parameters:
 * - type: 'all', 'pickups', 'coupons'
 * - status: 'all', 'upcoming', 'completed', 'cancelled'
 * - search: search term
 * - page: page number (default 1)
 * - limit: items per page (default 10)
 */
exports.getUserHistory = async (req, res) => {
  try {
    const { type = 'all', status = 'all', search = '', page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let history = [];
    let total = 0;

    // Fetch Pickups
    if (type === 'all' || type === 'pickups') {
      let pickupQuery = { user: userId };

      // Filter by status
      if (status !== 'all') {
        if (status === 'upcoming') {
          pickupQuery.status = 'scheduled';
        } else if (status === 'completed') {
          pickupQuery.status = 'completed';
        } else if (status === 'cancelled') {
          pickupQuery.status = 'cancelled';
        }
      } else {
        // If status is 'all', exclude 'pending' status
        pickupQuery.status = { $in: ['scheduled', 'upcoming', 'in-transit', 'completed', 'cancelled'] };
      }

      let pickups = await Pickup.find(pickupQuery)
        .populate('recycler', 'name phone email')
        .populate('recyclerProfile', 'businessName rating')
        .sort({ scheduledDate: -1 });

      // Apply search filter
      if (search) {
        pickups = pickups.filter(pickup => {
          const recyclerName = pickup.recyclerProfile?.businessName || '';
          const wasteTypes = pickup.wasteTypes?.join(', ') || '';
          const searchLower = search.toLowerCase();
          return recyclerName.toLowerCase().includes(searchLower) || 
                 wasteTypes.toLowerCase().includes(searchLower);
        });
      }

      total += pickups.length;
      pickups = pickups.slice(skip, skip + limitNum);

      // Transform pickups to history format
      history = history.concat(
        pickups.map(pickup => ({
          id: pickup._id,
          type: 'pickup',
          icon: '🚛',
          title: pickup.recyclerProfile?.businessName || 'Pickup',
          date: pickup.scheduledDate,
          status: pickup.status,
          details: {
            wasteTypes: pickup.wasteTypes,
            quantity: pickup.quantity,
            recyclerName: pickup.recyclerProfile?.businessName,
            rating: pickup.recyclerProfile?.rating,
            address: pickup.address,
            notes: pickup.notes,
            timeSlot: pickup.timeSlot,
            createdAt: pickup.createdAt,
          },
        }))
      );
    }

    // Fetch Coupons
    if (type === 'all' || type === 'coupons') {
      let couponQuery = { user: userId };

      if (status !== 'all') {
        if (status === 'upcoming') {
          couponQuery.status = 'available';
        } else if (status === 'completed') {
          couponQuery.status = 'used';
        }
      }

      let coupons = await Coupon.find(couponQuery)
        .populate('pickup', 'wasteTypes recyclerProfile')
        .sort({ createdAt: -1 });

      // Apply search filter
      if (search) {
        coupons = coupons.filter(coupon => {
          const searchLower = search.toLowerCase();
          return coupon.code?.toLowerCase().includes(searchLower) ||
                 coupon.description?.toLowerCase().includes(searchLower);
        });
      }

      total += coupons.length;
      coupons = coupons.slice(skip, skip + limitNum);

      // Transform coupons to history format
      history = history.concat(
        coupons.map(coupon => ({
          id: coupon._id,
          type: 'coupon',
          icon: '🎟️',
          title: `${coupon.discountValue}% Off: ${coupon.description}`,
          date: coupon.createdAt,
          status: coupon.status,
          details: {
            code: coupon.code,
            discountValue: coupon.discountValue,
            description: coupon.description,
            expiryDate: coupon.expiryDate,
            usedAt: coupon.usedAt,
            usedOnPickupId: coupon.usedOnPickupId,
          },
        }))
      );
    }

    // Sort combined history by date
    if (type === 'all') {
      history.sort((a, b) => new Date(b.date) - new Date(a.date));
      history = history.slice(skip, skip + limitNum);
    }

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      history,
      pagination: {
        current: pageNum,
        total: totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get user profile details
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Update user profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Change user password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All password fields are required' });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'New passwords do not match' });
    }

    // Check minimum length
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Verify current password (simplified - in production use bcrypt)
    if (user.password !== currentPassword) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Update notification preferences
 */
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { notifications } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (notifications) {
      user.notifications = notifications;
    }

    await user.save();

    res.json({ msg: 'Notification preferences updated', notifications: user.notifications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
