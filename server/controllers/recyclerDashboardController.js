// /server/controllers/recyclerDashboardController.js
const axios = require('axios');
const Pickup = require('../models/Pickup');
const RecyclerProfile = require('../models/RecyclerProfile');
const User = require('../models/User');

/**
 * Get recycler dashboard summary
 * GET /api/recycler/dashboard
 * Returns: KPIs, pending requests, today's pickups, and weekly performance
 */
exports.getDashboard = async (req, res) => {
  try {
    const recyclerId = req.user.id;

    // Get recycler profile
    const recyclerProfile = await RecyclerProfile.findOne({ user: recyclerId });
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(today.getDate() + 1);

    // 1. Get today's pickups count
    const todaysPickups = await Pickup.find({
      recycler: recyclerId,
      scheduledDate: { $gte: today, $lt: tomorrowStart },
      status: { $in: ['scheduled', 'upcoming', 'in-transit', 'completed'] }
    }).populate('user', 'name phone').populate('recyclerProfile', 'businessName');

    const todaysPickupsCount = todaysPickups.length;

    // 2. Get pending requests count
    const pendingRequests = await Pickup.find({
      recyclerProfile: recyclerProfile._id,
      status: 'pending'
    })
      .populate('user', 'name phone address')
      .populate('community', 'name')
      .populate('organization', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const pendingRequestsCount = pendingRequests.length;

    // 3. Calculate monthly earnings
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const completedPickups = await Pickup.find({
      recycler: recyclerId,
      status: 'completed',
      updatedAt: { $gte: monthStart, $lt: monthEnd }
    });

    // Simple earnings calculation: ₹100 per completed pickup (can be customized)
    const monthlyEarnings = completedPickups.length * 100;

    // 4. Get first 5 today's pickups
    const todayFirst5 = todaysPickups
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        timeSlot: p.timeSlot,
        customerName: p.user?.name || 'Unknown',
        location: p.address?.city || 'Unknown',
        status: p.status,
        wasteTypes: p.wasteTypes
      }));

    // 5. Get weekly performance data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayPickups = await Pickup.countDocuments({
        recycler: recyclerId,
        status: 'completed',
        updatedAt: { $gte: dayStart, $lt: dayEnd }
      });

      const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData.push({
        day: dayName,
        date: dayStart.toISOString().split('T')[0],
        pickups: dayPickups
      });
    }

    // 6. Format pending requests for display (first 4)
    const formattedPendingRequests = pendingRequests
      .slice(0, 4)
      .map(p => ({
        _id: p._id,
        customerName: p.user?.name || 'Unknown',
        location: p.address?.city || 'Unknown',
        wasteTypes: p.wasteTypes,
        createdAt: p.createdAt
      }));

    res.json({
      kpis: {
        todaysPickups: todaysPickupsCount,
        pendingRequests: pendingRequestsCount,
        monthlyEarnings: monthlyEarnings,
        businessName: recyclerProfile.businessName
      },
      newRequests: formattedPendingRequests,
      todaysSchedule: todayFirst5,
      weeklyPerformance: weeklyData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Accept a pickup request
 * POST /api/recycler/pickup/:pickupId/accept
 */
exports.acceptPickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const recyclerId = req.user.id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ msg: 'Pickup not found' });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({ msg: 'Pickup is not in pending status' });
    }

    pickup.recycler = recyclerId;
    pickup.status = 'scheduled';
    await pickup.save();

    res.json({ msg: 'Pickup accepted successfully', pickup });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Decline a pickup request
 * POST /api/recycler/pickup/:pickupId/decline
 */
