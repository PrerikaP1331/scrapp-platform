// /server/controllers/recyclerController.js
const User = require('../models/User');
const RecyclerProfile = require('../models/RecyclerProfile');
const Pickup = require('../models/Pickup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerRecycler = async (req, res) => {
  const {
    name, email, phone, password, // User details
    businessName, addressLine1, addressLine2, city, postalCode, state, // Business details
    latitude, longitude, // Coordinates for business address
    serviceAreas, acceptedWasteTypes // Service details
  } = req.body;

  try {
    // 1. Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    // 2. Create and save the new user with the 'recycler' role
    user = new User({
      name, email, phone, password,
      role: 'recycler', // Assign the correct role
      address: { addressLine1, addressLine2, city, postalCode, state }
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // 3. Create the separate RecyclerProfile, linking it to the new user
    const newRecyclerProfile = new RecyclerProfile({
      user: user.id,
      businessName,
      businessAddress: { 
        addressLine1, 
        addressLine2, 
        city, 
        postalCode, 
        state,
        coordinates: {
          latitude: latitude || 0,
          longitude: longitude || 0
        }
      },
      serviceAreas: serviceAreas.split(',').map(area => area.trim()),
      acceptedWasteTypes,
      availability: {
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '12:00', end: '15:00' },
          { start: '15:00', end: '18:00' }
        ]
      }
    });

    await newRecyclerProfile.save();
    
    // 4. Create and return a JWT for the new user
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get recycler profile details
exports.getRecyclerProfile = async (req, res) => {
  try {
    const recyclerProfile = await RecyclerProfile.findOne({ user: req.user.id })
      .populate('user', 'name email phone');

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    res.json(recyclerProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get recycler details by ID (for customer viewing)
exports.getRecyclerById = async (req, res) => {
  try {
    const { recyclerId } = req.params;

    const recyclerProfile = await RecyclerProfile.findById(recyclerId)
      .populate('user', 'name email phone');

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    res.json(recyclerProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update recycler availability
exports.updateAvailability = async (req, res) => {
  try {
    const { operatingDays, timeSlots } = req.body;

    const recyclerProfile = await RecyclerProfile.findOne({ user: req.user.id });

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    if (operatingDays) {
      recyclerProfile.availability.operatingDays = operatingDays;
    }

    if (timeSlots) {
      recyclerProfile.availability.timeSlots = timeSlots;
    }

    await recyclerProfile.save();

    res.json(recyclerProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get recycler's assigned pickups
exports.getAssignedPickups = async (req, res) => {
  try {
    const recyclerProfile = await RecyclerProfile.findOne({ user: req.user.id });

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    const pickups = await Pickup.find({ recyclerProfile: recyclerProfile._id })
      .populate('user', 'name email phone address')
      .sort({ scheduledDate: 1 });

    res.json(pickups);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get recycler statistics
exports.getRecyclerStats = async (req, res) => {
  try {
    const recyclerProfile = await RecyclerProfile.findOne({ user: req.user.id });

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    // Get all pickups for this recycler
    const allPickups = await Pickup.find({ recyclerProfile: recyclerProfile._id });

    // Calculate stats
    const completedPickups = allPickups.filter(p => p.status === 'completed').length;
    const totalPickups = allPickups.length;
    const averageRating = recyclerProfile.rating.averageScore;
    const totalReviews = recyclerProfile.rating.totalReviews;

    // Get today's pickups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPickups = await Pickup.find({
      recyclerProfile: recyclerProfile._id,
      scheduledDate: { $gte: today, $lt: tomorrow }
    });

    res.json({
      businessName: recyclerProfile.businessName,
      completedPickups,
      totalPickups,
      averageRating,
      totalReviews,
      todayPickups: todayPickups.length,
      maxPickupsToday: recyclerProfile.maxPickupsPerDay
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get recycler profile for public display with profile picture
exports.getProfileForEdit = async (req, res) => {
  try {
    const { recyclerId } = req.params;

    const recyclerProfile = await RecyclerProfile.findById(recyclerId)
      .populate('user', 'name email phone');

    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    res.json({
      _id: recyclerProfile._id,
      businessName: recyclerProfile.businessName,
      businessPhone: recyclerProfile.businessPhone || '',
      businessEmail: recyclerProfile.businessEmail || '',
      businessLogo: recyclerProfile.businessLogo || '',
      tagline: recyclerProfile.tagline || '',
      description: recyclerProfile.description || '',
      serviceAreas: recyclerProfile.serviceAreas || [],
      acceptedWasteTypes: recyclerProfile.acceptedWasteTypes || [],
      specialties: recyclerProfile.specialties || [],
      clientTypes: recyclerProfile.clientTypes || [],
      rating: recyclerProfile.rating || { averageScore: 0, totalReviews: 0 },
      user: recyclerProfile.user
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Update recycler profile for public display
exports.updateProfileForEdit = async (req, res) => {
  try {
    const { recyclerId } = req.params;
    const {
      businessName,
      businessPhone,
      businessEmail,
      businessLogo,
      tagline,
      description,
      serviceAreas,
      acceptedWasteTypes,
      specialties,
      clientTypes
    } = req.body;

    // Validate required fields
    if (!businessName || !businessPhone) {
      return res.status(400).json({ msg: 'Business name and phone are required' });
    }

    // Validate field lengths
    if (tagline && tagline.length > 50) {
      return res.status(400).json({ msg: 'Tagline must be 50 characters or less' });
    }
    if (description && description.length > 300) {
      return res.status(400).json({ msg: 'Description must be 300 characters or less' });
    }

    let recyclerProfile = await RecyclerProfile.findById(recyclerId);
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    // Update fields
    recyclerProfile.businessName = businessName;
    recyclerProfile.businessPhone = businessPhone;
    recyclerProfile.businessEmail = businessEmail || '';
    recyclerProfile.businessLogo = businessLogo || '';
    recyclerProfile.tagline = tagline || '';
    recyclerProfile.description = description || '';
    recyclerProfile.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : [];
    recyclerProfile.acceptedWasteTypes = Array.isArray(acceptedWasteTypes) ? acceptedWasteTypes : [];
    recyclerProfile.specialties = Array.isArray(specialties) ? specialties : [];
    recyclerProfile.clientTypes = Array.isArray(clientTypes) ? clientTypes : [];

    await recyclerProfile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: recyclerProfile
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};