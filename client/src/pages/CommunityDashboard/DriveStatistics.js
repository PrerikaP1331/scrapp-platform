import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Stack,
  Group,
  Grid,
  Card,
  Text,
  Progress,
  Badge,
  LoadingOverlay,
  SimpleGrid,
  Divider,
  List,
  ThemeIcon
} from '@mantine/core';
import {
  IconChartBar,
  IconUsers,
  IconWeight,
  IconRecycle,
  IconCalendar,
  IconTrendingUp,
  IconAward,
  IconDownload
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDriveStats } from '../../api/driveService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function DriveStatistics() {
  const navigate = useNavigate();
  const { driveId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDriveStats();
  }, [driveId]);

  const fetchDriveStats = async () => {
    try {
      setLoading(true);
      const cid = user?.communityId;
      const response = await getDriveStats(cid, driveId);
      setStats(response);
    } catch (error) {
      console.error('Error fetching drive stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Container size="lg">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  const { drive, participants, totalWeight, wasteBreakdown, topItems, participationRate } = stats;

  return (
    <Container size="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">
              Drive Statistics
            </Title>
            <Text size="lg" fw={600}>{drive.title}</Text>
            <Text size="sm" c="dimmed">
              {new Date(drive.date).toLocaleDateString()} • {typeof drive.location === 'string' ? drive.location : (drive.location?.venue || '')}
            </Text>
          </div>
          <Group gap="md">
            <Button 
              variant="subtle" 
              onClick={() => navigate('/community-dashboard/drives')}
            >
              Back to Drives
            </Button>
            <Button 
              leftSection={<IconDownload size={16} />}
              style={{ backgroundColor: '#588157' }}
            >
              Export Report
            </Button>
          </Group>
        </Group>

        {/* Key Metrics */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          <Card withBorder radius="md" p="lg">
            <Group justify="space-between" align="center" mb="md">
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }}>
                <IconUsers style={{ color: '#588157' }} />
              </ThemeIcon>
              <Badge color="green" variant="light">
                {participationRate}%
              </Badge>
            </Group>
            <Text size="xl" fw={700} style={{ color: '#588157' }}>
              {participants.total}
            </Text>
            <Text size="sm" c="dimmed">Total Participants</Text>
            <Text size="xs" c="dimmed" mt={4}>
              {participants.households} households participated
            </Text>
          </Card>

          <Card withBorder radius="md" p="lg">
            <Group justify="space-between" align="center" mb="md">
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }}>
                <IconWeight style={{ color: '#588157' }} />
              </ThemeIcon>
              <IconTrendingUp size={16} style={{ color: '#588157' }} />
            </Group>
            <Text size="xl" fw={700} style={{ color: '#588157' }}>
              {totalWeight} kg
            </Text>
            <Text size="sm" c="dimmed">Total Weight Collected</Text>
            <Text size="xs" c="dimmed" mt={4}>
              Average {Math.round(totalWeight / participants.total)} kg per participant
            </Text>
          </Card>

          <Card withBorder radius="md" p="lg">
            <Group justify="space-between" align="center" mb="md">
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }}>
                <IconRecycle style={{ color: '#588157' }} />
              </ThemeIcon>
              <IconAward size={16} style={{ color: '#588157' }} />
            </Group>
            <Text size="xl" fw={700} style={{ color: '#588157' }}>
              {wasteBreakdown.length}
            </Text>
            <Text size="sm" c="dimmed">Waste Categories</Text>
            <Text size="xs" c="dimmed" mt={4}>
              Multiple types recycled
            </Text>
          </Card>

          <Card withBorder radius="md" p="lg">
            <Group justify="space-between" align="center" mb="md">
              <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }}>
                <IconChartBar style={{ color: '#588157' }} />
              </ThemeIcon>
              <Badge color="blue" variant="light">
                Success
              </Badge>
            </Group>
            <Text size="xl" fw={700} style={{ color: '#588157' }}>
              {drive.status === 'completed' ? 'Completed' : 'Active'}
            </Text>
            <Text size="sm" c="dimmed">Drive Status</Text>
            <Text size="xs" c="dimmed" mt={4}>
              {drive.visibility} visibility
            </Text>
          </Card>
        </SimpleGrid>

        {/* Waste Breakdown */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder radius="md" p="lg">
              <Title order={4} mb="md">Waste Collection Breakdown</Title>
              
              <Stack gap="md">
                {wasteBreakdown.map((item, index) => (
                  <div key={item.category}>
                    <Group justify="space-between" mb={8}>
                      <Text fw={500}>{item.category}</Text>
                      <Text fw={600}>{item.weight} kg</Text>
                    </Group>
                    <Progress 
                      value={(item.weight / totalWeight) * 100} 
                      color={['green', 'blue', 'orange', 'red', 'purple', 'yellow'][index % 6]}
                      size="lg"
                    />
                    <Text size="xs" c="dimmed" mt={4}>
                      {Math.round((item.weight / totalWeight) * 100)}% of total collection
                    </Text>
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md" p="lg">
              <Title order={4} mb="md">Top Items Collected</Title>
              
              <List spacing="sm">
                {topItems.map((item, index) => (
                  <List.Item
                    key={item.name}
                    icon={
                      <ThemeIcon size="sm" radius="xl" color={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}>
                        {index + 1}
                      </ThemeIcon>
                    }
                  >
                    <Group justify="space-between">
                      <Text size="sm">{item.name}</Text>
                      <Text size="sm" fw={600}>{item.count}</Text>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Participation Timeline */}
        <Card withBorder radius="md" p="lg">
          <Title order={4} mb="md">Participation Timeline</Title>
          
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            <div>
              <Text fw={600} mb="xs">Peak Participation</Text>
              <Text size="xl" style={{ color: '#588157' }}>
                {participants.peakTime || '2:00 PM'}
              </Text>
              <Text size="sm" c="dimmed">Most active hour</Text>
            </div>
            
            <div>
              <Text fw={600} mb="xs">Average Stay</Text>
              <Text size="xl" style={{ color: '#588157' }}>
                {participants.avgStay || '15'} min
              </Text>
              <Text size="sm" c="dimmed">Per participant</Text>
            </div>
            
            <div>
              <Text fw={600} mb="xs">Completion Rate</Text>
              <Text size="xl" style={{ color: '#588157' }}>
                {participants.completionRate || '98'}%
              </Text>
              <Text size="sm" c="dimmed">Successful drop-offs</Text>
            </div>
          </SimpleGrid>
        </Card>

        {/* Environmental Impact */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          <Card withBorder radius="md" p="lg">
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }} mb="md">
              <IconRecycle style={{ color: '#588157' }} />
            </ThemeIcon>
            <Text fw={600} mb="xs">CO₂ Emissions Prevented</Text>
            <Text size="xl" style={{ color: '#588157' }}>
              {Math.round(totalWeight * 2.5)} kg
            </Text>
            <Text size="sm" c="dimmed">Equivalent to planting {Math.round(totalWeight * 0.1)} trees</Text>
          </Card>

          <Card withBorder radius="md" p="lg">
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }} mb="md">
              <IconTrendingUp style={{ color: '#588157' }} />
            </ThemeIcon>
            <Text fw={600} mb="xs">Landfill Space Saved</Text>
            <Text size="xl" style={{ color: '#588157' }}>
              {Math.round(totalWeight * 0.8)} m³
            </Text>
            <Text size="sm" c="dimmed">Waste diverted from landfills</Text>
          </Card>

          <Card withBorder radius="md" p="lg">
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#e8f5e8' }} mb="md">
              <IconAward style={{ color: '#588157' }} />
            </ThemeIcon>
            <Text fw={600} mb="xs">Community Impact Score</Text>
            <Text size="xl" style={{ color: '#588157' }}>
              {Math.min(100, Math.round(participants.total * 2 + totalWeight * 0.5))}
            </Text>
            <Text size="sm" c="dimmed">Based on participation and collection</Text>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export default DriveStatistics;