exports.declinePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ msg: 'Pickup not found' });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({ msg: 'Pickup is not in pending status' });
    }

    pickup.status = 'cancelled';
    await pickup.save();

    res.json({ msg: 'Pickup declined successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Get today's optimized route with waypoint optimization
 * GET /api/recycler/route/today
 * Returns: Ordered pickups with coordinates and route geometry
 */
exports.getTodayRoute = async (req, res) => {
  try {
    const recyclerId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(today.getDate() + 1);

    // Get all accepted pickups for today (scheduled, upcoming, in-transit, completed)
    const todayPickups = await Pickup.find({
      recycler: recyclerId,
      scheduledDate: { $gte: today, $lt: tomorrowStart },
      status: { $in: ['scheduled', 'upcoming', 'in-transit', 'completed'] }
    })
      .populate('user', 'name phone')
      .sort({ timeSlot: 1 });

    if (todayPickups.length === 0) {
      return res.json({
        pickups: [],
        route: { coordinates: [], geometry: [] },
        date: today.toISOString().split('T')[0],
        totalPickups: 0
      });
    }

    // If only 1 pickup, no need to optimize
    if (todayPickups.length === 1) {
      const pickup = todayPickups[0];
      const optimizedPickups = [{
        _id: pickup._id,
        position: 1,
        timeSlot: pickup.timeSlot,
        customerName: pickup.user?.name || 'Unknown',
        customerPhone: pickup.user?.phone || 'N/A',
        address: pickup.address?.addressLine1 || 'Unknown',
        city: pickup.address?.city || 'Unknown',
        postalCode: pickup.address?.postalCode || 'Unknown',
        location: `${pickup.address?.city}, ${pickup.address?.state}`,
        wasteTypes: pickup.wasteTypes,
        quantity: pickup.quantity,
        notes: pickup.notes,
        status: pickup.status,
        coordinates: {
          latitude: pickup.address?.coordinates?.latitude || 0,
          longitude: pickup.address?.coordinates?.longitude || 0
        }
      }];

      return res.json({
        pickups: optimizedPickups,
        route: { 
          coordinates: optimizedPickups.map(p => [p.coordinates.longitude, p.coordinates.latitude]),
          geometry: []
        },
        date: today.toISOString().split('T')[0],
        totalPickups: 1
      });
    }

    // Build waypoints array for OpenRouteService (lon, lat format)
    const waypoints = todayPickups.map(p => [
      p.address?.coordinates?.longitude || 0,
      p.address?.coordinates?.latitude || 0
    ]);

    // Call OpenRouteService to optimize route
    let optimizedOrder = Array.from({length: todayPickups.length}, (_, i) => i);
    let routeGeometry = [];

    try {
      const apiKey = process.env.OPENROUTE_SERVICE_API_KEY;
      
      // If we have multiple waypoints, use Directions API to get the optimized route
      if (todayPickups.length > 1) {
        // Format waypoints as comma-separated lon,lat pairs for directions API
        const coordinatesString = waypoints.map(w => `${w[0]},${w[1]}`).join('|');
        
        // Call OpenRouteService Directions API to get route geometry
        const directionsResponse = await axios.get(
          'https://api.openrouteservice.org/v2/directions/driving',
          {
            params: {
              coordinates: coordinatesString,
              format: 'geojson'
            },
            headers: {
              'Authorization': apiKey
            }
          }
        );

        if (directionsResponse.data && directionsResponse.data.features && directionsResponse.data.features.length > 0) {
          routeGeometry = directionsResponse.data.features[0].geometry.coordinates;
        }
      }
    } catch (routeError) {
      console.warn('Route optimization failed, using database order:', routeError.message);
      optimizedOrder = Array.from({length: todayPickups.length}, (_, i) => i);
    }

    // Reorder pickups based on optimization
    const optimizedPickups = optimizedOrder.map((idx, position) => {
      const pickup = todayPickups[idx];
      return {
        _id: pickup._id,
        position: position + 1,
        timeSlot: pickup.timeSlot,
        customerName: pickup.user?.name || 'Unknown',
        customerPhone: pickup.user?.phone || 'N/A',
        address: pickup.address?.addressLine1 || 'Unknown',
        city: pickup.address?.city || 'Unknown',
        postalCode: pickup.address?.postalCode || 'Unknown',
        location: `${pickup.address?.city}, ${pickup.address?.state}`,
        wasteTypes: pickup.wasteTypes,
        quantity: pickup.quantity,
        notes: pickup.notes,
        status: pickup.status,
        coordinates: {
          latitude: pickup.address?.coordinates?.latitude || 0,
          longitude: pickup.address?.coordinates?.longitude || 0
        }
      };
    });

    // Return optimized route with geometry
    res.json({
      pickups: optimizedPickups,
      route: {
        coordinates: waypoints.map((w, idx) => {
          const pickupIdx = optimizedOrder.indexOf(idx);
          const pickup = todayPickups[idx];
          return [pickup.address?.coordinates?.longitude || 0, pickup.address?.coordinates?.latitude || 0];
        }),
        geometry: routeGeometry
      },
      date: today.toISOString().split('T')[0],
      totalPickups: optimizedPickups.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Update pickup status to completed
 * PUT /api/pickups/:pickupId/status
 * Body: { status: 'completed' | 'in-transit' | 'upcoming' }
 */
exports.updatePickupStatus = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { status } = req.body;
    const recyclerId = req.user.id;

    // Validate status
    const validStatuses = ['scheduled', 'upcoming', 'in-transit', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ msg: 'Pickup not found' });
    }

    // Verify the recycler owns this pickup
    if (pickup.recycler.toString() !== recyclerId) {
      return res.status(403).json({ msg: 'Not authorized to update this pickup' });
    }

    pickup.status = status;
    await pickup.save();

    res.json({ msg: `Pickup status updated to ${status}`, pickup });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Get filtered pickups with search, status, and date range
 * GET /api/recycler/pickups?status=[status]&startDate=[date]&endDate=[date]&search=[query]
 * Returns: Filtered pickup records with full details for display
 */
exports.getPickupsFiltered = async (req, res) => {
  try {
    const recyclerId = req.user.id;
    const { status, startDate, endDate, search, sortBy = 'scheduledDate', order = 'asc' } = req.query;

    // Build filter object
    const filter = {
      recycler: recyclerId
    };

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.scheduledDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.scheduledDate.$lte = end;
      }
    }

    // Text search filter
    let pickups;
    if (search) {
      pickups = await Pickup.find({
        ...filter,
        $or: [
          { 'user.name': { $regex: search, $options: 'i' } },
          { 'address.addressLine1': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
          { 'address.postalCode': { $regex: search, $options: 'i' } }
        ]
      })
        .populate('user', 'name phone email address')
        .populate('community', 'name')
        .populate('organization', 'name')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    } else {
      pickups = await Pickup.find(filter)
        .populate('user', 'name phone email address')
        .populate('community', 'name')
        .populate('organization', 'name')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    }

    // Format response
    const formattedPickups = pickups.map(p => ({
      _id: p._id,
      date: p.scheduledDate ? p.scheduledDate.toISOString().split('T')[0] : 'N/A',
      time: p.timeSlot,
      customerName: p.user?.name || 'Unknown',
      customerPhone: p.user?.phone || 'N/A',
      customerEmail: p.user?.email || 'N/A',
      address: p.address?.addressLine1 || 'Unknown',
      city: p.address?.city || 'Unknown',
      state: p.address?.state || 'Unknown',
      postalCode: p.address?.postalCode || 'N/A',
      coordinates: p.address?.coordinates || { latitude: 0, longitude: 0 },
      wasteTypes: p.wasteTypes || [],
      quantity: p.quantity || 'Not specified',
      estimatedWeight: p.estimatedWeight || null,
      status: p.status,
      notes: p.notes || '',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    res.json({
      total: formattedPickups.length,
      pickups: formattedPickups
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
