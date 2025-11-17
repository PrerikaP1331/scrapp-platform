// server/scripts/reportPickups.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Pickup = require('../models/Pickup');

async function main() {
  await mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true });

  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);

  const recyclers = await User.find({ role: 'recycler' });
  console.log(`Found ${recyclers.length} recyclers\n`);

  for (const r of recyclers) {
    const total = await Pickup.countDocuments({ recycler: r._id });
    const todays = await Pickup.countDocuments({ recycler: r._id, scheduledDate: { $gte: today, $lt: tomorrow } });
    console.log(`${r.email} (${r.name || r.email}): total=${total}, today=${todays}`);
  }

  // Also count pending pickups (no recycler)
  const pending = await Pickup.countDocuments({ status: 'pending' });
  console.log(`\nPending pickups (no recycler assigned): ${pending}`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
