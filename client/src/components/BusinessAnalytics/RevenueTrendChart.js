// client/src/components/BusinessAnalytics/RevenueTrendChart.js
import React from 'react';
import { Paper, Text, Box, Loader, Center } from '@mantine/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RevenueTrendChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Center h={400}>
          <Loader />
        </Center>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Text c="dimmed">No data available for the selected date range</Text>
      </Paper>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }));

  return (
    <Paper p="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        Revenue Over Time
      </Text>

      <Box style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2f9e44"
              dot={{ fill: '#2f9e44', r: 4 }}
              activeDot={{ r: 6 }}
              name="Daily Revenue"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RevenueTrendChart;
