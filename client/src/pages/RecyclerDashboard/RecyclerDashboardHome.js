import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, SimpleGrid, Stack, Group, ThemeIcon, Badge, Button, Loader, Center, Modal, Alert } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  IconTrendingUp,
  IconMapPin,
  IconClock,
  IconMoneybag,
  IconAlertCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import apiClient from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

function RecyclerDashboardHome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/recycler/dashboard');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (pickupId) => {
    try {
      setProcessingId(pickupId);
      await apiClient.post(`/recycler/pickup/${pickupId}/accept`);
      fetchDashboardData();
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineRequest = async (pickupId) => {
    try {
      setProcessingId(pickupId);
      await apiClient.post(`/recycler/pickup/${pickupId}/decline`);
      fetchDashboardData();
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error declining request:', err);
      setError('Failed to decline request. Please try again.');
    } finally {
      setProcessingId(null);
    }
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

  if (loading) {
    return (
      <Container size="xl">
        <Center py={120}>
          <Loader color="#588157" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="lg">
        <Alert icon={<IconAlertCircle />} color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container size="xl" py="lg">
        <Alert icon={<IconAlertCircle />} color="yellow" title="No Data">
          Unable to load dashboard data. Please try refreshing the page.
        </Alert>
      </Container>
    );
  }

  const { kpis, newRequests, todaysSchedule, weeklyPerformance } = dashboardData;

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Welcome Section */}
        <Paper p="lg" radius="md" style={{ backgroundColor: '#f0f8f5', borderLeft: '4px solid #588157' }}>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">
            Welcome back, {kpis.businessName}!
          </Title>
          <Text color="dimmed">Here's your operational dashboard for today</Text>
        </Paper>

        {/* KPI Cards - Today's Snapshot */}
        <div>
          <Title order={3} mb="md" style={{ color: '#344e41' }}>Today's Snapshot</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} gap="md">
            <StatCard 
              icon={IconMapPin} 
              label="Pickups Scheduled Today" 
              value={kpis.todaysPickups} 
            />
            <StatCard 
              icon={IconClock} 
              label="New Pending Requests" 
              value={kpis.pendingRequests}
              color="#588157"
            />
            <StatCard 
              icon={IconMoneybag} 
              label="Earnings This Month" 
              value={`₹${kpis.monthlyEarnings}`}
              color="#059669"
            />
            <Button
              fullWidth
              size="lg"
              style={{ backgroundColor: '#588157', color: 'white' }}
              onClick={() => navigate('/recycler/route')}
            >
              View Today's Optimized Route →
            </Button>
          </SimpleGrid>
        </div>

        {/* Main Content Grid */}
        <SimpleGrid cols={{ base: 1, md: 2 }} gap="lg">
          {/* New Pickup Requests Widget */}
          <Paper p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={4} style={{ color: '#344e41' }}>
                Action Required: New Requests
              </Title>
              {newRequests.length > 0 && (
                <Badge color="#588157">{newRequests.length}</Badge>
              )}
            </Group>

            {newRequests.length === 0 ? (
              <Text color="dimmed" style={{ textAlign: 'center', padding: '20px' }}>
                No new pickup requests at this time.
              </Text>
            ) : (
              <Stack gap="md">
                {newRequests.slice(0, 4).map((request) => (
                  <Paper 
                    key={request._id} 
                    p="md" 
                    style={{ backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={500}>{request.customerName}</Text>
                        <Text size="sm" color="dimmed">{request.location}</Text>
                      </div>
                      <Badge size="sm" variant="light">
                        {request.wasteTypes.slice(0, 2).join(', ')}
                      </Badge>
                    </Group>
                    <Group justify="flex-end" gap="xs">
                      <Button 
                        size="xs" 
                        variant="default" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineRequest(request._id);
                        }}
                        loading={processingId === request._id}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="xs" 
                        style={{ backgroundColor: '#588157' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRequest(request._id);
                        }}
                        loading={processingId === request._id}
                      >
                        Accept
                      </Button>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}

            {newRequests.length > 4 && (
              <Group justify="center" mt="md">
                <Button 
                  variant="light" 
                  onClick={() => navigate('/recycler/schedule')}
                >
                  View All Requests
                </Button>
              </Group>
            )}
          </Paper>

          {/* Today's First Five Pickups Widget */}
          <Paper p="lg" radius="md" withBorder>
            <Title order={4} mb="lg" style={{ color: '#344e41' }}>
              Today's Schedule (First 5)
            </Title>

            {todaysSchedule.length === 0 ? (
              <Text color="dimmed" style={{ textAlign: 'center', padding: '20px' }}>
                No scheduled pickups for today.
              </Text>
            ) : (
              <Stack gap="md">
                {todaysSchedule.map((pickup, index) => (
                  <Paper 
                    key={pickup._id} 
                    p="md" 
                    style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #588157' }}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500} color="dimmed">{pickup.timeSlot}</Text>
                        <Text fw={500}>{pickup.customerName}</Text>
                        <Group gap="xs" mt="xs">
                          <IconMapPin size={14} color="#588157" />
                          <Text size="sm" color="dimmed">{pickup.location}</Text>
                        </Group>
                      </div>
                      <Badge color="#588157" variant="filled">
                        {pickup.status}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </SimpleGrid>

        {/* Recent Performance Mini-Chart */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} mb="lg" style={{ color: '#344e41' }}>
            Pickups This Week
          </Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyPerformance} onClick={() => navigate('/recycler/analytics')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pickups" fill="#588157" />
            </BarChart>
          </ResponsiveContainer>
          <Text size="sm" color="dimmed" style={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/recycler/analytics')}>
            Click to view full analytics →
          </Text>
        </Paper>
      </Stack>

      {/* Request Details Modal */}
      <Modal
        opened={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Pickup Request Details"
      >
        {selectedRequest && (
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">Customer Name</Text>
              <Text fw={500}>{selectedRequest.customerName}</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Location</Text>
              <Text fw={500}>{selectedRequest.location}</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Waste Types</Text>
              <Group gap="xs">
                {selectedRequest.wasteTypes.map((type, i) => (
                  <Badge key={i} variant="light">{type}</Badge>
                ))}
              </Group>
            </div>
            <Group grow pt="md">
              <Button 
                variant="default" 
                onClick={() => handleDeclineRequest(selectedRequest._id)}
                loading={processingId === selectedRequest._id}
              >
                Decline
              </Button>
              <Button 
                style={{ backgroundColor: '#588157' }}
                onClick={() => handleAcceptRequest(selectedRequest._id)}
                loading={processingId === selectedRequest._id}
              >
                Accept
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default RecyclerDashboardHome;
