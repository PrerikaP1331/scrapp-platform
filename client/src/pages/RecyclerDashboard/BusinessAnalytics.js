// client/src/pages/RecyclerDashboard/BusinessAnalytics.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Stack, Alert, Loader, Center, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import { getAnalytics, exportToCSV } from '../../api/recyclerAnalyticsService';
import ReportControls from '../../components/BusinessAnalytics/ReportControls';
import KPICards from '../../components/BusinessAnalytics/KPICards';
import RevenueTrendChart from '../../components/BusinessAnalytics/RevenueTrendChart';
import WasteStreamAnalysis from '../../components/BusinessAnalytics/WasteStreamAnalysis';
import PickupHeatmap from '../../components/BusinessAnalytics/PickupHeatmap';
import TopCustomersTable from '../../components/BusinessAnalytics/TopCustomersTable';

const BusinessAnalytics = () => {
  const { user } = useContext(AuthContext);
  const recyclerId = user?.recyclerProfileId || user?.id;
  
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
        const startDateStr = dateRange.startDate.toISOString().split('T')[0];
        const endDateStr = dateRange.endDate.toISOString().split('T')[0];

        const data = await getAnalytics(recyclerId, startDateStr, endDateStr);
        setAnalytics(data);
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
  }, [dateRange, recyclerId]);

  const handleDateRangeChange = (start, end) => {
    setDateRange({
      startDate: start,
      endDate: end
    });
  };

  const handleExport = () => {
    if (analytics) {
      const filename = `analytics-${dateRange.startDate?.toISOString().split('T')[0]}-to-${dateRange.endDate?.toISOString().split('T')[0]}.csv`;
      exportToCSV(analytics, filename);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Page Title */}
        <Box>
          <h1>Business Analytics</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>
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
            <RevenueTrendChart data={analytics.revenueTrend} isLoading={loading} />

            {/* Waste Stream Analysis and Charts Row */}
            <WasteStreamAnalysis data={analytics.wasteStreamAnalysis} isLoading={loading} />

            {/* Pickup Heatmap */}
            <PickupHeatmap locations={analytics.pickupLocations} isLoading={loading} />

            {/* Top Customers Table */}
            <TopCustomersTable topCustomers={analytics.topCustomers} isLoading={loading} />
          </>
        ) : null}
      </Stack>
    </Container>
  );
};

export default BusinessAnalytics;
