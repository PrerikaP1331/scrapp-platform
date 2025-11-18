import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, Stack, Group, Text, Title, Badge, Button, SimpleGrid, Skeleton, Alert, ActionIcon } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX, IconTrendingUp, IconArrowRight } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './RecyclerDashboard.module.css';

// KPI Card Component
const KPICard = ({ icon: Icon, label, value, unit, color, action }) => (
  <Card withBorder p="lg" className={styles.kpiCard} style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
    <Group justify="space-between" mb="sm">
      <div>
        <Text size="sm" c="dimmed" fw={500}>{label}</Text>
        <Group align="baseline" gap="xs">
          <Text size="xl" fw={700}>{value}</Text>
          {unit && <Text size="sm" c="dimmed">{unit}</Text>}
        </Group>
      </div>
      {Icon && <Icon size={32} color={color} opacity={0.7} />}
    </Group>
    {action && <Button size="xs" variant="light" fullWidth mt="md">{action}</Button>}
  </Card>
);

// Pickup Request Card
const RequestCard = ({ request, onAccept, onDecline, loading }) => (
  <Card withBorder p="md" className={styles.requestCard}>
    <Group justify="space-between" mb="xs">
      <div>
        <Text fw={600}>{request.customerName}</Text>
        <Text size="sm" c="dimmed">{request.location}</Text>
      </div>
      <Badge variant="light" size="sm">New</Badge>
    </Group>
    <Group gap="xs" mb="md">
      {request.wasteTypes.map((type) => (
        <Badge key={type} size="sm" variant="outline">{type}</Badge>
      ))}
    </Group>
    <Group grow>
      <Button
        size="sm"
        color="green"
        leftSection={<IconCheck size={14} />}
        onClick={() => onAccept(request._id)}
        loading={loading}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant="light"
        color="gray"
        leftSection={<IconX size={14} />}
        onClick={() => onDecline(request._id)}
        loading={loading}
      >
        Decline
      </Button>
    </Group>
  </Card>
);

// Today's Pickup Card
const TodayPickupCard = ({ pickup }) => (
  <Card withBorder p="md" className={styles.pickupCard}>
    <Group justify="space-between" mb="xs">
      <Text fw={600} size="lg">{pickup.timeSlot}</Text>
      <Badge size="sm" color="#588157">{pickup.status}</Badge>
    </Group>
    <Text fw={500} mb="xs">{pickup.customerName}</Text>
    <Text size="sm" c="dimmed">{pickup.location}</Text>
    <Group gap="xs" mt="md">
      {pickup.wasteTypes.map((type) => (
        <Badge key={type} size="xs" variant="outline">{type}</Badge>
      ))}
    </Group>
  </Card>
);

const RecyclerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/recycler/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.response?.data?.msg || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (pickupId) => {
    try {
      setActionLoading(pickupId);
      await axios.post(`/recycler/pickup/${pickupId}/accept`);
      fetchDashboard(); // Refresh data
    } catch (err) {
      console.error('Error accepting pickup:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (pickupId) => {
    try {
      setActionLoading(pickupId);
      await axios.post(`/recycler/pickup/${pickupId}/decline`);
      fetchDashboard(); // Refresh data
    } catch (err) {
      console.error('Error declining pickup:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="lg">
        <Stack gap="lg">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={100} radius="md" />)}
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="lg">
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  const { kpis, newRequests, todaysSchedule, weeklyPerformance } = data;

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={2}>Welcome back, {kpis.businessName}!</Title>
          <Text c="dimmed">Here's your daily overview</Text>
        </div>

        {/* KPI Row - Today's Snapshot */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <KPICard
            label="Pickups Today"
            value={kpis.todaysPickups}
            unit="scheduled"
            color="#588157"
          />
          <KPICard
            label="New Requests"
            value={kpis.pendingRequests}
            unit="pending"
            color="#3a5a40"
            action="View All"
          />
          <KPICard
            label="Earnings This Month"
            value={`₹${kpis.monthlyEarnings}`}
            color="#a3b18a"
          />
          <Button
            size="lg"
            variant="filled"
            fullWidth
            rightSection={<IconArrowRight size={16} />}
            onClick={() => navigate('/recycler/route')}
            className={styles.ctaButton}
            classNames={{ label: styles.ctaLabel }}
            style={{
              background: 'linear-gradient(135deg, #588157 0%, #3a5a40 100%)',
              color: '#ffffff',
              border: 'none',
              minHeight: '56px',
              marginTop: '8px'
            }}
          >
            View Today's Route
          </Button>
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid gutter="lg">
          {/* New Requests Widget */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" className={styles.widget}>
              <Card.Section withBorder inheritPadding py="md">
                <Group justify="space-between">
                  <Title order={3}>Action Required: New Requests</Title>
                  {newRequests.length > 0 && <Badge styles={{root:{backgroundColor:'#a3b18a', color:'#344e41'}}}>{newRequests.length}</Badge>}
                </Group>
              </Card.Section>
              <Card.Section inheritPadding py="md">
                {newRequests.length > 0 ? (
                  <Stack gap="md">
                    {newRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        loading={actionLoading === request._id}
                      />
                    ))}
                    {newRequests.length > 0 && (
                      <Button
                        variant="light"
                        fullWidth
                        onClick={() => navigate('/recycler/schedule')}
                      >
                        View All Requests →
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Alert icon={<IconAlertCircle size={16} />} color="#588157">
                    No new pickup requests at this time.
                  </Alert>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>

          {/* Today's Schedule Widget */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" className={styles.widget}>
              <Card.Section withBorder inheritPadding py="md">
                <Title order={3}>Today's Schedule (First 5)</Title>
              </Card.Section>
              <Card.Section inheritPadding py="md">
                {todaysSchedule.length > 0 ? (
                  <Stack gap="md">
                    {todaysSchedule.map((pickup) => (
                      <TodayPickupCard key={pickup._id} pickup={pickup} />
                    ))}
                  </Stack>
                ) : (
                  <Alert icon={<IconAlertCircle size={16} />} color="#588157">
                    No pickups scheduled for today.
                  </Alert>
                )}
              </Card.Section>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Weekly Performance Chart */}
        <Card withBorder p="lg" className={styles.widget}>
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between">
              <Title order={3}>Pickups This Week</Title>
              <ActionIcon
                variant="light"
                onClick={() => navigate('/recycler/analytics')}
                title="View full analytics"
              >
                <IconTrendingUp size={16} />
              </ActionIcon>
            </Group>
          </Card.Section>
          <Card.Section inheritPadding py="md">
            {weeklyPerformance && weeklyPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pickups" fill="#588157" name="Completed Pickups" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert icon={<IconAlertCircle size={16} />} color="#588157">
                No performance data available
              </Alert>
            )}
          </Card.Section>
        </Card>
      </Stack>
    </Container>
  );
};

export default RecyclerDashboard;
