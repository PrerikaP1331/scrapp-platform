import React from 'react';
import { Container, Grid, Paper, Text, Title, Group, ThemeIcon, SimpleGrid, Card, Button } from '@mantine/core';
import { IconTruck, IconTicket, IconGift, IconTicketOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

function DashboardHome() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: IconTruck,
      title: 'Schedule a new pickup',
      description: 'Book one for your household',
      path: '/dashboard/schedule-pickup',
    },
    {
      icon: IconTicket,
      title: 'Redeem your coupons',
      description: 'Use our rewards',
      path: '/dashboard/coupons',
    },
    {
      icon: IconGift,
      title: 'Give away an item',
      description: 'Share with your community',
      path: '/dashboard/communities',
    },
  ];

  const impactStats = [
    { label: 'CO2 Emissions Saved', value: 'XYZ' },
    { label: 'Waste diverted from landfill', value: 'XYZ' },
    { label: 'Total pickups completed', value: 'XYZ' },
    { label: 'Your coupons', value: 'XYZ' },
  ];

  return (
    <Container size="xl" py="lg">
      {/* Welcome Section */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Welcome back, [Name]!</Title>
          <Text c="dimmed">some question for user, [Name]?</Text>
        </div>
        <ThemeIcon size="xl" radius="xl" variant="light" color="green">
          👤
        </ThemeIcon>
      </Group>

      {/* Quick Actions */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        {quickActions.map((action) => (
          <Paper
            key={action.title}
            p="lg"
            radius="md"
            className={styles.gridItem}
            onClick={() => navigate(action.path)}
          >
            <Group justify="center" mb="md">
              <action.icon size={32} color="#588157" />
            </Group>
            <Text fw={600} size="sm" mb="xs">
              {action.title}
            </Text>
            <Text size="xs" c="dimmed">
              {action.description}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Impact Section */}
      <Title order={3} mb="md">My Impact</Title>
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="xl">
        {impactStats.map((stat) => (
          <Paper key={stat.label} p="lg" radius="md" className={styles.gridItem}>
            <ThemeIcon variant="light" size="lg" radius="md" color="green" mb="md">
              🌱
            </ThemeIcon>
            <Text size="xs" c="dimmed" mb="xs">
              {stat.label}
            </Text>
            <Text fw={700} size="lg">
              {stat.value}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Recent Activity */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="lg" radius="md" className={styles.card}>
            <Title order={4} mb="md">Recent Activity</Title>
            <Text c="dimmed" size="sm">
              View all history
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="lg" radius="md" className={styles.card}>
            <Title order={4} mb="md">Community Updates</Title>
            <Text c="dimmed" size="sm">
              Go to Community Hub
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default DashboardHome;
