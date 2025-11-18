import React from 'react';
import { Container, Title, Stack, Grid, Card, Text, Progress, Group, Button, Paper } from '@mantine/core';
import { IconDownload, IconTrendingUp } from '@tabler/icons-react';

function ESGReport() {
  const esgMetrics = {
    wasteRecycled: '12,450 kg',
    wasteReduced: '2,890 kg',
    hazardousWaste: '156 kg',
    totalWasteDiversion: 86,
    carbonOffset: '49.8 tonnes CO₂e',
    energySavings: '2,345 kWh',
    waterSavings: '45,000 liters',
    costSavings: '₹1,24,500',
    employeeEngagement: 92,
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">ESG Report</Title>
            <p style={{ color: '#666' }}>Corporate sustainability metrics and environmental impact</p>
          </div>
          <Button leftSection={<IconDownload size={18} />} variant="default">
            Download Report
          </Button>
        </Group>

        {/* Environmental Metrics */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Environmental Impact</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="lg" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Waste Recycled</Text>
                <Title order={3} style={{ color: '#588157' }}>{esgMetrics.wasteRecycled}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="lg" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Waste Reduced</Text>
                <Title order={3} style={{ color: '#588157' }}>{esgMetrics.wasteReduced}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="lg" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Hazardous Waste Managed</Text>
                <Title order={3} style={{ color: '#588157' }}>{esgMetrics.hazardousWaste}</Title>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Waste Diversion Rate */}
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="xs">Overall Waste Diversion Rate</Text>
          <Progress
            value={esgMetrics.totalWasteDiversion}
            color="#588157"
            size="lg"
            radius="md"
            label={`${esgMetrics.totalWasteDiversion}%`}
          />
        </Paper>

        {/* Carbon & Energy Metrics */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Carbon & Energy Savings</Title>
          <Stack gap="md">
            <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Text fw={500}>CO₂ Emissions Offset</Text>
              <Group gap="xs">
                <IconTrendingUp size={18} color="#588157" />
                <Text fw={600} style={{ color: '#588157' }}>{esgMetrics.carbonOffset}</Text>
              </Group>
            </Group>
            <Group justify="space-between" pb="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Text fw={500}>Energy Saved</Text>
              <Group gap="xs">
                <IconTrendingUp size={18} color="#588157" />
                <Text fw={600} style={{ color: '#588157' }}>{esgMetrics.energySavings}</Text>
              </Group>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Water Conserved</Text>
              <Group gap="xs">
                <IconTrendingUp size={18} color="#588157" />
                <Text fw={600} style={{ color: '#588157' }}>{esgMetrics.waterSavings}</Text>
              </Group>
            </Group>
          </Stack>
        </Paper>

        {/* Financial & Social Impact */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Financial & Social Impact</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder p="lg" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Cost Savings</Text>
                <Title order={3} style={{ color: '#588157' }}>{esgMetrics.costSavings}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder p="lg" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Employee Engagement</Text>
                <Group>
                  <Title order={3} style={{ color: '#588157' }}>{esgMetrics.employeeEngagement}%</Title>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* ESG Goals */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">2026 ESG Goals Progress</Title>
          <Stack gap="md">
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Zero-Waste Goal (95% diversion)</Text>
                <Text fw={600}>{esgMetrics.totalWasteDiversion}%</Text>
              </Group>
              <Progress value={esgMetrics.totalWasteDiversion} color="#588157" size="md" />
            </div>
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Carbon Neutrality (100 tonnes offset)</Text>
                <Text fw={600}>{parseFloat(esgMetrics.carbonOffset)}%</Text>
              </Group>
              <Progress value={49.8} color="#588157" size="md" />
            </div>
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Employee Participation (95%)</Text>
                <Text fw={600}>{esgMetrics.employeeEngagement}%</Text>
              </Group>
              <Progress value={esgMetrics.employeeEngagement} color="#588157" size="md" />
            </div>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default ESGReport;
