import React from 'react';
import { Container, Paper, Title, Grid, Card, Text, Select, Group, Button, Stack, Progress } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

function CommunityImpactReport() {
  const impactData = {
    totalCO2Saved: '2,340 kg',
    totalWasteCollected: '15,600 kg',
    activeParticipants: 152,
    activitiesCompleted: 24,
  };

  const monthlyData = [
    { month: 'August', collected: 1200, co2: 180 },
    { month: 'September', collected: 1450, co2: 217 },
    { month: 'October', collected: 1680, co2: 252 },
    { month: 'November', collected: 1570, co2: 235 },
  ];

  const wasteBreakdown = [
    { waste: 'Plastic', quantity: 4200 },
    { waste: 'Paper', quantity: 3800 },
    { waste: 'Glass', quantity: 3100 },
    { waste: 'Metal', quantity: 2400 },
    { waste: 'E-waste', quantity: 2100 },
  ];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Community Impact Report</Title>
            <p style={{ color: '#666' }}>Detailed analytics of your community's collective recycling performance</p>
          </div>
          <Button leftSection={<IconDownload size={18} />} variant="default">
            Download Report
          </Button>
        </Group>

        {/* Key Metrics */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Total CO₂ Saved</Text>
              <Title order={3} style={{ color: '#588157' }}>{impactData.totalCO2Saved}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Total Waste Collected</Text>
              <Title order={3} style={{ color: '#588157' }}>{impactData.totalWasteCollected}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Active Participants</Text>
              <Title order={3} style={{ color: '#344e41' }}>{impactData.activeParticipants}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Activities Completed</Text>
              <Title order={3} style={{ color: '#344e41' }}>{impactData.activitiesCompleted}</Title>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Monthly Trend */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Monthly Collection Trend</Title>
          <Stack gap="md">
            {monthlyData.map((item, idx) => (
              <div key={idx}>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{item.month}</Text>
                  <Text fw={600} style={{ color: '#588157' }}>{item.collected} kg</Text>
                </Group>
                <Progress value={(item.collected / 1700) * 100} color="#588157" size="md" radius="md" />
              </div>
            ))}
          </Stack>
        </Paper>

        {/* Waste Type Breakdown */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Waste Type Breakdown</Title>
          <Stack gap="md">
            {wasteBreakdown.map((item, idx) => (
              <div key={idx}>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{item.waste}</Text>
                  <Text fw={600} style={{ color: '#588157' }}>{item.quantity} kg</Text>
                </Group>
                <Progress value={(item.quantity / 4200) * 100} color="#588157" size="md" radius="md" />
              </div>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default CommunityImpactReport;
