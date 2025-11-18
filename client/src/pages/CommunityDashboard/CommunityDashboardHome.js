import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Grid,
  Group,
  ThemeIcon,
  SimpleGrid,
  Stack,
  Button,
  Progress,
  Modal,
  TextInput,
  Textarea,
  Badge,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconUsers,
  IconRecycle,
  IconTruck,
  IconClipboardList,
  IconCalendar,
  IconBell,
  IconMailPlus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as communityService from '../../api/communityService';

function CommunityDashboardHome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitingMessage, setInvitingMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [user?.communityId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const cid = user?.communityId;
      if (!cid) throw { msg: 'Community ID not found for admin' };
      const response = await communityService.getCommunityDashboard(cid);
      setDashboardData(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.msg || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResident = async () => {
    try {
      if (!inviteEmail.trim()) {
        setInviteError('Email is required');
        return;
      }
      setInviteLoading(true);
      setInviteError('');
      
      await communityService.inviteResident(
        communityId,
        inviteEmail,
        invitingMessage
      );
      
      setInviteEmail('');
      setInvitingMessage('');
      setInviteModalOpen(false);
      setInviteLoading(false);
      
      // Refresh dashboard to show updated member count
      await fetchDashboardData();
    } catch (err) {
      setInviteError(err.msg || 'Failed to send invitation');
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" style={{ height: '400px' }}>
          <Loader size="lg" color="#588157" />
          <Text color="dimmed">Loading dashboard...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle />} title="Error" color="red">
          No dashboard data available
        </Alert>
      </Container>
    );
  }

  const { community, admin, impactStats, engagementStats, upcomingEvents, recentActivity } = dashboardData;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Component 1: Welcome & Admin Action Bar */}
        <div>
          <Paper p="lg" radius="md" style={{ backgroundColor: '#f0f8f5', borderLeft: '4px solid #588157' }} mb="md">
            <Title order={2} style={{ color: '#344e41' }}>
              Welcome, {admin.name} - {community.name}
            </Title>
            <Text size="sm" color="dimmed" mt="xs">
              Manage your community's sustainability efforts and track collective impact
            </Text>
          </Paper>

          {/* Action Bar */}
          <Group gap="sm" justify="flex-start">
            <Button
              leftSection={<IconTruck size={16} />}
              style={{ backgroundColor: '#588157' }}
              onClick={() => navigate(`/community-dashboard/schedule`)}
            >
              + Schedule Community Pickup
            </Button>
            <Button
              leftSection={<IconRecycle size={16} />}
              variant="light"
              onClick={() => navigate(`/community-dashboard/drives/new`)}
            >
              📢 Announce a New Drive
            </Button>
            <Button
              leftSection={<IconMailPlus size={16} />}
              variant="light"
              onClick={() => setInviteModalOpen(true)}
            >
              ✉️ Invite New Residents
            </Button>
          </Group>
        </div>

        {/* Component 2: Our Community's Impact Card */}
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fafafa', cursor: 'pointer' }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Our Community's Impact
              </Text>
              <Title order={3} style={{ color: '#344e41' }}>
                Environmental Contribution
              </Title>
            </div>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
              <IconTrendingUp size={24} color="white" />
            </ThemeIcon>
          </Group>

          <Grid gutter="lg" mb="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Stack gap="xs">
                <Text size="sm" color="dimmed">Total CO₂ Saved</Text>
                <Text size="xl" fw={700} style={{ color: '#588157' }}>
                  {impactStats.co2Saved} kg
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Stack gap="xs">
                <Text size="sm" color="dimmed">Total Waste Diverted</Text>
                <Text size="xl" fw={700} style={{ color: '#588157' }}>
                  {impactStats.wasteDiverted} kg
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Stack gap="xs">
                <Text size="sm" color="dimmed">Pickups Completed</Text>
                <Text size="xl" fw={700} style={{ color: '#588157' }}>
                  {impactStats.pickupsCompleted}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>

          <Button
            variant="subtle"
            onClick={() => navigate(`/community-dashboard/report`)}
            fullWidth
          >
            View Detailed Report →
          </Button>
        </Paper>

        {/* Component 3: Resident Engagement Card */}
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fafafa' }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Text size="sm" color="dimmed" fw={500} mb="xs">
                Resident Engagement
              </Text>
              <Title order={3} style={{ color: '#344e41' }}>
                Community Health Status
              </Title>
            </div>
            <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
              <IconUsers size={24} color="white" />
            </ThemeIcon>
          </Group>

          <Stack gap="lg">
            {/* Active Residents */}
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Active Residents</Text>
                <Text fw={600} style={{ color: '#588157' }}>
                  {engagementStats.activeResidents} / {engagementStats.totalHouseholds}
                </Text>
              </Group>
              <Progress
                value={(engagementStats.activeResidents / engagementStats.totalHouseholds) * 100}
                color="#588157"
                size="md"
              />
            </div>

            {/* Participation Rate */}
            <div>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Participation Rate</Text>
                <Badge size="lg" style={{ backgroundColor: '#588157' }}>
                  {engagementStats.participationRate}%
                </Badge>
              </Group>
              <Progress
                value={engagementStats.participationRate}
                color="#588157"
                size="md"
              />
            </div>

            {/* Pending Requests */}
            <Paper
              p="md"
              radius="md"
              style={{ backgroundColor: '#fff3cd', cursor: 'pointer' }}
              onClick={() => navigate(`/community-dashboard/members`)}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="md" style={{ backgroundColor: '#f0ad4e' }}>
                    <IconClipboardList size={16} color="white" />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} style={{ color: '#333' }}>
                      Pending Join Requests
                    </Text>
                    <Text size="sm" color="dimmed">
                      {engagementStats.pendingRequests} new request{engagementStats.pendingRequests !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </Group>
                <Badge size="lg" color="yellow">
                  {engagementStats.pendingRequests}
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Paper>

        {/* Component 4 & 5: Events and Activity in Grid */}
        <Grid gutter="lg">
          {/* Upcoming Events Widget */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fafafa', height: '100%' }}>
              <Group justify="space-between" align="flex-start" mb="md">
                <div>
                  <Text size="sm" color="dimmed" fw={500}>
                    What's Coming Up
                  </Text>
                  <Title order={4} style={{ color: '#344e41' }}>
                    Upcoming Events
                  </Title>
                </div>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
                  <IconCalendar size={24} color="white" />
                </ThemeIcon>
              </Group>

              <Stack gap="md">
                {upcomingEvents.map((event, index) => (
                  <Group key={event.id} justify="space-between" pb={index < upcomingEvents.length - 1 ? 'md' : 0} style={{
                    borderBottom: index < upcomingEvents.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}>
                    <div>
                      <Text fw={600} style={{ color: '#344e41' }}>
                        {event.title}
                      </Text>
                      <Text size="sm" color="dimmed">
                        {event.description}
                      </Text>
                    </div>
                  </Group>
                ))}
              </Stack>

              <Button
                variant="subtle"
                onClick={() => navigate(`/community-dashboard/drives`)}
                fullWidth
                mt="md"
              >
                View All Drives →
              </Button>
            </Paper>
          </Grid.Col>

          {/* Recent Activity Widget */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#fafafa', height: '100%' }}>
              <Group justify="space-between" align="flex-start" mb="md">
                <div>
                  <Text size="sm" color="dimmed" fw={500}>
                    Community Pulse
                  </Text>
                  <Title order={4} style={{ color: '#344e41' }}>
                    Recent Activity
                  </Title>
                </div>
                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: '#588157' }}>
                  <IconBell size={24} color="white" />
                </ThemeIcon>
              </Group>

              <Stack gap="md">
                {recentActivity.map((activity, index) => (
                  <Group key={activity.id} justify="space-between" pb={index < recentActivity.length - 1 ? 'md' : 0} style={{
                    borderBottom: index < recentActivity.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}>
                    <Group gap="xs">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        style={{
                          backgroundColor: activity.type === 'approval' ? '#d4edda' :
                                         activity.type === 'member_joined' ? '#cfe2ff' :
                                         activity.type === 'drive_completed' ? '#e8f5e9' :
                                         '#fff3cd'
                        }}
                      >
                        {activity.type === 'approval' && <IconClipboardList size={16} color="#155724" />}
                        {activity.type === 'member_joined' && <IconUsers size={16} color="#004085" />}
                        {activity.type === 'drive_completed' && <IconRecycle size={16} color="#1b5e20" />}
                        {activity.type === 'pickup_scheduled' && <IconTruck size={16} color="#856404" />}
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm" style={{ color: '#344e41' }}>
                          {activity.action}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {new Date(activity.timestamp).toLocaleDateString()} • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </div>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Invite Residents Modal */}
      <Modal
        opened={inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
          setInviteEmail('');
          setInvitingMessage('');
          setInviteError('');
        }}
        title="Invite New Residents"
        size="md"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Resident Email Address"
            placeholder="Enter email to invite"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.currentTarget.value)}
            disabled={inviteLoading}
          />

          <Textarea
            label="Personal Message (Optional)"
            placeholder="Add a message to your invitation"
            value={invitingMessage}
            onChange={(e) => setInvitingMessage(e.currentTarget.value)}
            minRows={3}
            maxRows={5}
            disabled={inviteLoading}
          />

          {inviteError && (
            <Alert icon={<IconAlertCircle />} color="red">
              {inviteError}
            </Alert>
          )}

          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                setInviteModalOpen(false);
                setInviteEmail('');
                setInvitingMessage('');
                setInviteError('');
              }}
              disabled={inviteLoading}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#588157' }}
              onClick={handleInviteResident}
              loading={inviteLoading}
            >
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default CommunityDashboardHome;
