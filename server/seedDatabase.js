// /server/seedDatabase.js
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Community = require('./models/Community');
const RecyclerProfile = require('./models/RecyclerProfile');
const Organization = require('./models/Organisation');
const Pickup = require('./models/Pickup');
const Coupon = require('./models/Coupon');
const Announcement = require('./models/Announcement');
const CommunityPost = require('./models/CommunityPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected successfully'));

// Helper functions
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Community.deleteMany({});
        await RecyclerProfile.deleteMany({});
        await Organization.deleteMany({});
        await Pickup.deleteMany({});
        await Coupon.deleteMany({});
        await Announcement.deleteMany({});
        await CommunityPost.deleteMany({});

        console.log('Cleared existing data');

        // ==================== CREATE USERS ====================
        const hashedPassword = await hashPassword('password123');
        const users = [];

        // 10 Individual Users
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Individual User ${i}`,
                email: `individual${i}@example.com`,
                password: hashedPassword,
                phone: `+91${9000000000 + i}`,
                role: 'individual',
                address: {
                    street: `Street ${i}`,
                    city: 'Bangalore',
                    state: 'Karnataka',
                    postalCode: `560${String(i).padStart(3, '0')}`
                },
                notifications: {
                    pickupReminders: { email: true, push: false },
                    communityUpdates: { email: true, push: true },
                    rewardsPromos: { email: true, push: false }
                }
            });
            users.push(user);
            console.log(`✓ Created Individual User ${i}`);
        }

        // 10 Community Admin Users
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Community Admin ${i}`,
                email: `communityadmin${i}@example.com`,
                password: hashedPassword,
                phone: `+91${9100000000 + i}`,
                role: 'community_admin',
                address: {
                    street: `Admin Street ${i}`,
                    city: 'Bangalore',
                    state: 'Karnataka',
                    postalCode: `560${String(i + 10).padStart(3, '0')}`
                }
            });
            users.push(user);
            console.log(`✓ Created Community Admin User ${i}`);
        }

        // 10 Recycler Users
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Recycler ${i}`,
                email: `recycler${i}@example.com`,
                password: hashedPassword,
                phone: `+91${9200000000 + i}`,
                role: 'recycler',
                address: {
                    street: `Recycler Street ${i}`,
                    city: 'Bangalore',
                    state: 'Karnataka',
                    postalCode: `560${String(i + 20).padStart(3, '0')}`
                }
            });
            users.push(user);
            console.log(`✓ Created Recycler User ${i}`);
        }

        // 10 Organization Admin Users
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Organization Admin ${i}`,
                email: `orgjadmin${i}@example.com`,
                password: hashedPassword,
                phone: `+91${9300000000 + i}`,
                role: 'org_admin',
                address: {
                    street: `Org Street ${i}`,
                    city: 'Bangalore',
                    state: 'Karnataka',
                    postalCode: `560${String(i + 30).padStart(3, '0')}`
                }
            });
            users.push(user);
            console.log(`✓ Created Organization Admin User ${i}`);
        }

        console.log(`\n✓ Created ${users.length} users in total\n`);

        // ==================== CREATE COMMUNITIES ====================
        const communityAdminUsers = users.slice(10, 20);
        const communities = [];

        for (let i = 1; i <= 10; i++) {
            const community = await Community.create({
                admin: communityAdminUsers[i - 1]._id,
                name: `Green Community ${i}`,
                description: `A progressive community focused on sustainable waste management and recycling initiatives ${i}`,
                type: i % 4 === 0 ? 'Residential Society / RWA' : i % 4 === 1 ? 'Apartment Complex' : i % 4 === 2 ? 'Neighborhood Association' : 'Other',
                householdCount: i % 3 === 0 ? '101-250' : i % 3 === 1 ? '251-500' : '501+',
                address: {
                    addressLine1: `${i * 100} Main Street`,
                    addressLine2: `Phase ${i}`,
                    city: 'Bangalore',
                    postalCode: `560${String(i).padStart(3, '0')}`,
                    state: 'Karnataka',
                    coordinates: {
                        latitude: 12.9716 + i * 0.01,
                        longitude: 77.5946 + i * 0.01
                    }
                },
                members: [communityAdminUsers[i - 1]._id, users[i - 1]._id],
                memberCount: 2,
                rules: `All residents must segregate waste into wet and dry. Bulky waste must be pre-arranged. ${i}`,
                image: `https://example.com/community${i}.jpg`
            });
            communities.push(community);
            console.log(`✓ Created Community ${i}`);
        }

        console.log('\n✓ Created 10 communities\n');

        // ==================== CREATE RECYCLER PROFILES ====================
        const recyclerUsers = users.slice(20, 30);
        const recyclerProfiles = [];

        for (let i = 1; i <= 10; i++) {
            const profile = await RecyclerProfile.create({
                user: recyclerUsers[i - 1]._id,
                businessName: `EcoRecycle ${i}`,
                businessPhone: `+91${9200000000 + i}`,
                businessEmail: `ecorecycle${i}@example.com`,
                businessLogo: `https://example.com/logo${i}.png`,
                tagline: `Sustainable recycling solution ${i}`,
                description: `We are committed to making recycling easy and rewarding for everyone. We handle ${i % 2 === 0 ? 'all types of waste' : 'specific waste categories'}.`,
                businessAddress: {
                    addressLine1: `${i * 50} Industrial Area`,
                    addressLine2: `Zone ${i}`,
                    city: 'Bangalore',
                    postalCode: `560${String(i + 50).padStart(3, '0')}`,
                    state: 'Karnataka',
                    coordinates: {
                        latitude: 12.9716 + i * 0.02,
                        longitude: 77.5946 + i * 0.02
                    }
                },
                serviceAreas: [`Bangalore`, `Area ${i}`, `Zone ${i}`],
                acceptedWasteTypes: i % 2 === 0 
                    ? ['Plastic', 'Paper', 'Metal', 'Glass', 'E-Waste'] 
                    : ['Plastic', 'Paper', 'Cardboard', 'Organic'],
                clientTypes: ['individual', 'community', 'organization'],
                specialties: i % 3 === 0 ? ['E-Waste Specialist'] : i % 3 === 1 ? ['Fastest Pickup'] : ['Eco-Certified'],
                availability: {
                    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    timeSlots: [
                        { start: '09:00', end: '12:00' },
                        { start: '12:00', end: '15:00' },
                        { start: '15:00', end: '18:00' }
                    ]
                },
                rating: {
                    averageScore: 3.5 + (i * 0.1) % 1.5,
                    totalReviews: 5 + i * 2
                },
                maxPickupsPerDay: 15,
                currentPickupsToday: Math.floor(Math.random() * 10)
            });
            recyclerProfiles.push(profile);
            console.log(`✓ Created Recycler Profile ${i}`);
        }

        console.log('\n✓ Created 10 recycler profiles\n');

        // ==================== CREATE ORGANIZATIONS ====================
        const orgAdminUsers = users.slice(30, 40);
        const organizations = [];

        for (let i = 1; i <= 10; i++) {
            const org = await Organization.create({
                admin: orgAdminUsers[i - 1]._id,
                name: `Green ${['Corporate', 'Retail', 'School', 'Restaurant', 'Factory', 'NGO'][i % 6]} ${i}`,
                type: ['Corporate Office', 'Retail Store / Business', 'School / University', 'Restaurant / Hotel', 'Factory / Industrial Unit', 'Non-Profit / NGO'][i % 6],
                employeeCount: i % 3 === 0 ? '101-500' : i % 3 === 1 ? '501-1000' : '1000+',
                address: {
                    addressLine1: `${i * 200} Business Avenue`,
                    addressLine2: `Suite ${i}`,
                    city: 'Bangalore',
                    postalCode: `560${String(i + 100).padStart(3, '0')}`,
                    state: 'Karnataka'
                },
                members: [orgAdminUsers[i - 1]._id]
            });
            organizations.push(org);
            console.log(`✓ Created Organization ${i}`);
        }

        console.log('\n✓ Created 10 organizations\n');

        // ==================== CREATE PICKUPS ====================
        const individualUsers = users.slice(0, 10);
        const pickups = [];

        for (let i = 1; i <= 10; i++) {
            const scheduledDate = new Date();
            scheduledDate.setDate(scheduledDate.getDate() + (i % 7) + 1);

            const pickup = await Pickup.create({
                user: individualUsers[i - 1]._id,
                recycler: recyclerUsers[(i - 1) % 10]._id,
                recyclerProfile: recyclerProfiles[(i - 1) % 10]._id,
                community: communities[(i - 1) % 10]._id,
                status: ['pending', 'scheduled', 'upcoming', 'completed'][i % 4],
                wasteTypes: ['Plastic', 'Paper', 'Metal'],
                quantity: ['1-2 Small Bags', 'A Medium Box', 'Multiple Large Bags', 'Bulky Items'][i % 4],
                notes: `Please ring the doorbell twice. Item is in the ${['garage', 'terrace', 'front porch', 'backyard'][i % 4]}.`,
                address: {
                    addressLine1: `${i * 100} Main Street`,
                    addressLine2: `Apartment ${i}`,
                    city: 'Bangalore',
                    postalCode: `560${String(i).padStart(3, '0')}`,
                    state: 'Karnataka',
                    coordinates: {
                        latitude: 12.9716 + i * 0.01,
                        longitude: 77.5946 + i * 0.01
                    }
                },
                scheduledDate: scheduledDate,
                timeSlot: ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00'][i % 3],
                estimatedWeight: 10 + i * 2,
                ...(i % 2 === 0 && {
                    rating: {
                        score: 3 + (i % 3),
                        review: `Great service and professional behavior. ${i}`,
                        ratedAt: new Date()
                    }
                })
            });
            pickups.push(pickup);
            console.log(`✓ Created Pickup ${i}`);
        }

        console.log('\n✓ Created 10 pickups\n');

        // ==================== CREATE COUPONS ====================
        const coupons = [];

        for (let i = 1; i <= 10; i++) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30 + i * 5);

            const coupon = await Coupon.create({
                user: individualUsers[i - 1]._id,
                code: `RECYCLE${String(i).padStart(2, '0')}`,
                description: `Get ${i * 5}% off on your next pickup or eco-friendly products`,
                discountValue: i * 5,
                discountType: i % 2 === 0 ? 'percentage' : 'fixed',
                status: i % 3 === 0 ? 'used' : i % 3 === 1 ? 'expired' : 'available',
                expiryDate: expiryDate,
                ...(i % 3 === 0 && {
                    usedAt: new Date(),
                    usedOnPickupId: pickups[(i - 1) % 10]._id
                }),
                source: ['pickup', 'referral', 'achievement', 'promotion'][i % 4],
                sourcePickupId: pickups[(i - 1) % 10]._id
            });
            coupons.push(coupon);
            console.log(`✓ Created Coupon ${i}`);
        }

        console.log('\n✓ Created 10 coupons\n');

        // ==================== CREATE ANNOUNCEMENTS ====================
        const announcements = [];

        for (let i = 1; i <= 10; i++) {
            const announcement = await Announcement.create({
                recycler: recyclerProfiles[i - 1]._id,
                subject: `Important Update: ${['Service Expansion', 'New Service', 'Special Offer', 'Maintenance Notice'][i % 4]} #${i}`,
                message: `We are pleased to announce that ${['we are now serving more areas', 'we have added new waste categories', 'we have special discounts', 'we have scheduled maintenance'][i % 4]}. Please read the details carefully.`,
                recipientCount: 5 + i,
                recipients: [individualUsers[i % 10]._id, individualUsers[(i + 1) % 10]._id],
                status: i % 2 === 0 ? 'sent' : 'draft',
                sentAt: i % 2 === 0 ? new Date() : null
            });
            announcements.push(announcement);
            console.log(`✓ Created Announcement ${i}`);
        }

        console.log('\n✓ Created 10 announcements\n');

        // ==================== CREATE COMMUNITY POSTS ====================
        const communityPosts = [];

        for (let i = 1; i <= 10; i++) {
            const post = await CommunityPost.create({
                community: communities[i - 1]._id,
                author: individualUsers[i - 1]._id,
                type: ['giveaway', 'request', 'announcement', 'discussion'][i % 4],
                title: `${['Free Items Available', 'Needed for Community', 'Important Announcement', 'Discussion Topic'][i % 4]} ${i}`,
                description: `This is a detailed description of the post about community waste management, recycling initiatives, or items of interest. Post number ${i} contains important information.`,
                itemDetails: {
                    condition: ['Like New', 'Good', 'Fair', 'Used'][i % 4],
                    category: ['Electronics', 'Books', 'Furniture', 'Clothing', 'Kitchen Items'][i % 5],
                    images: [`https://example.com/item${i}-1.jpg`, `https://example.com/item${i}-2.jpg`]
                },
                status: ['active', 'claimed', 'completed', 'archived'][i % 4],
                ...(i % 2 === 0 && {
                    claimedBy: individualUsers[(i + 1) % 10]._id,
                    claimedAt: new Date()
                }),
                comments: [
                    {
                        author: individualUsers[(i + 1) % 10]._id,
                        text: `Great post! Is it still available?`,
                        createdAt: new Date()
                    },
                    {
                        author: individualUsers[(i + 2) % 10]._id,
                        text: `I'm interested. When can I pick it up?`,
                        createdAt: new Date()
                    }
                ],
                likes: [individualUsers[(i + 1) % 10]._id, individualUsers[(i + 2) % 10]._id],
                isPinned: i === 1
            });
            communityPosts.push(post);
            console.log(`✓ Created Community Post ${i}`);
        }

        console.log('\n✓ Created 10 community posts\n');

        console.log('\n');
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('\nSummary:');
        console.log(`  ✓ 40 Users created (10 individual, 10 community_admin, 10 recycler, 10 org_admin)`);
        console.log(`  ✓ 10 Communities created`);
        console.log(`  ✓ 10 Recycler Profiles created`);
        console.log(`  ✓ 10 Organizations created`);
        console.log(`  ✓ 10 Pickups created`);
        console.log(`  ✓ 10 Coupons created`);
        console.log(`  ✓ 10 Announcements created`);
        console.log(`  ✓ 10 Community Posts created`);
        console.log('\nTotal: 110 records created');
        console.log('═══════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
