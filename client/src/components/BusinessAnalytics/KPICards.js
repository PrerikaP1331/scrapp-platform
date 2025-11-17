// client/src/components/BusinessAnalytics/KPICards.js
import React from 'react';
import { Grid, Paper, Text, Group, ThemeIcon } from '@mantine/core';
import {
  IconCurrencyRupee,
  IconPackage,
  IconTrendingUp,
  IconWeight,
  IconUsers
} from '@tabler/icons-react';

const KPICard = ({ icon: Icon, label, value, unit = '', trend = null }) => {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
          {label}
        </Text>
        <ThemeIcon variant="light" size="lg" radius="md">
          <Icon size={20} />
        </ThemeIcon>
      </Group>

      <Group align="flex-end" gap="xs" mb="md">
        <Text fw={700} size="lg">
          {value}
        </Text>
        {unit && <Text size="sm" c="dimmed">{unit}</Text>}
      </Group>

      {trend && (
        <Text size="xs" c={trend > 0 ? 'green' : 'red'}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
        </Text>
      )}
    </Paper>
  );
};

const KPICards = ({ kpis }) => {
  if (!kpis) return null;

  return (
    <Grid gutter="md" mb="lg">
      <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KPICard
          icon={IconCurrencyRupee}
          label="Total Revenue"
          value={`₹${kpis.totalRevenue.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KPICard
          icon={IconPackage}
          label="Completed Pickups"
          value={kpis.totalPickups}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KPICard
          icon={IconTrendingUp}
          label="Avg Revenue Per Pickup"
          value={`₹${kpis.avgRevenuePerPickup.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KPICard
          icon={IconWeight}
          label="Total Weight Collected"
          value={kpis.totalWeight.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
          unit="kg"
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KPICard
          icon={IconUsers}
          label="New Customers"
          value={kpis.newCustomers}
        />
      </Grid.Col>
    </Grid>
  );
};

export default KPICards;
