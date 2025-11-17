// server/seedTodayPickupsForAllRecyclers.js
// Creates N pickups for each recycler scheduled for TODAY

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const RecyclerProfile = require('./models/RecyclerProfile');
const Pickup = require('./models/Pickup');

const N_PER_RECYCLER = parseInt(process.argv[2], 10) || 3; // default 3 pickups each

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected successfully'));

const locations = [
  { lat: 12.9352, lng: 77.6245, city: 'Whitefield' },
  { lat: 12.9698, lng: 77.7499, city: 'Koramangala' },
  { lat: 12.9716, lng: 77.5946, city: 'Downtown' },
  { lat: 13.0827, lng: 80.2707, city: 'Marathahalli' },
  { lat: 12.8295, lng: 77.6458, city: 'Jayanagar' },
  { lat: 12.9749, lng: 77.7499, city: 'Indiranagar' },
  { lat: 13.1858, lng: 77.6245, city: 'Yelahanka' },
  { lat: 12.9355, lng: 77.6245, city: 'Hebbal' }
];

const wasteSets = [
  ['Plastic','Paper'], ['Metal','Glass'], ['Plastic','Metal'], ['Glass','Paper']
];

const timeSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00'];

async function main(){
  const recyclers = await User.find({ role: 'recycler' });
  const recyclerProfiles = await RecyclerProfile.find();
  const individuals = await User.find({ role: 'individual' });

  if (recyclers.length === 0) {
    console.error('No recyclers found. Run seedDatabase first.');
    process.exit(1);
  }
  if (individuals.length === 0) {
    console.error('No individual users found. Run seedDatabase first.');
    process.exit(1);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  let created = 0;

  for (let rIdx = 0; rIdx < recyclers.length; rIdx++){
    const recycler = recyclers[rIdx];
    const profile = recyclerProfiles[rIdx] || recyclerProfiles[0];

    for (let i = 0; i < N_PER_RECYCLER; i++){
      const loc = locations[(rIdx * N_PER_RECYCLER + i) % locations.length];
      const user = individuals[(rIdx * N_PER_RECYCLER + i) % individuals.length];

      await Pickup.create({
        user: user._id,
        recycler: recycler._id,
        recyclerProfile: profile ? profile._id : undefined,
        status: 'scheduled',
        wasteTypes: wasteSets[i % wasteSets.length],
        quantity: 'A Medium Box',
        notes: 'Test pickup for today',
        address: {
          addressLine1: `Test Address ${created+1}`,
          addressLine2: '',
          city: loc.city,
          postalCode: `560${String(300 + created).padStart(3,'0')}`,
          state: 'Karnataka',
          coordinates: { latitude: loc.lat + Math.random()*0.002, longitude: loc.lng + Math.random()*0.002 }
        },
        scheduledDate: today,
        timeSlot: timeSlots[i % timeSlots.length],
        estimatedWeight: 12 + (i%3)*2,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      created++;
    }
    console.log(`Added ${N_PER_RECYCLER} pickups for ${recycler.email}`);
  }

  console.log(`\nDone. Total pickups created: ${created}`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
