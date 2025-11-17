// /server/controllers/couponController.js
const Coupon = require('../models/Coupon');

// Get user's coupons with filtering
exports.getUserCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = { user: userId };

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch coupons, sorted by creation date (newest first)
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Transform and filter expired coupons if needed
    const processedCoupons = coupons.map(coupon => {
      const isExpired = new Date(coupon.expiryDate) < new Date();
      return {
        ...coupon,
        status: isExpired ? 'expired' : coupon.status,
      };
    });

    res.json({
      data: processedCoupons,
      count: processedCoupons.length,
      msg: 'Coupons retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ msg: 'Error fetching coupons', error: error.message });
  }
};

// Redeem a coupon
exports.redeemCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }

    if (coupon.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to redeem this coupon' });
    }

    if (coupon.status !== 'available') {
      return res.status(400).json({ msg: `Coupon is already ${coupon.status}` });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ msg: 'Coupon has expired' });
    }

    // Mark as used
    coupon.status = 'used';
    coupon.usedAt = new Date();
    await coupon.save();

    res.json({
      data: coupon,
      msg: 'Coupon redeemed successfully'
    });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(500).json({ msg: 'Error redeeming coupon', error: error.message });
  }
};
