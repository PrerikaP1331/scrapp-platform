// /server/seedTestPickups.js
// Script to seed test pickups for today's route testing

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

const seedTestPickups = async () => {
    try {
        console.log('\n=== Starting Test Pickups Seeding ===\n');

        // Get all recycler users and profiles
        const recyclerUsers = await User.find({ role: 'recycler' }).limit(5);
        const recyclerProfiles = await RecyclerProfile.find().limit(5);
        const individualUsers = await User.find({ role: 'individual' }).limit(15);

        if (recyclerUsers.length === 0) {
            console.log('❌ No recycler users found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        if (individualUsers.length === 0) {
            console.log('❌ No individual users found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        // Get first recycler for all test pickups
        const testRecycler = recyclerUsers[0];
        const testRecyclerProfile = recyclerProfiles[0];

        console.log(`Using Recycler: ${testRecycler.name} (${testRecycler.email})`);
        console.log(`Using RecyclerProfile: ${testRecyclerProfile.businessName}\n`);

        // Today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Realistic coordinates for Bangalore (spreading across the city)
        const bangaloreCoordinates = [
            { lat: 12.9352, lng: 77.6245, city: 'Whitefield', name: 'Tech Park Area' },
            { lat: 12.9698, lng: 77.7499, city: 'Koramangala', name: 'Business District' },
            { lat: 12.9716, lng: 77.5946, city: 'Downtown', name: 'Bangalore City Center' },
            { lat: 13.0827, lng: 80.2707, city: 'Marathahalli', name: 'Corporate Zone' },
            { lat: 12.8295, lng: 77.6458, city: 'Jayanagar', name: 'Residential Area' },
            { lat: 12.9749, lng: 77.7499, city: 'Indiranagar', name: 'Commercial Hub' },
            { lat: 13.1858, lng: 77.6245, city: 'Yelahanka', name: 'North Bangalore' },
            { lat: 12.9355, lng: 77.6245, city: 'Hebbal', name: 'Industrial Zone' }
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
            { line1: '222 Business Complex', line2: 'Zone B' }
        ];

        const notes = [
            'Please ring the doorbell twice. Item is in the garage.',
            'Gate will be open. Items are on the front porch.',
            'Call upon arrival. Boxes are stacked in the storage room.',
            'Use the side entrance. Items are near the rear gate.',
            'Knock loudly. Items are in the basement area.',
            'Please be careful. Fragile items mixed in.',
            'Items are ready and sorted by type. Thank you!',
            'Please call before arriving. Items need to be brought down.'
        ];

        const quantities = [
            '1-2 Small Bags',
            'A Medium Box',
            'Multiple Large Bags',
            'Bulky Items'
        ];

        // Create 8 test pickups for today, scheduled across 3 time slots
        const createdPickups = [];

        for (let i = 0; i < 8; i++) {
            const coords = bangaloreCoordinates[i];
            const timeSlot = timeSlots[i % 3];
            const userIndex = i % individualUsers.length;

            const pickup = await Pickup.create({
                user: individualUsers[userIndex]._id,
                recycler: testRecycler._id,
                recyclerProfile: testRecyclerProfile._id,
                status: i < 3 ? 'scheduled' : i < 6 ? 'upcoming' : 'in-transit',
                wasteTypes: wasteTypes[i],
                quantity: quantities[i % quantities.length],
                notes: notes[i],
                address: {
                    addressLine1: addresses[i].line1,
                    addressLine2: addresses[i].line2,
                    city: coords.city,
                    postalCode: `560${String(100 + i).padStart(3, '0')}`,
                    state: 'Karnataka',
                    coordinates: {
                        latitude: coords.lat,
                        longitude: coords.lng
                    }
                },
                scheduledDate: today,
                timeSlot: timeSlot,
                estimatedWeight: 10 + i * 3,
                createdAt: new Date(Date.now() - Math.random() * 86400000), // Random time in past 24h
                updatedAt: new Date()
            });

            createdPickups.push(pickup);
            console.log(`✓ Created Pickup ${i + 1}: ${coords.name} - ${timeSlot}`);
            console.log(`  Customer: ${individualUsers[userIndex].name}`);
            console.log(`  Waste Types: ${wasteTypes[i].join(', ')}`);
            console.log(`  Coordinates: [${coords.lat}, ${coords.lng}]\n`);
        }

        console.log('=== Test Pickups Created Successfully ===\n');
        console.log(`Total Pickups Created: ${createdPickups.length}`);
        console.log(`Recycler: ${testRecycler.name}`);
        console.log(`Date: ${today.toLocaleDateString()}`);
        console.log('\nYou can now test the routing feature at: http://localhost:3000/recycler/route\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        process.exit(1);
    }
};

seedTestPickups();
