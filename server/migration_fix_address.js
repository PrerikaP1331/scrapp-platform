// Migration script to fix existing user addresses
// Run this with: node server/migration_fix_address.js

require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

async function fixAddresses() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let updatedCount = 0;

    for (let user of users) {
      let hadChanges = false;
      
      // Ensure address exists
      if (!user.address) {
        user.address = {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: ''
        };
        hadChanges = true;
      } else {
        // Ensure all fields exist
        if (!user.address.addressLine1) {
          user.address.addressLine1 = '';
          hadChanges = true;
        }
        if (!user.address.addressLine2) {
          user.address.addressLine2 = '';
          hadChanges = true;
        }
        if (!user.address.city) {
          user.address.city = '';
          hadChanges = true;
        }
        if (!user.address.state) {
          user.address.state = '';
          hadChanges = true;
        }
        if (!user.address.postalCode) {
          user.address.postalCode = '';
          hadChanges = true;
        }
      }

      if (hadChanges) {
        user.markModified('address');
        await user.save();
        updatedCount++;
        console.log(`✓ Updated user: ${user.name} (${user.email})`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

fixAddresses();
