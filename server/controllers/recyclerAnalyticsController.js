// /server/controllers/recyclerAnalyticsController.js
const RecyclerProfile = require('../models/RecyclerProfile');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const Community = require('../models/Community');
const Organisation = require('../models/Organisation');

exports.getAnalytics = async (req, res) => {
  try {
    const { recyclerId } = req.params;
    let { startDate, endDate } = req.query;

    // Validate recycler exists
    const recyclerProfile = await RecyclerProfile.findById(recyclerId).populate('user');
    if (!recyclerProfile) {
      return res.status(404).json({ msg: 'Recycler not found' });
    }

    // Set default date range (last 30 days if not provided)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all completed pickups in date range for this recycler
    const completedPickups = await Pickup.find({
      recyclerProfile: recyclerId,
      status: 'completed',
      updatedAt: { $gte: start, $lte: end }
    })
      .populate('user', 'name email phone')
      .populate('community', 'name')
      .populate('organization', 'name');

    // 1. KPI CALCULATIONS
    const totalPickups = completedPickups.length;
    const totalWeight = completedPickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);

    // Calculate revenue (assuming ₹50 per kg as default)
    const revenuePerKg = 50;
    const totalRevenue = totalWeight * revenuePerKg;
    const avgRevenuePerPickup = totalPickups > 0 ? totalRevenue / totalPickups : 0;

    // Count new customers (customers with first pickup in this period)
    const newCustomersSet = new Set();
    for (const pickup of completedPickups) {
      if (pickup.user) {
        // Check if this is the user's first pickup with this recycler
        const earlierPickups = await Pickup.findOne({
          recyclerProfile: recyclerId,
          user: pickup.user._id,
          status: 'completed',
          updatedAt: { $lt: start }
        });
        if (!earlierPickups) {
          newCustomersSet.add(pickup.user._id.toString());
        }
      }
    }
    const newCustomersCount = newCustomersSet.size;

    // 2. REVENUE TREND (daily aggregation)
    const revenueTrend = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayPickups = completedPickups.filter(p => {
        const pickupDate = new Date(p.updatedAt);
        pickupDate.setHours(0, 0, 0, 0);
        return pickupDate.getTime() === dayStart.getTime();
      });

      const dayWeight = dayPickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
      const dayRevenue = dayWeight * revenuePerKg;

      revenueTrend.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: parseFloat(dayRevenue.toFixed(2)),
        pickups: dayPickups.length,
        weight: parseFloat(dayWeight.toFixed(2))
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 3. WASTE STREAM ANALYSIS (by material type)
    const materialMap = {};
    completedPickups.forEach(pickup => {
      pickup.wasteTypes.forEach(type => {
        if (!materialMap[type]) {
          materialMap[type] = { weight: 0, revenue: 0, count: 0 };
        }
        materialMap[type].weight += pickup.estimatedWeight || 0;
        materialMap[type].count += 1;
      });
    });

    const wasteStreamAnalysis = Object.entries(materialMap).map(([material, data]) => ({
      material,
      weight: parseFloat(data.weight.toFixed(2)),
      revenue: parseFloat((data.weight * revenuePerKg).toFixed(2)),
      count: data.count
    })).sort((a, b) => b.revenue - a.revenue);

    // 4. PICKUP LOCATIONS (for heatmap)
    const pickupLocations = completedPickups
      .filter(p => p.address && p.address.coordinates)
      .map(p => ({
        latitude: p.address.coordinates.latitude,
        longitude: p.address.coordinates.longitude,
        weight: p.estimatedWeight || 0,
        address: `${p.address.addressLine1}, ${p.address.city}`
      }));

    // 5. TOP CUSTOMERS ANALYSIS
    const individualCustomers = {};
    const organizationCustomers = {};

    completedPickups.forEach(pickup => {
      if (pickup.user && pickup.user._id) {
        const userId = pickup.user._id.toString();
        if (!individualCustomers[userId]) {
          individualCustomers[userId] = {
            customerId: pickup.user._id,
            name: pickup.user.name,
            pickups: 0,
            weight: 0,
            revenue: 0,
            lastPickupDate: null
          };
        }
        individualCustomers[userId].pickups += 1;
        individualCustomers[userId].weight += pickup.estimatedWeight || 0;
        individualCustomers[userId].revenue += (pickup.estimatedWeight || 0) * revenuePerKg;
        individualCustomers[userId].lastPickupDate = pickup.updatedAt;
      }

      if (pickup.community && pickup.community._id) {
        const communityId = pickup.community._id.toString();
        if (!organizationCustomers[communityId]) {
          organizationCustomers[communityId] = {
            customerId: pickup.community._id,
            name: pickup.community.name,
            type: 'community',
            pickups: 0,
            weight: 0,
            revenue: 0,
            lastPickupDate: null
          };
        }
        organizationCustomers[communityId].pickups += 1;
        organizationCustomers[communityId].weight += pickup.estimatedWeight || 0;
        organizationCustomers[communityId].revenue += (pickup.estimatedWeight || 0) * revenuePerKg;
        organizationCustomers[communityId].lastPickupDate = pickup.updatedAt;
      }

      if (pickup.organization && pickup.organization._id) {
        const orgId = pickup.organization._id.toString();
        if (!organizationCustomers[orgId]) {
          organizationCustomers[orgId] = {
            customerId: pickup.organization._id,
            name: pickup.organization.name,
            type: 'organization',
            pickups: 0,
            weight: 0,
            revenue: 0,
            lastPickupDate: null
          };
        }
        organizationCustomers[orgId].pickups += 1;
        organizationCustomers[orgId].weight += pickup.estimatedWeight || 0;
        organizationCustomers[orgId].revenue += (pickup.estimatedWeight || 0) * revenuePerKg;
        organizationCustomers[orgId].lastPickupDate = pickup.updatedAt;
      }
    });

    const topIndividuals = Object.values(individualCustomers)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const topOrganizations = Object.values(organizationCustomers)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Return comprehensive analytics object
    res.json({
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      },
      kpis: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalPickups,
        avgRevenuePerPickup: parseFloat(avgRevenuePerPickup.toFixed(2)),
        totalWeight: parseFloat(totalWeight.toFixed(2)),
        newCustomers: newCustomersCount
      },
      revenueTrend,
      wasteStreamAnalysis,
      pickupLocations,
      topCustomers: {
        individuals: topIndividuals.map(c => ({
          ...c,
          weight: parseFloat(c.weight.toFixed(2)),
          revenue: parseFloat(c.revenue.toFixed(2))
        })),
        organizations: topOrganizations.map(c => ({
          ...c,
          weight: parseFloat(c.weight.toFixed(2)),
          revenue: parseFloat(c.revenue.toFixed(2))
        }))
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
