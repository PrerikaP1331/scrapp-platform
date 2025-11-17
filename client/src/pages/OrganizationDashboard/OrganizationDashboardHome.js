import React from 'react';
import { Container, Paper, Title, Text, Grid, Group, ThemeIcon, SimpleGrid, Stack } from '@mantine/core';
import {
  IconTrendingUp,
  IconUsers,
  IconRecycle,
  IconTruck,
  IconLeaf,
  IconCalendar,
  IconTarget,
} from '@tabler/icons-react';

function OrganizationDashboardHome() {
  const orgStats = {
    totalWasteRecycled: '2,450 kg',
    costSavings: '₹45,230',
    employeeEngagement: '78%',
    activeInitiatives: 4,
    totalEmployees: 125,
    nextPickupDate: 'Nov 18, 2025',
  };

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
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Organization Dashboard</Title>
          <Text color="dimmed">Manage corporate sustainability initiatives and track environmental impact</Text>
        </Paper>

        {/* Quick Stats */}
        <div>
          <Title order={3} mb="md" style={{ color: '#344e41' }}>Performance Overview</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} gap="md">
            <StatCard icon={IconTrendingUp} label="Total Waste Recycled" value={orgStats.totalWasteRecycled} />
            <StatCard icon={IconRecycle} label="Monthly Cost Savings" value={orgStats.costSavings} />
            <StatCard icon={IconUsers} label="Employee Engagement" value={orgStats.employeeEngagement} />
            <StatCard icon={IconTarget} label="Active Initiatives" value={orgStats.activeInitiatives} />
            <StatCard icon={IconUsers} label="Total Employees" value={orgStats.totalEmployees} />
            <StatCard icon={IconCalendar} label="Next Pickup" value={orgStats.nextPickupDate} />
          </SimpleGrid>
        </div>

        {/* Quick Actions */}
        <div>
          <Title order={3} mb="md" style={{ color: '#344e41' }}>Quick Actions</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
            <Paper p="md" radius="md" style={{ backgroundColor: '#f0f8f5', cursor: 'pointer', border: '2px solid #588157' }}>
              <Group>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
                  <IconTruck size={24} color="white" />
                </ThemeIcon>
                <div>
                  <Text fw={600} style={{ color: '#344e41' }}>Schedule Bulk Pickup</Text>
                  <Text size="sm" color="dimmed">Plan commercial waste collection</Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" radius="md" style={{ backgroundColor: '#f0f8f5', cursor: 'pointer', border: '2px solid #588157' }}>
              <Group>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
                  <IconTarget size={24} color="white" />
                </ThemeIcon>
                <div>
                  <Text fw={600} style={{ color: '#344e41' }}>Create Initiative</Text>
                  <Text size="sm" color="dimmed">Launch sustainability campaign</Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>
        </div>

        {/* Recent Activity */}
        <div>
          <Title order={3} mb="md" style={{ color: '#344e41' }}>Recent Activity</Title>
          <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
                <div>
                  <Text fw={600} style={{ color: '#344e41' }}>Waste Pickup Completed</Text>
                  <Text size="sm" color="dimmed">245 kg of mixed waste collected</Text>
                </div>
                <Text size="sm" fw={500} style={{ color: '#588157' }}>Nov 16</Text>
              </Group>

              <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
                <div>
                  <Text fw={600} style={{ color: '#344e41' }}>Employee Joined Initiative</Text>
                  <Text size="sm" color="dimmed">45 employees joined Paper Reduction Challenge</Text>
                </div>
                <Text size="sm" fw={500} style={{ color: '#588157' }}>Nov 15</Text>
              </Group>

              <Group justify="space-between">
                <div>
                  <Text fw={600} style={{ color: '#344e41' }}>ESG Report Generated</Text>
                  <Text size="sm" color="dimmed">Monthly sustainability report ready for review</Text>
                </div>
                <Text size="sm" fw={500} style={{ color: '#588157' }}>Nov 14</Text>
              </Group>
            </Stack>
          </Paper>
        </div>
      </Stack>
    </Container>
  );
}

export default OrganizationDashboardHome;
