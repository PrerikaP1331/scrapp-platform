// /server/controllers/migrationController.js
const User = require('../models/User');

/**
 * Migration endpoint to fix and standardize user address fields
 * This ensures all users have properly formatted address objects
 */
exports.migrateAddressFields = async (req, res) => {
  try {
    const users = await User.find({});
    let updated = 0;

    for (let user of users) {
      let addressChanged = false;

      // Ensure address object exists
      if (!user.address) {
        user.address = {};
        addressChanged = true;
      }

      // Ensure all address fields exist
      if (!user.address.addressLine1) {
        user.address.addressLine1 = '';
        addressChanged = true;
      }
      if (!user.address.addressLine2) {
        user.address.addressLine2 = '';
        addressChanged = true;
      }
      if (!user.address.city) {
        user.address.city = '';
        addressChanged = true;
      }
      if (!user.address.state) {
        user.address.state = '';
        addressChanged = true;
      }
      if (!user.address.postalCode) {
        user.address.postalCode = '';
        addressChanged = true;
      }

      if (addressChanged) {
        await user.save();
        updated++;
      }
    }

    res.json({
      msg: `Migration completed. Updated ${updated} users with standardized address fields.`,
      totalUsers: users.length,
      updatedUsers: updated
    });
  } catch (err) {
    console.error('Migration error:', err.message);
    res.status(500).json({ msg: 'Migration failed', error: err.message });
  }
};

/**
 * Debug endpoint to check a specific user's address
 */
exports.debugUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      addressKeys: Object.keys(user.address || {}),
      hasAddressLine1: !!user.address?.addressLine1,
      hasAddressLine2: !!user.address?.addressLine2,
      hasCity: !!user.address?.city,
      hasState: !!user.address?.state,
      hasPostalCode: !!user.address?.postalCode
    });
  } catch (err) {
    console.error('Debug error:', err.message);
    res.status(500).json({ msg: 'Debug failed', error: err.message });
  }
};
