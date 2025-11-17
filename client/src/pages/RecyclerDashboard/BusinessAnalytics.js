// client/src/pages/RecyclerDashboard/BusinessAnalytics.js
import React, { useEffect, useState } from 'react';
import { Container, Stack, Alert, Loader, Center, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ReportControls from '../../components/BusinessAnalytics/ReportControls';
import KPICards from '../../components/BusinessAnalytics/KPICards';
import RevenueTrendChart from '../../components/BusinessAnalytics/RevenueTrendChart';
import WasteStreamAnalysis from '../../components/BusinessAnalytics/WasteStreamAnalysis';
import PickupHeatmap from '../../components/BusinessAnalytics/PickupHeatmap';
import TopCustomersTable from '../../components/BusinessAnalytics/TopCustomersTable';
import { generateMockAnalytics } from '../../api/recyclerAnalyticsService';

const BusinessAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });



  // Initialize with last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setDateRange({
      startDate: thirtyDaysAgo,
      endDate: today
    });
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!dateRange.startDate || !dateRange.endDate) return;

      setLoading(true);
      setError(null);

      try {
        // For now, use mock data. In production, call actual API:
        // const startDateStr = dateRange.startDate.toISOString().split('T')[0];
        // const endDateStr = dateRange.endDate.toISOString().split('T')[0];
        // const data = await getAnalytics(recyclerId, startDateStr, endDateStr);

        const mockData = generateMockAnalytics(dateRange.startDate, dateRange.endDate);
        setAnalytics(mockData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(
          err.response?.data?.msg || 
          'Failed to fetch analytics data. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (start, end) => {
    setDateRange({
      startDate: start,
      endDate: end
    });
  };

  const handleExport = () => {
    if (analytics) {
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Revenue', `₹${analytics.kpis.totalRevenue}`],
        ['Total Completed Pickups', analytics.kpis.totalPickups],
        ['Average Revenue Per Pickup', `₹${analytics.kpis.avgRevenuePerPickup}`],
        ['Total Weight Collected', `${analytics.kpis.totalWeight}T`],
        ['New Customers Acquired', analytics.kpis.newCustomers],
        [],
        ['Waste Type', 'Revenue', 'Weight (kg)'],
        ...analytics.wasteTypes.map(w => [w.name, `₹${w.revenue}`, w.weight])
      ];

      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.join(',') + '\n';
      });

      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      link.download = `analytics-${dateRange.startDate?.toISOString().split('T')[0]}-to-${dateRange.endDate?.toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Page Title */}
        <Box>
          <h1 style={{ color: '#344e41' }}>Business Analytics</h1>
          <p style={{ color: '#3a5a40', marginTop: '8px' }}>
            Comprehensive overview of your recycling business performance on Scrapp
          </p>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Report Controls */}
        <ReportControls
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
          isLoading={loading}
        />

        {/* Loading State */}
        {loading && !analytics ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : analytics ? (
          <>
            {/* KPI Cards Row */}
            <KPICards kpis={analytics.kpis} />

            {/* Revenue Trend Chart */}
            <RevenueTrendChart data={analytics.revenueTrend} />

            {/* Waste Stream Analysis */}
            <WasteStreamAnalysis data={analytics.wasteTypes} />

            {/* Pickup Heatmap */}
            <PickupHeatmap locations={analytics.heatmapData} />

            {/* Top Customers Table */}
            <TopCustomersTable
              topIndividuals={analytics.topIndividuals}
              topOrganizations={analytics.topOrganizations}
            />
          </>
        ) : null}
      </Stack>
    </Container>
  );
};

export default BusinessAnalytics;
