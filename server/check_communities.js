// Debug script to check communities in database
require('dotenv').config();
const connectDB = require('./config/db');
const Community = require('./models/Community');

async function checkCommunities() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const count = await Community.countDocuments();
    console.log(`Total communities in database: ${count}`);

    if (count > 0) {
      const communities = await Community.find().limit(5).select('name address type');
      console.log('\nFirst 5 communities:');
      communities.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name} - ${c.address?.city || 'No city'}`);
      });
    } else {
      console.log('No communities found in database');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkCommunities();
