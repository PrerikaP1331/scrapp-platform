// Debug script to check communities in database
require('dotenv').config();
const connectDB = require('./config/db');
const Community = require('./models/Community');

async function checkCommunities() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const communities = await Community.find({});
    console.log(`Found ${communities.length} communities in database`);

    if (communities.length > 0) {
      console.log('\nFirst 5 communities:');
      communities.slice(0, 5).forEach(c => {
        console.log(`- ${c.name} (${c.type}), City: ${c.address?.city || 'N/A'}`);
      });
    } else {
      console.log('No communities found in database');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkCommunities();
