import React from 'react';
import { Container, Paper, Title, Text, Grid, Card, SimpleGrid, Stack, Group, ThemeIcon, Badge, Button } from '@mantine/core';
import {
  IconTrendingUp,
  IconMapPin,
  IconClock,
  IconMoneybag,
} from '@tabler/icons-react';

function RecyclerDashboardHome() {
  const stats = {
    pickupsToday: 8,
    pendingRequests: 3,
    earningsThisMonth: '₹85,640',
    acceptanceRate: '94%',
  };

  const todayPickups = [
    { id: 1, location: '45 Main Street, Bangalore', time: '09:30 AM', status: 'Pending' },
    { id: 2, location: '123 Tech Park, Bangalore', time: '10:15 AM', status: 'Accepted' },
    { id: 3, location: '78 Business Avenue, Bangalore', time: '11:00 AM', status: 'Pending' },
  ];

  const StatCard = ({ icon: Icon, label, value, color = '#588157' }) => (
    <Paper p="md" radius="md" withBorder style={{ textAlign: 'center' }}>
      <Group justify="center" mb="xs">
        <ThemeIcon size="lg" radius="md" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} color={color} />
        </ThemeIcon>
      </Group>
      <Text size="sm" color="dimmed" fw={500}>{label}</Text>
      <Text size="xl" fw={700} style={{ color: '#344e41' }}>{value}</Text>
    </Paper>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Welcome Section */}
        <Paper p="lg" radius="md" style={{ backgroundColor: '#f0f8f5', borderLeft: '4px solid #588157' }}>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Recycler Dashboard</Title>
          <Text color="dimmed">Manage your pickups, routes, and business operations</Text>
        </Paper>

        {/* Key Stats */}
        <div>
          <Title order={3} mb="md" style={{ color: '#344e41' }}>Today's Overview</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} gap="md">
            <StatCard icon={IconMapPin} label="Pickups Today" value={stats.pickupsToday} />
            <StatCard icon={IconClock} label="Pending Requests" value={stats.pendingRequests} />
            <StatCard icon={IconMoneybag} label="Earnings This Month" value={stats.earningsThisMonth} />
            <StatCard icon={IconTrendingUp} label="Acceptance Rate" value={stats.acceptanceRate} />
          </SimpleGrid>
        </div>

        {/* Today's Pickups Feed */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Title order={4} style={{ color: '#344e41' }}>Today's Pickups</Title>
            <Button variant="light" size="sm" onClick={() => window.location.href = '/recycler-dashboard/route'}>
              View Route
            </Button>
          </Group>
          <Stack gap="md">
            {todayPickups.map((pickup) => (
              <Group key={pickup.id} justify="space-between" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div>
                  <Text fw={500}>{pickup.location}</Text>
                  <Group gap="xs">
                    <IconClock size={14} style={{ color: '#588157' }} />
                    <Text size="sm" color="dimmed">{pickup.time}</Text>
                  </Group>
                </div>
                <Badge color={pickup.status === 'Accepted' ? 'green' : 'yellow'}>
                  {pickup.status}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Paper>

        {/* Quick Actions */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>Quick Actions</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#f0f8f5', cursor: 'pointer', border: '2px solid #588157' }}>
              <Text fw={600} style={{ color: '#344e41' }}>View Today's Route</Text>
              <Text size="sm" color="dimmed">Optimized pickup schedule with map</Text>
            </Paper>
            <Paper p="md" radius="md" style={{ backgroundColor: '#f0f8f5', cursor: 'pointer', border: '2px solid #588157' }}>
              <Text fw={600} style={{ color: '#344e41' }}>Check New Requests</Text>
              <Text size="sm" color="dimmed">Review pending pickup requests</Text>
            </Paper>
          </SimpleGrid>
        </div>
      </Stack>
    </Container>
  );
}

export default RecyclerDashboardHome;
