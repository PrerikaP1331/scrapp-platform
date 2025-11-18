const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const RecyclerProfile = require('./models/RecyclerProfile');
const Pickup = require('./models/Pickup');

async function seedTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scrapp');
    console.log('Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: { $regex: 'test' } });
    await RecyclerProfile.deleteMany({});
    await Pickup.deleteMany({});
    console.log('Cleared existing test data');

    // Create test recycler user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const recyclerUser = await User.create({
      name: 'Test Recycler',
      email: 'testrecycler@scrapp.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'recycler',
      address: {
        addressLine1: '123 Recycle Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        coordinates: { latitude: 12.9716, longitude: 77.5946 }
      }
    });
    console.log('Created recycler user:', recyclerUser._id);

    // Create recycler profile
    const recyclerProfile = await RecyclerProfile.create({
      user: recyclerUser._id,
      businessName: 'GreenCycle Recycling',
      businessPhone: '9876543210',
      businessEmail: 'contact@greencycle.com',
      businessLogo: 'https://via.placeholder.com/150',
      tagline: 'Sustainable Waste Management Solutions',
      description: 'We specialize in eco-friendly recycling with 10+ years of experience. We accept all types of waste including e-waste, plastics, metals, and organic materials. Our mission is to make recycling accessible and rewarding for everyone.',
      businessAddress: {
        addressLine1: '123 Recycle Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        coordinates: { latitude: 12.9716, longitude: 77.5946 }
      },
      serviceAreas: ['Bangalore', 'Whitefield', 'Koramangala', 'Indiranagar'],
      acceptedWasteTypes: ['E-Waste', 'Plastic', 'Paper', 'Metal', 'Organic', 'Glass'],
      clientTypes: ['individual', 'community', 'organization'],
      specialties: ['E-Waste Specialist', 'Quick Pickup', 'Eco-Certified'],
      availability: {
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '18:00' }
        ]
      },
      rating: {
        averageScore: 4.5,
        totalReviews: 23
      },
      maxPickupsPerDay: 15,
      currentPickupsToday: 0
    });
    console.log('Created recycler profile:', recyclerProfile._id);

    // Create test individual user as customer
    const customerUser = await User.create({
      name: 'Test Customer',
      email: 'testcustomer@scrapp.com',
      password: hashedPassword,
      phone: '9123456789',
      role: 'individual',
      address: {
        addressLine1: '456 Customer Lane',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560002',
        coordinates: { latitude: 12.9750, longitude: 77.6245 }
      }
    });
    console.log('Created customer user:', customerUser._id);

    // Create test pickups
    const pickups = [];
    const quantities = ['1-2 Small Bags', 'A Medium Box', 'Multiple Large Bags', 'Bulky Items'];
    
    for (let i = 0; i < 25; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const materials = ['E-Waste', 'Plastic', 'Paper', 'Metal', 'Organic', 'Glass'];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const quantity = quantities[Math.floor(Math.random() * quantities.length)];
      const estimatedWeight = Math.floor(Math.random() * 50) + 5; // 5-55 kg

      pickups.push({
        user: customerUser._id,
        recycler: recyclerProfile._id,
        recyclerProfile: recyclerProfile._id,
        status: 'completed',
        wasteTypes: [material],
        quantity: quantity,
        estimatedWeight: estimatedWeight,
        address: {
          addressLine1: '456 Customer Lane',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560002',
          coordinates: { latitude: 12.9750 + (Math.random() - 0.5) * 0.1, longitude: 77.6245 + (Math.random() - 0.5) * 0.1 }
        },
        scheduledDate: date,
        timeSlot: '10:00 AM - 1:00 PM',
        notes: `Pickup of ${material} - ${estimatedWeight}kg`
      });
    }
    
    await Pickup.insertMany(pickups);
    console.log(`Created ${pickups.length} test pickups`);

    console.log('\n✅ Test data seeded successfully!');
    console.log('\nTest Recycler Credentials:');
    console.log('Email: testrecycler@scrapp.com');
    console.log('Password: password123');
    console.log('Recycler Profile ID:', recyclerProfile._id);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding test data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedTestData();
