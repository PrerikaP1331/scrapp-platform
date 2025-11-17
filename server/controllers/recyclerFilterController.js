/**
 * Recycler filtering and listing controller
 * Handles queries for finding recyclers by capacity, waste type, location, etc.
 */

const RecyclerProfile = require('../models/RecyclerProfile');
const User = require('../models/User');

/**
 * Get available recyclers with filtering
 * GET /api/recyclers
 * Query params:
 *   - capacity: 'bulk' or 'standard' (defaults to 'standard')
 *   - wasteTypes: comma-separated list of waste types (e.g., 'paper,plastic')
 *   - clientType: 'individual', 'community', 'organization'
 *   - city: filter by service area/city
 *   - specialty: filter by specialties (e.g., 'E-Waste Specialist')
 *   - rating: minimum rating (0-5)
 */
exports.getAvailableRecyclers = async (req, res) => {
  try {
    const { capacity, wasteTypes, clientType, city, specialty, rating, limit = 10, page = 1 } = req.query;

    // Build filter query
    const filter = {};

    // Filter by bulk capacity if specified
    if (capacity === 'bulk') {
      // Bulk recyclers should have 'maxPickupsPerDay' > 10 or be marked as handling bulk
      // We'll include those that serve 'community' or 'organization' clients
      filter.clientTypes = { $in: ['community', 'organization'] };
    } else if (clientType) {
      filter.clientTypes = clientType;
    } else {
      // Default: include all types
      filter.clientTypes = { $exists: true };
    }

    // Filter by waste types (can match if ANY of the requested types are accepted)
    if (wasteTypes) {
      const wasteTypeArray = wasteTypes.split(',').map(w => w.trim());
      filter.acceptedWasteTypes = { $in: wasteTypeArray };
    }

    // Filter by city/service area
    if (city) {
      filter.serviceAreas = { $regex: city, $options: 'i' }; // Case-insensitive
    }

    // Filter by specialty (e.g., "E-Waste Specialist")
    if (specialty) {
      filter.specialties = { $regex: specialty, $options: 'i' };
    }

    // Filter by minimum rating
    if (rating) {
      filter['rating.averageScore'] = { $gte: parseFloat(rating) };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Query recyclers with populated user data
    const recyclers = await RecyclerProfile.find(filter)
      .populate('user', 'name email phone')
      .limit(limitNum)
      .skip(skip)
      .sort({ 'rating.averageScore': -1 }); // Sort by highest rating

    // Get total count for pagination
    const total = await RecyclerProfile.countDocuments(filter);

    // Format response
    const formattedRecyclers = recyclers.map(recycler => ({
      id: recycler._id,
      userId: recycler.user._id,
      businessName: recycler.businessName,
      businessPhone: recycler.businessPhone,
      businessEmail: recycler.businessEmail,
      businessLogo: recycler.businessLogo,
      tagline: recycler.tagline,
      description: recycler.description,
      businessAddress: recycler.businessAddress,
      serviceAreas: recycler.serviceAreas,
      acceptedWasteTypes: recycler.acceptedWasteTypes,
      clientTypes: recycler.clientTypes,
      specialties: recycler.specialties,
      availability: recycler.availability,
      rating: recycler.rating,
      maxPickupsPerDay: recycler.maxPickupsPerDay,
      contact: {
        name: recycler.user.name,
        email: recycler.user.email,
        phone: recycler.user.phone
      }
    }));

    res.json({
      recyclers: formattedRecyclers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get a specific recycler's details
 * GET /api/recyclers/:recyclerId
 */
exports.getRecyclerDetails = async (req, res) => {
  try {
    const { recyclerId } = req.params;

    const recycler = await RecyclerProfile.findById(recyclerId).populate('user', 'name email phone');

    if (!recycler) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    res.json({
      id: recycler._id,
      userId: recycler.user._id,
      businessName: recycler.businessName,
      businessPhone: recycler.businessPhone,
      businessEmail: recycler.businessEmail,
      businessLogo: recycler.businessLogo,
      tagline: recycler.tagline,
      description: recycler.description,
      businessAddress: recycler.businessAddress,
      serviceAreas: recycler.serviceAreas,
      acceptedWasteTypes: recycler.acceptedWasteTypes,
      clientTypes: recycler.clientTypes,
      specialties: recycler.specialties,
      availability: recycler.availability,
      rating: recycler.rating,
      maxPickupsPerDay: recycler.maxPickupsPerDay,
      contact: {
        name: recycler.user.name,
        email: recycler.user.email,
        phone: recycler.user.phone
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Check if recycler can handle specific waste types and quantity
 * POST /api/recyclers/:recyclerId/check-capacity
 */
exports.checkRecyclerCapacity = async (req, res) => {
  try {
    const { recyclerId } = req.params;
    const { wasteTypes, quantity, scheduledDate } = req.body;

    if (!wasteTypes || wasteTypes.length === 0) {
      return res.status(400).json({ msg: 'wasteTypes are required' });
    }

    const recycler = await RecyclerProfile.findById(recyclerId);

    if (!recycler) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    // Check if recycler accepts all requested waste types
    const canHandleAllTypes = wasteTypes.every(type =>
      recycler.acceptedWasteTypes.includes(type)
    );

    if (!canHandleAllTypes) {
      return res.json({
        canHandle: false,
        reason: 'Recycler does not accept all requested waste types'
      });
    }

    // Check capacity based on quantity
    const maxCapacity = recycler.maxPickupsPerDay || 10;
    const quantityScore = quantity === 'bulky-items' ? 3 : 
                         quantity === 'large-truckload' ? 2 : 1;

    if (quantityScore > maxCapacity) {
      return res.json({
        canHandle: false,
        reason: 'Recycler may not have sufficient capacity for this quantity'
      });
    }

    res.json({
      canHandle: true,
      recycler: {
        id: recycler._id,
        businessName: recycler.businessName,
        maxPickupsPerDay: maxCapacity
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
