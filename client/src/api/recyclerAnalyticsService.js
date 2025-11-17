// client/src/api/recyclerAnalyticsService.js
import axios from './axios';

const API_BASE_URL = '/api/recyclers';

export const generateMockAnalytics = (startDate, endDate) => {
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Revenue trend data
  const revenueTrend = [];
  for (let i = 0; i < days; i += Math.max(1, Math.floor(days / 14))) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    revenueTrend.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 8000 + 5000),
      pickups: Math.floor(Math.random() * 15 + 5),
      weight: Math.floor(Math.random() * 500 + 200)
    });
  }

  // Waste types data
  const wasteTypes = [
    { name: 'Metal & Scrap', revenue: 24200, weight: 1800 },
    { name: 'E-Waste', revenue: 22100, weight: 1200 },
    { name: 'Paper & Cardboard', revenue: 18500, weight: 2400 },
    { name: 'Plastic', revenue: 14800, weight: 900 },
    { name: 'Glass', revenue: 9500, weight: 600 }
  ];

  // Pickup locations for heatmap
  const pickupLocations = [
    { latitude: 12.9352, longitude: 77.6245, address: 'Whitefield' },
    { latitude: 12.9698, longitude: 77.7499, address: 'Koramangala' },
    { latitude: 12.9716, longitude: 77.5946, address: 'Downtown' },
    { latitude: 13.0827, longitude: 80.2707, address: 'Marathahalli' },
    { latitude: 12.8295, longitude: 77.6458, address: 'Jayanagar' },
    { latitude: 12.9749, longitude: 77.7499, address: 'Indiranagar' },
    { latitude: 13.1858, longitude: 77.6245, address: 'Yelahanka' },
    { latitude: 12.9355, longitude: 77.6245, address: 'Hebbal' }
  ];

  // Create heatmap data with intensity
  const heatmapData = [];
  for (let i = 0; i < 40; i++) {
    const loc = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
    heatmapData.push([
      loc.latitude + (Math.random() - 0.5) * 0.05,
      loc.longitude + (Math.random() - 0.5) * 0.05,
      Math.random() * 0.8 + 0.2 // intensity 0.2 - 1.0
    ]);
  }

  // Top individual customers
  const topIndividuals = [
    { customerId: 1, name: 'Rajesh Kumar', pickups: 24, revenue: 4200, weight: 1200, lastPickupDate: '2025-11-15' },
    { customerId: 2, name: 'Priya Singh', pickups: 19, revenue: 3400, weight: 950, lastPickupDate: '2025-11-14' },
    { customerId: 3, name: 'Amit Patel', pickups: 18, revenue: 3100, weight: 880, lastPickupDate: '2025-11-13' },
    { customerId: 4, name: 'Sarah Johnson', pickups: 16, revenue: 2800, weight: 750, lastPickupDate: '2025-11-12' },
    { customerId: 5, name: 'Vikram Gupta', pickups: 14, revenue: 2500, weight: 680, lastPickupDate: '2025-11-10' }
  ];

  // Top organization customers
  const topOrganizations = [
    { customerId: 101, name: 'Tech Park Solutions', pickups: 42, revenue: 8500, weight: 2400, lastPickupDate: '2025-11-16' },
    { customerId: 102, name: 'Green Office Ltd', pickups: 38, revenue: 7200, weight: 1950, lastPickupDate: '2025-11-15' },
    { customerId: 103, name: 'EcoWaste Management', pickups: 35, revenue: 6800, weight: 1850, lastPickupDate: '2025-11-14' },
    { customerId: 104, name: 'Smart Recycling Co', pickups: 31, revenue: 5900, weight: 1650, lastPickupDate: '2025-11-13' },
    { customerId: 105, name: 'Sustainability Corp', pickups: 28, revenue: 5400, weight: 1480, lastPickupDate: '2025-11-12' }
  ];

  // Calculate KPIs
  const totalRevenue = revenueTrend.reduce((sum, item) => sum + item.revenue, 0);
  const totalPickups = revenueTrend.reduce((sum, item) => sum + item.pickups, 0);
  const avgRevenuePerPickup = Math.round(totalRevenue / totalPickups);
  const totalWeight = (revenueTrend.reduce((sum, item) => sum + item.weight, 0) / 1000).toFixed(2);
  const newCustomers = Math.floor(Math.random() * 12 + 8);

  return {
    kpis: {
      totalRevenue,
      totalPickups,
      avgRevenuePerPickup,
      totalWeight: parseFloat(totalWeight),
      newCustomers
    },
    revenueTrend,
    wasteTypes,
    heatmapData,
    topIndividuals,
    topOrganizations
  };
};

export const getAnalytics = async (recyclerId, startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await axios.get(
      `${API_BASE_URL}/${recyclerId}/analytics?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportToCSV = (data, filename = 'analytics.csv') => {
  const { kpis, revenueTrend, wasteStreamAnalysis, topCustomers } = data;

  // Create CSV headers
  let csvContent = 'data:text/csv;charset=utf-8,';

  // KPIs Section
  csvContent += 'KEY PERFORMANCE INDICATORS\n';
  csvContent += 'Metric,Value\n';
  csvContent += `Total Revenue,₹${kpis.totalRevenue.toLocaleString()}\n`;
  csvContent += `Total Completed Pickups,${kpis.totalPickups}\n`;
  csvContent += `Average Revenue Per Pickup,₹${kpis.avgRevenuePerPickup}\n`;
  csvContent += `Total Weight Collected,${kpis.totalWeight} tonnes\n`;
  csvContent += `New Customers Acquired,${kpis.newCustomers}\n\n`;

  // Revenue Trend Section
  csvContent += 'REVENUE TREND\n';
  csvContent += 'Date,Revenue,Pickups,Weight (kg)\n';
  revenueTrend.forEach(item => {
    csvContent += `${item.date},₹${item.revenue},${item.pickups},${item.weight}\n`;
  });
  csvContent += '\n';

  // Waste Stream Analysis Section
  csvContent += 'WASTE STREAM ANALYSIS\n';
  csvContent += 'Material,Weight (kg),Revenue,Count\n';
  wasteStreamAnalysis.forEach(item => {
    csvContent += `${item.material},${item.weight},₹${item.revenue},${item.count}\n`;
  });
  csvContent += '\n';

  // Top Individuals Section
  csvContent += 'TOP INDIVIDUAL CUSTOMERS\n';
  csvContent += 'Name,Pickups,Total Revenue,Total Weight (kg),Last Pickup Date\n';
  topCustomers.individuals.forEach(customer => {
    const date = new Date(customer.lastPickupDate).toLocaleDateString();
    csvContent += `${customer.name},${customer.pickups},₹${customer.revenue},${customer.weight},${date}\n`;
  });
  csvContent += '\n';

  // Top Organizations Section
  csvContent += 'TOP ORGANIZATION CUSTOMERS\n';
  csvContent += 'Name,Pickups,Total Revenue,Total Weight (kg),Last Pickup Date\n';
  topCustomers.organizations.forEach(customer => {
    const date = new Date(customer.lastPickupDate).toLocaleDateString();
    csvContent += `${customer.name},${customer.pickups},₹${customer.revenue},${customer.weight},${date}\n`;
  });

  // Download the CSV
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
