// /server/seedSchedulePickups.js
// Script to seed comprehensive pickup data for schedule testing
// Creates pickups across different dates, statuses, and customers

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

const seedSchedulePickups = async () => {
    try {
        console.log('\n=== Starting Schedule Pickup Data Seeding for All Recyclers ===\n');

        // Get all recyclers and profiles
        const recyclers = await User.find({ role: 'recycler' });
        const recyclerProfiles = await RecyclerProfile.find();
        const individualUsers = await User.find({ role: 'individual' }).limit(50);

        if (recyclers.length === 0) {
            console.log('❌ No recyclers found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        if (individualUsers.length === 0) {
            console.log('❌ No individual users found. Run main seedDatabase.js first.');
            process.exit(1);
        }

        console.log(`Found ${recyclers.length} recyclers and ${individualUsers.length} individual users\n`);

        // Realistic Bangalore coordinates
        const locations = [
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
            ['Metal', 'Glass', 'Paper'],
            ['Cardboard', 'Paper'],
            ['Aluminum', 'Metal']
        ];

        const quantities = ['1-2 Small Bags', 'A Medium Box', 'Multiple Large Bags', 'Bulky Items'];
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

        let totalCreated = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Process each recycler
        for (let recyclerIdx = 0; recyclerIdx < recyclers.length; recyclerIdx++) {
            const recycler = recyclers[recyclerIdx];
            const recyclerProfile = recyclerProfiles[recyclerIdx] || recyclerProfiles[0];
            
            console.log(`\n👤 Processing: ${recycler.name} (${recycler.email})`);
            console.log('═'.repeat(60));

            // Create pickups for different date ranges
            console.log('📅 Creating Completed Pickups (7-30 days ago)...');
            for (let daysAgo = 30; daysAgo >= 7; daysAgo--) {
                const scheduledDate = new Date(today);
                scheduledDate.setDate(today.getDate() - daysAgo);

                for (let i = 0; i < 2; i++) {
                    const pickup = await Pickup.create({
                        user: individualUsers[(totalCreated + i) % individualUsers.length]._id,
                        recycler: recycler._id,
                        recyclerProfile: recyclerProfile._id,
                        status: 'completed',
                        wasteTypes: wasteTypes[i % wasteTypes.length],
                        quantity: quantities[i % quantities.length],
                        notes: notes[i % notes.length],
                        address: {
                            addressLine1: addresses[i].line1,
                            addressLine2: addresses[i].line2,
                            city: locations[i % locations.length].city,
                            postalCode: `560${String(100 + i).padStart(3, '0')}`,
                            state: 'Karnataka',
                            coordinates: {
                                latitude: locations[i % locations.length].lat + (Math.random() * 0.01),
                                longitude: locations[i % locations.length].lng + (Math.random() * 0.01)
                            }
                        },
                        scheduledDate: scheduledDate,
                        timeSlot: timeSlots[i % timeSlots.length],
                        estimatedWeight: 15 + i * 5,
                        rating: {
                            score: 4 + Math.random(),
                            review: `Great service! Pickup was smooth and professional.`,
                            ratedAt: new Date(scheduledDate.getTime() + 3600000)
                        },
                        createdAt: scheduledDate,
                        updatedAt: new Date(scheduledDate.getTime() + 7200000)
                    });
                    totalCreated++;
                }
            }
            console.log('  ✓ 48 completed pickups created');

            console.log('📅 Creating Upcoming Pickups (2-6 days from now)...');
            for (let daysAhead = 2; daysAhead <= 6; daysAhead++) {
                const scheduledDate = new Date(today);
                scheduledDate.setDate(today.getDate() + daysAhead);

                for (let i = 0; i < 3; i++) {
                    const pickup = await Pickup.create({
                        user: individualUsers[(totalCreated + i) % individualUsers.length]._id,
                        recycler: recycler._id,
                        recyclerProfile: recyclerProfile._id,
                        status: daysAhead <= 3 ? 'upcoming' : 'scheduled',
                        wasteTypes: wasteTypes[(i + daysAhead) % wasteTypes.length],
                        quantity: quantities[i % quantities.length],
                        notes: notes[(i + daysAhead) % notes.length],
                        address: {
                            addressLine1: addresses[(i + daysAhead) % addresses.length].line1,
                            addressLine2: addresses[(i + daysAhead) % addresses.length].line2,
                            city: locations[(i + daysAhead) % locations.length].city,
                            postalCode: `560${String(150 + i).padStart(3, '0')}`,
                            state: 'Karnataka',
                            coordinates: {
                                latitude: locations[(i + daysAhead) % locations.length].lat + (Math.random() * 0.01),
                                longitude: locations[(i + daysAhead) % locations.length].lng + (Math.random() * 0.01)
                            }
                        },
                        scheduledDate: scheduledDate,
                        timeSlot: timeSlots[(i + daysAhead) % timeSlots.length],
                        estimatedWeight: 12 + i * 4,
                        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
                        updatedAt: new Date()
                    });
                    totalCreated++;
                }
            }
            console.log('  ✓ 15 upcoming/scheduled pickups created');

            console.log('📅 Creating Pending Pickups (no recycler assigned)...');
            for (let i = 0; i < 4; i++) {
                const scheduledDate = new Date(today);
                scheduledDate.setDate(today.getDate() + 7 + i);

                const pickup = await Pickup.create({
                    user: individualUsers[(totalCreated + i) % individualUsers.length]._id,
                    // Note: No recycler assigned yet for pending pickups
                    status: 'pending',
                    wasteTypes: wasteTypes[(i + 5) % wasteTypes.length],
                    quantity: quantities[i % quantities.length],
                    notes: 'Awaiting recycler assignment',
                    address: {
                        addressLine1: addresses[(i + 3) % addresses.length].line1,
                        addressLine2: addresses[(i + 3) % addresses.length].line2,
                        city: locations[(i + 2) % locations.length].city,
                        postalCode: `560${String(200 + i).padStart(3, '0')}`,
                        state: 'Karnataka',
                        coordinates: {
                            latitude: locations[(i + 2) % locations.length].lat + (Math.random() * 0.01),
                            longitude: locations[(i + 2) % locations.length].lng + (Math.random() * 0.01)
                        }
                    },
                    scheduledDate: scheduledDate,
                    timeSlot: timeSlots[i % timeSlots.length],
                    estimatedWeight: 10 + i * 3,
                    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
                    updatedAt: new Date()
                });
                totalCreated++;
            }
            console.log('  ✓ 4 pending pickups created');

            console.log('📅 Creating Cancelled Pickups (from past 14 days)...');
            for (let i = 0; i < 3; i++) {
                const scheduledDate = new Date(today);
                scheduledDate.setDate(today.getDate() - 7 - i);

                const pickup = await Pickup.create({
                    user: individualUsers[(totalCreated + i) % individualUsers.length]._id,
                    recycler: recycler._id,
                    recyclerProfile: recyclerProfile._id,
                    status: 'cancelled',
                    wasteTypes: wasteTypes[(i + 7) % wasteTypes.length],
                    quantity: quantities[i % quantities.length],
                    notes: 'Customer requested cancellation',
                    address: {
                        addressLine1: addresses[(i + 5) % addresses.length].line1,
                        addressLine2: addresses[(i + 5) % addresses.length].line2,
                        city: locations[(i + 4) % locations.length].city,
                        postalCode: `560${String(250 + i).padStart(3, '0')}`,
                        state: 'Karnataka',
                        coordinates: {
                            latitude: locations[(i + 4) % locations.length].lat + (Math.random() * 0.01),
                            longitude: locations[(i + 4) % locations.length].lng + (Math.random() * 0.01)
                        }
                    },
                    scheduledDate: scheduledDate,
                    timeSlot: timeSlots[i % timeSlots.length],
                    estimatedWeight: 8 + i * 2,
                    createdAt: scheduledDate,
                    updatedAt: new Date(scheduledDate.getTime() + 3600000)
                });
                totalCreated++;
            }
            console.log('  ✓ 3 cancelled pickups created');
        }

        console.log('\n' + '═'.repeat(60));
        console.log('=== Schedule Pickup Data Seeding Completed ===\n');
        console.log(`✓ Total Pickups Created: ${totalCreated}`);
        console.log(`✓ Pickups per Recycler: 70 (48 completed + 15 upcoming/scheduled + 4 pending + 3 cancelled)`);
        console.log(`✓ Total Recyclers Processed: ${recyclers.length}`);
        console.log(`\nRecyclers with data:`);
        recyclers.forEach((r, idx) => {
            console.log(`  ${idx + 1}. ${r.name} (${r.email})`);
        });
        console.log(`\nYou can now test the schedule features at:`);
        console.log(`http://localhost:3000/recycler/schedule\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedSchedulePickups();
