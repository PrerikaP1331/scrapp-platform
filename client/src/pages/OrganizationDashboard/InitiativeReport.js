import React from 'react';
import { Container, Paper, Title, Stack, Grid, Card, Text, Progress, Group, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

function InitiativeReport() {
  const { id } = useParams();

  const initiativeStats = {
    title: 'Office E-Waste Collection Week',
    totalParticipants: 89,
    targetParticipants: 100,
    totalCollected: '580 kg',
    carbonOffset: '2.3 tonnes CO₂',
    costSavings: '₹5,800',
    completionRate: 89,
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">{initiativeStats.title} - Report</Title>
            <p style={{ color: '#666' }}>Campaign performance and impact summary</p>
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
              <Title order={3} style={{ color: '#588157' }}>{initiativeStats.totalParticipants}</Title>
              <Text size="xs" color="dimmed">of {initiativeStats.targetParticipants} target</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Total Collected</Text>
              <Title order={3} style={{ color: '#588157' }}>{initiativeStats.totalCollected}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Carbon Offset</Text>
              <Title order={3} style={{ color: '#588157' }}>{initiativeStats.carbonOffset}</Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="md">
              <Text size="sm" color="dimmed" fw={500} mb="xs">Cost Savings</Text>
              <Title order={3} style={{ color: '#588157' }}>{initiativeStats.costSavings}</Title>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Completion Rate */}
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="xs">Campaign Completion Rate</Text>
          <Progress
            value={initiativeStats.completionRate}
            color="#588157"
            size="lg"
            radius="md"
            label={`${initiativeStats.completionRate}% Complete`}
          />
        </Paper>

        {/* Impact Summary */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Impact Summary</Title>
          <Stack gap="md">
            <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Text fw={500}>Waste Diverted from Landfill</Text>
              <Text fw={600} style={{ color: '#588157' }}>{initiativeStats.totalCollected}</Text>
            </Group>
            <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Text fw={500}>CO₂ Emissions Reduced</Text>
              <Text fw={600} style={{ color: '#588157' }}>{initiativeStats.carbonOffset}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Estimated Cost Savings</Text>
              <Text fw={600} style={{ color: '#588157' }}>{initiativeStats.costSavings}</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default InitiativeReport;
