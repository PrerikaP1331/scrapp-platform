// /server/seedAllRecyclerPickups.js
// Script to seed test pickups for all recyclers for today's route testing

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const RecyclerProfile = require('./models/RecyclerProfile');
const Pickup = require('./models/Pickup');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected successfully'));

const seedAllRecyclerPickups = async () => {
    try {
        console.log('\n=== Starting Pickups Seeding for All Recyclers ===\n');

        // Get all recycler users and profiles
        const recyclerUsers = await User.find({ role: 'recycler' });
        const recyclerProfiles = await RecyclerProfile.find();
        const individualUsers = await User.find({ role: 'individual' });

        if (recyclerUsers.length === 0) {
            console.log('❌ No recycler users found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        if (individualUsers.length === 0) {
            console.log('❌ No individual users found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        console.log(`Found ${recyclerUsers.length} recyclers and ${individualUsers.length} individual users\n`);

        // Realistic coordinates for Bangalore (spreading across the city)
        const bangaloreCoordinates = [
            { lat: 12.9352, lng: 77.6245, city: 'Whitefield', name: 'Tech Park Area' },
            { lat: 12.9698, lng: 77.7499, city: 'Koramangala', name: 'Business District' },
            { lat: 12.9716, lng: 77.5946, city: 'Downtown', name: 'Bangalore City Center' },
            { lat: 13.0827, lng: 80.2707, city: 'Marathahalli', name: 'Corporate Zone' },
            { lat: 12.8295, lng: 77.6458, city: 'Jayanagar', name: 'Residential Area' },
            { lat: 12.9749, lng: 77.7499, city: 'Indiranagar', name: 'Commercial Hub' },
            { lat: 13.1858, lng: 77.6245, city: 'Yelahanka', name: 'North Bangalore' },
            { lat: 12.9355, lng: 77.6245, city: 'Hebbal', name: 'Industrial Zone' },
            { lat: 12.8612, lng: 77.5945, city: 'Basavanagudi', name: 'South Bangalore' },
            { lat: 13.1939, lng: 77.5941, city: 'Yeshwanthpur', name: 'West Bangalore' }
        ];

        const timeSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00'];
        const wasteTypes = [
            ['Plastic', 'Paper'],
            ['Metal', 'Glass'],
            ['Plastic', 'Metal', 'Paper'],
            ['Glass', 'Paper'],
            ['Plastic', 'Glass'],
            ['Metal', 'Paper'],
            ['Plastic', 'Paper', 'Glass'],
            ['Metal', 'Glass', 'Paper']
        ];

        const addresses = [
            { line1: '123 Tech Park Avenue', line2: 'Building A' },
            { line1: '456 Business Street', line2: 'Suite 500' },
            { line1: '789 Commerce Road', line2: 'Tower 1' },
            { line1: '321 Industrial Lane', line2: 'Unit 10' },
            { line1: '654 Residential Heights', line2: 'Apt 501' },
            { line1: '987 Corporate Drive', line2: 'Block C' },
            { line1: '111 Commerce Park', line2: 'Office 202' },
            { line1: '222 Business Complex', line2: 'Zone B' },
            { line1: '333 Retail Mall', line2: 'Store 101' },
            { line1: '444 Factory Complex', line2: 'Warehouse 5' }
        ];

        const notes = [
            'Please ring the doorbell twice. Item is in the garage.',
            'Gate will be open. Items are on the front porch.',
            'Call upon arrival. Boxes are stacked in the storage room.',
            'Use the side entrance. Items are near the rear gate.',
            'Knock loudly. Items are in the basement area.',
            'Please be careful. Fragile items mixed in.',
            'Items are ready and sorted by type. Thank you!',
            'Please call before arriving. Items need to be brought down.',
            'Building locked. Ring buzzer at main entrance.',
            'Delivery at loading dock. Use service entrance.'
        ];

        const quantities = [
            '1-2 Small Bags',
            'A Medium Box',
            'Multiple Large Bags',
            'Bulky Items'
        ];

        const statuses = ['scheduled', 'upcoming', 'in-transit', 'completed'];
        let totalPickupsCreated = 0;

        // Today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create pickups for each recycler
        for (let recyclerIdx = 0; recyclerIdx < recyclerUsers.length; recyclerIdx++) {
            const recycler = recyclerUsers[recyclerIdx];
            const recyclerProfile = recyclerProfiles[recyclerIdx] || recyclerProfiles[0];
            
            console.log(`\n📍 Creating pickups for: ${recycler.name} (${recycler.email})`);
            
            // Create 5-8 pickups per recycler
            const pickupsPerRecycler = 5 + Math.floor(Math.random() * 4);
            
            for (let pickupIdx = 0; pickupIdx < pickupsPerRecycler; pickupIdx++) {
                const coords = bangaloreCoordinates[pickupIdx % bangaloreCoordinates.length];
                const timeSlot = timeSlots[pickupIdx % 3];
                const userIndex = (recyclerIdx * pickupsPerRecycler + pickupIdx) % individualUsers.length;
                const status = statuses[pickupIdx % 4];

                const pickup = await Pickup.create({
                    user: individualUsers[userIndex]._id,
                    recycler: recycler._id,
                    recyclerProfile: recyclerProfile._id,
                    status: status,
                    wasteTypes: wasteTypes[pickupIdx % wasteTypes.length],
                    quantity: quantities[pickupIdx % quantities.length],
                    notes: notes[pickupIdx % notes.length],
                    address: {
                        addressLine1: addresses[pickupIdx].line1,
                        addressLine2: addresses[pickupIdx].line2,
                        city: coords.city,
                        postalCode: `560${String(100 + pickupIdx).padStart(3, '0')}`,
                        state: 'Karnataka',
                        coordinates: {
                            latitude: coords.lat + (Math.random() * 0.01),
                            longitude: coords.lng + (Math.random() * 0.01)
                        }
                    },
                    scheduledDate: today,
                    timeSlot: timeSlot,
                    estimatedWeight: 10 + pickupIdx * 3,
                    createdAt: new Date(Date.now() - Math.random() * 86400000),
                    updatedAt: new Date()
                });

                totalPickupsCreated++;
                console.log(`  ✓ Pickup ${pickupIdx + 1}: ${coords.name} [${status}]`);
            }
        }

        console.log('\n=== Pickups Seeding Completed Successfully ===\n');
        console.log(`Total Pickups Created: ${totalPickupsCreated}`);
        console.log(`Total Recyclers: ${recyclerUsers.length}`);
        console.log(`Average Pickups per Recycler: ${(totalPickupsCreated / recyclerUsers.length).toFixed(1)}`);
        console.log(`\nYou can now test the routing feature for any recycler at:`);
        console.log(`http://localhost:3000/recycler/route\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        process.exit(1);
    }
};

seedAllRecyclerPickups();
