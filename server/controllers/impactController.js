// /server/controllers/impactController.js
const Pickup = require('../models/Pickup');
const User = require('../models/User');

// Constants for impact calculation
const CO2_SAVINGS_PER_KG = 2.5; // kg CO2 saved per kg of waste recycled
const WASTE_CATEGORY_WEIGHT = {
  'Paper & Cardboard': 0.3,
  'Plastics': 0.5,
  'Glass': 0.8,
  'Metal': 1.2,
  'E-Waste': 2.0,
  'Textiles': 0.4,
  'Other': 0.5,
};

// Helper to estimate weight based on quantity
const getEstimatedWeight = (quantity, wasteTypes) => {
  const baseWeights = {
    '1-2 Small Bags': 2,
    'A Medium Box': 5,
    'Multiple Large Bags': 15,
    'Bulky Items': 25,
  };

  const baseWeight = baseWeights[quantity] || 5;
  
  // If only one waste type, use specific weight
  if (wasteTypes.length === 1) {
    return baseWeight * (WASTE_CATEGORY_WEIGHT[wasteTypes[0]] || 1);
  }

  // For mixed waste, average the weights
  const avgWeight = wasteTypes.reduce((sum, type) => {
    return sum + (WASTE_CATEGORY_WEIGHT[type] || 1);
  }, 0) / wasteTypes.length;

  return baseWeight * avgWeight;
};

/**
 * Get user's impact statistics
 */
exports.getUserImpactStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all completed pickups for the user
    const completedPickups = await Pickup.find({
      user: userId,
      status: 'completed',
    }).sort({ completedAt: -1 });

    // Calculate aggregate metrics
    let totalWasteDiverted = 0;
    let wasteByCategory = {};
    let monthlyTrend = {};
    let totalCO2Saved = 0;

    completedPickups.forEach((pickup) => {
      // Estimate weight
      const estimatedWeight = getEstimatedWeight(pickup.quantity, pickup.wasteTypes);
      totalWasteDiverted += estimatedWeight;
      totalCO2Saved += estimatedWeight * CO2_SAVINGS_PER_KG;

      // Accumulate by waste category
      pickup.wasteTypes.forEach((type) => {
        if (!wasteByCategory[type]) {
          wasteByCategory[type] = 0;
        }
        wasteByCategory[type] += estimatedWeight / pickup.wasteTypes.length;
      });

      // Accumulate by month
      const monthKey = new Date(pickup.scheduledDate).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      if (!monthlyTrend[monthKey]) {
        monthlyTrend[monthKey] = 0;
      }
      monthlyTrend[monthKey] += estimatedWeight;
    });

    // Format waste by category
    const wasteByCategories = Object.entries(wasteByCategory).map(([category, weight]) => ({
      category,
      weight: parseFloat(weight.toFixed(2)),
    }));

    // Format monthly trend (last 12 months)
    const monthlyTrends = Object.entries(monthlyTrend)
      .map(([month, weight]) => ({
        month,
        weight: parseFloat(weight.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-12);

    // Prepare equivalency messages
    const equivalencies = {
      trees_planted: Math.round(totalCO2Saved / 20), // 1 tree absorbs ~20kg CO2/year
      plastic_bottles_saved: Math.round(totalWasteDiverted / 0.05), // avg plastic bottle = 50g
      car_km_avoided: Math.round(totalCO2Saved / 0.12), // 1 km driving = 0.12 kg CO2
    };

    res.json({
      lifetime_co2_saved: parseFloat(totalCO2Saved.toFixed(2)),
      lifetime_waste_diverted: parseFloat(totalWasteDiverted.toFixed(2)),
      lifetime_pickups: completedPickups.length,
      waste_by_category: wasteByCategories,
      monthly_trend: monthlyTrends,
      equivalencies,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Get impact stats for a specific month
 */
exports.getMonthlyImpactStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ msg: 'year and month are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const pickups = await Pickup.find({
      user: userId,
      status: 'completed',
      scheduledDate: { $gte: startDate, $lt: endDate },
    });

    let totalWeight = 0;
    let wasteByCategory = {};

    pickups.forEach((pickup) => {
      const estimatedWeight = getEstimatedWeight(pickup.quantity, pickup.wasteTypes);
      totalWeight += estimatedWeight;

      pickup.wasteTypes.forEach((type) => {
        if (!wasteByCategory[type]) {
          wasteByCategory[type] = 0;
        }
        wasteByCategory[type] += estimatedWeight / pickup.wasteTypes.length;
      });
    });

    res.json({
      month,
      year,
      total_waste: parseFloat(totalWeight.toFixed(2)),
      co2_saved: parseFloat((totalWeight * CO2_SAVINGS_PER_KG).toFixed(2)),
      pickups_count: pickups.length,
      waste_by_category: Object.entries(wasteByCategory).map(([category, weight]) => ({
        category,
        weight: parseFloat(weight.toFixed(2)),
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
