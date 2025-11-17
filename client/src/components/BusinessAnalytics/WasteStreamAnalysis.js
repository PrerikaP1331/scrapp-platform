// client/src/components/BusinessAnalytics/WasteStreamAnalysis.js
import React from 'react';
import { Paper, Text, Box, Loader, Center } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WasteStreamAnalysis = ({ data, isLoading }) => {
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

  const chartData = data.slice(0, 10).map(item => ({
    material: item.material,
    revenue: item.revenue,
    weight: item.weight
  }));

  return (
    <Paper p="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        Revenue by Waste Material
      </Text>

      <Box style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="material" type="category" width={190} />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#4c6ef5"
              name="Revenue (₹)"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box mt="md">
        <Text fw={600} size="sm" mb="sm">
          Top Materials by Count
        </Text>
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}
        >
          {data.slice(0, 5).map((item, index) => (
            <Box
              key={index}
              p="xs"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}
            >
              <Text size="sm" fw={600}>{item.material}</Text>
              <Text size="xs" c="dimmed">{item.count} pickups</Text>
              <Text size="xs" fw={500}>₹{item.revenue.toLocaleString('en-IN')}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default WasteStreamAnalysis;
