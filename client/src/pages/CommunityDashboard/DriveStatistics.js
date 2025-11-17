import React from 'react';
import { Container, Paper, Title, Stack, Grid, Card, Text, Progress, Group, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

function DriveStatistics() {
  const { id } = useParams();

  // Mock data - replace with API call
  const driveStats = {
    title: 'E-waste Drive',
    totalParticipants: 87,
    totalCollected: '580 kg',
    targetQuantity: 500,
    wasteBreakdown: [
      { category: 'Phones & Tablets', quantity: 245, color: '#588157' },
      { category: 'Computers & Laptops', quantity: 180, color: '#a3b18a' },
      { category: 'Cables & Accessories', quantity: 95, color: '#3a5a40' },
      { category: 'Other Electronics', quantity: 60, color: '#d4d4a8' },
    ],
    dailyProgress: [
      { date: 'Day 1', collected: 150 },
      { date: 'Day 2', collected: 245 },
      { date: 'Day 3', collected: 185 },
    ],
  };

  const percentageComplete = (driveStats.totalCollected.split(' ')[0] / driveStats.targetQuantity) * 100;

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">{driveStats.title} - Statistics</Title>
            <p style={{ color: '#666' }}>Detailed report of drive performance and results</p>
          </div>
          <Button leftSection={<IconDownload size={18} />} variant="default">
            Download Report
          </Button>
        </Group>

        {/* Key Metrics */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Total Participants</Text>
              <Title order={3} style={{ color: '#588157' }}>{driveStats.totalParticipants}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Total Collected</Text>
              <Title order={3} style={{ color: '#588157' }}>{driveStats.totalCollected}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Target Quantity</Text>
              <Title order={3} style={{ color: '#344e41' }}>{driveStats.targetQuantity} kg</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Goal Achievement</Text>
              <Title order={3} style={{ color: '#588157' }}>{percentageComplete.toFixed(0)}%</Title>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Progress Bar */}
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="xs">Collection Progress</Text>
          <Progress
            value={percentageComplete}
            color="#588157"
            size="lg"
            radius="md"
            label={`${percentageComplete.toFixed(1)}% of target`}
          />
        </Paper>

        {/* Waste Breakdown */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Waste Type Breakdown</Title>
          <Grid>
            {driveStats.wasteBreakdown.map((item, idx) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={idx}>
                <Card withBorder p="md" radius="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{item.category}</Text>
                    <Text fw={600} style={{ color: item.color }}>{item.quantity} kg</Text>
                  </Group>
                  <Progress
                    value={(item.quantity / parseInt(driveStats.totalCollected)) * 100}
                    color={item.color}
                    size="sm"
                    radius="md"
                  />
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>

        {/* Daily Collection Progress */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Daily Collection Progress</Title>
          <Stack gap="md">
            {driveStats.dailyProgress.map((item, idx) => (
              <div key={idx}>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{item.date}</Text>
                  <Text fw={600} style={{ color: '#588157' }}>{item.collected} kg</Text>
                </Group>
                <Progress value={(item.collected / 250) * 100} color="#588157" size="md" radius="md" />
              </div>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default DriveStatistics;
