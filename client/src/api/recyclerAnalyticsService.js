// client/src/api/recyclerAnalyticsService.js
import axios from './axios';

const API_BASE_URL = '/api/recyclers';

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
  csvContent += `Total Revenue,₹${kpis.totalRevenue}\n`;
  csvContent += `Total Completed Pickups,${kpis.totalPickups}\n`;
  csvContent += `Average Revenue Per Pickup,₹${kpis.avgRevenuePerPickup}\n`;
  csvContent += `Total Weight Collected,${kpis.totalWeight} kg\n`;
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
  csvContent += 'Name,Type,Pickups,Total Revenue,Total Weight (kg),Last Pickup Date\n';
  topCustomers.organizations.forEach(customer => {
    const date = new Date(customer.lastPickupDate).toLocaleDateString();
    csvContent += `${customer.name},${customer.type},${customer.pickups},₹${customer.revenue},${customer.weight},${date}\n`;
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
