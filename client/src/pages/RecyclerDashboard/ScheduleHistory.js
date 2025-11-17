import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Title, Text, Stack, Group, Button, Badge, Card, Grid,
  Modal, Loader, Center, Alert, TextInput, Select, Table, ActionIcon, Tooltip,
  Menu, Tabs, SimpleGrid, Textarea, Checkbox, TagsInput, RingProgress, Avatar
} from '@mantine/core';
import {
  IconSearch, IconFilter, IconCalendar, IconList, IconCheck, IconX,
  IconAlertCircle, IconPhone, IconMapPin, IconClock, IconFileText,
  IconChevronDown, IconEye, IconTrash, IconEdit, IconPlus
} from '@tabler/icons-react';
import { Calendar } from '@mantine/dates';
import { getPickupsFiltered, acceptPickup, declinePickup, updatePickupStatus } from '../../api/recyclerService';
import styles from './ScheduleHistory.module.css';

function ScheduleHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // View toggle
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Selected date for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Details modal
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Action states
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch pickups based on filters
  useEffect(() => {
    fetchPickups();
  }, [statusFilter, startDate, endDate, searchQuery]);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
        startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        endDate: endDate ? endDate.toISOString().split('T')[0] : undefined
      };

      const data = await getPickupsFiltered(filters);
      setPickups(data.pickups || []);
    } catch (err) {
      console.error('Error fetching pickups:', err);
      setError(err.msg || 'Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  // Handle accept pickup
  const handleAcceptPickup = async (pickupId) => {
    try {
      setUpdatingId(pickupId);
      await acceptPickup(pickupId);
      setPickups(prev =>
        prev.map(p => p._id === pickupId ? { ...p, status: 'scheduled' } : p)
      );
    } catch (err) {
      setError(err.msg || 'Failed to accept pickup');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle decline pickup
  const handleDeclinePickup = async (pickupId) => {
    try {
      setUpdatingId(pickupId);
      await declinePickup(pickupId);
      setPickups(prev =>
        prev.map(p => p._id === pickupId ? { ...p, status: 'cancelled' } : p)
      );
    } catch (err) {
      setError(err.msg || 'Failed to decline pickup');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (pickupId, newStatus) => {
    try {
      setUpdatingId(pickupId);
      await updatePickupStatus(pickupId, newStatus);
      setPickups(prev =>
        prev.map(p => p._id === pickupId ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      setError(err.msg || 'Failed to update pickup status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open details modal
  const handleViewDetails = (pickup) => {
    setSelectedPickup(pickup);
    setNotes(pickup.notes || '');
    setDetailsModalOpen(true);
  };

  // Get pickups for selected date
  const getPickupsForDate = (date) => {
    return pickups.filter(p => {
      const pickupDate = new Date(p.date);
      return pickupDate.toDateString() === date.toDateString();
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      scheduled: '#588157',
      upcoming: '#a3b18a',
      'in-transit': '#3a5a40',
      completed: '#588157',
      cancelled: 'red'
    };
    return colors[status] || 'gray';
  };

  // Get pending count
  const pendingCount = pickups.filter(p => p.status === 'pending').length;

  // Calendar view
  if (viewMode === 'calendar') {
    const selectedDatePickups = getPickupsForDate(selectedDate);

    return (
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} style={{ color: '#344e41' }}>
                Schedule & History
              </Title>
              <Text size="sm" color="dimmed">
                View and manage your pickup schedule
              </Text>
            </div>
            <Group gap="xs">
              <Button
                variant={viewMode === 'calendar' ? 'filled' : 'light'}
                color="#588157"
                onClick={() => setViewMode('calendar')}
                leftSection={<IconCalendar size={16} />}
              >
                Calendar View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'filled' : 'light'}
                color="#588157"
                onClick={() => setViewMode('list')}
                leftSection={<IconList size={16} />}
              >
                List View
              </Button>
            </Group>
          </Group>

          <Grid gutter="lg">
            {/* Calendar */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="lg" radius="md" withBorder>
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  fullWidth
                  dayStyle={(date) => {
                    const pickupsOnDay = getPickupsForDate(date);
                    if (pickupsOnDay.length === 0) return {};

                    const completed = pickupsOnDay.filter(p => p.status === 'completed').length;
                    const total = pickupsOnDay.length;

                    if (completed === total) return { backgroundColor: '#588157', color: 'white' };
                    if (completed > 0) return { backgroundColor: '#a3b18a', color: 'white' };
                    return { backgroundColor: '#588157', color: 'white' };
                  }}
                />
              </Paper>
            </Grid.Col>

            {/* Selected Day Details */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                {/* Day Summary */}
                  <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#dad7cd' }}>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Title order={4} style={{ color: '#344e41' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </Title>
                    </div>
                  </Group>

                  {selectedDatePickups.length === 0 ? (
                    <Text color="dimmed" size="sm">No pickups scheduled for this day</Text>
                  ) : (
                    <SimpleGrid cols={3} gap="md">
                      <div>
                        <Text fw={500} size="sm" color="dimmed">Total Pickups</Text>
                        <Text size="xl" fw={700} style={{ color: '#344e41' }}>{selectedDatePickups.length}</Text>
                      </div>
                      <div>
                        <Text fw={500} size="sm" color="dimmed">Completed</Text>
                        <Text size="xl" fw={700} style={{ color: '#588157' }}>
                          {selectedDatePickups.filter(p => p.status === 'completed').length}
                        </Text>
                      </div>
                      <div>
                        <Text fw={500} size="sm" color="dimmed">Pending</Text>
                        <Text size="xl" fw={700} style={{ color: '#a3b18a' }}>
                          {selectedDatePickups.filter(p => p.status === 'pending').length}
                        </Text>
                      </div>
                    </SimpleGrid>
                  )}
                </Paper>

                {/* Pickups for Selected Day */}
                <Paper p="lg" radius="md" withBorder style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Pickups for Selected Day</Title>
                  <Stack gap="sm">
                    {selectedDatePickups.map(pickup => (
                      <Card key={pickup._id} withBorder p="md" radius="md">
                        <Group justify="space-between" mb="xs">
                          <div>
                            <Text fw={600} style={{ color: '#344e41' }}>{pickup.customerName}</Text>
                            <Text size="sm" color="dimmed">{pickup.city}</Text>
                          </div>
                          <Badge color={getStatusColor(pickup.status)}>
                            {pickup.status}
                          </Badge>
                        </Group>
                        <Group gap="xs" mb="md">
                          <Group gap={4}>
                            <IconClock size={14} color="#344e41" />
                            <Text size="sm">{pickup.timeSlot}</Text>
                          </Group>
                        </Group>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => handleViewDetails(pickup)}
                          fullWidth
                        >
                          View Details
                        </Button>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
  }

  // List view
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} style={{ color: '#344e41' }}>
              Schedule & History
            </Title>
            <Text size="sm" color="dimmed">
              View and manage your pickup schedule
            </Text>
          </div>
          <Group gap="xs">
            <Button
              variant={viewMode === 'calendar' ? 'filled' : 'light'}
              color="#588157"
              onClick={() => setViewMode('calendar')}
              leftSection={<IconCalendar size={16} />}
            >
              Calendar View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'filled' : 'light'}
              color="#588157"
              onClick={() => setViewMode('list')}
              leftSection={<IconList size={16} />}
            >
              List View
            </Button>
          </Group>
        </Group>

        {/* Filter Bar */}
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#dad7cd' }}>
          <Stack gap="md">
            <Group grow>
              {/* Status Filter */}
              <Select
                label="Filter by Status"
                placeholder="Select status"
                value={statusFilter}
                onChange={setStatusFilter}
                data={[
                  { value: 'all', label: 'All Pickups' },
                  { value: 'pending', label: `Pending Requests (${pendingCount})` },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'in-transit', label: 'In Transit' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                searchable
                clearable={false}
              />

              {/* Search Bar */}
              <TextInput
                placeholder="Search by customer name, address, or ID..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Group>

            <Group grow>
              {/* Date Range */}
              <div>
                <Text fw={500} size="sm" mb={4}>Start Date</Text>
                <TextInput
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setStartDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
                />
              </div>
              <div>
                <Text fw={500} size="sm" mb={4}>End Date</Text>
                <TextInput
                  type="date"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEndDate(e.currentTarget.value ? new Date(e.currentTarget.value) : null)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  variant="light"
                  onClick={() => {
                    setStatusFilter('pending');
                    setSearchQuery('');
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </div>
            </Group>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Center style={{ height: '400px' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="#344e41" />
              <Text>Loading pickups...</Text>
            </Stack>
          </Center>
        ) : pickups.length === 0 ? (
          <Alert icon={<IconAlertCircle />} title="No Results" color="#588157">
            No pickups found that match your criteria.
          </Alert>
        ) : (
          /* Pickups Table */
          <Paper radius="md" withBorder style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#dad7cd' }}>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Date & Time</Table.Th>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Customer</Table.Th>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Location</Table.Th>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Waste Types</Table.Th>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Status</Table.Th>
                  <Table.Th style={{ color: '#344e41', fontWeight: 600 }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pickups.map((pickup) => (
                  <Table.Tr key={pickup._id}>
                    <Table.Td>
                      <div>
                        <Text fw={500} size="sm">{new Date(pickup.date).toLocaleDateString()}</Text>
                        <Text size="xs" color="dimmed">{pickup.timeSlot}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} size="sm">{pickup.customerName}</Text>
                      <Text size="xs" color="dimmed">{pickup.customerPhone}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{pickup.city}, {pickup.address?.slice(0, 20)}...</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {pickup.wasteTypes.map(type => (
                          <Badge key={type} size="sm" variant="light">
                            {type}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(pickup.status)}>
                        {pickup.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {pickup.status === 'pending' ? (
                        <Group gap={4}>
                          <Tooltip label="Accept Pickup">
                            <ActionIcon
                              size="sm"
                              color="green"
                              variant="light"
                              onClick={() => handleAcceptPickup(pickup._id)}
                              loading={updatingId === pickup._id}
                            >
                              <IconCheck size={14} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Decline Pickup">
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="light"
                              onClick={() => handleDeclinePickup(pickup._id)}
                              loading={updatingId === pickup._id}
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      ) : (
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon size="sm" variant="light" color="#344e41">
                              <IconChevronDown size={14} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              icon={<IconEye size={14} />}
                              onClick={() => handleViewDetails(pickup)}
                            >
                              View Details
                            </Menu.Item>
                            {pickup.status !== 'completed' && pickup.status !== 'cancelled' && (
                              <>
                                <Menu.Item
                                  icon={<IconEdit size={14} />}
                                  onClick={() => handleStatusUpdate(pickup._id, 'completed')}
                                  disabled={updatingId === pickup._id}
                                >
                                  Mark Complete
                                </Menu.Item>
                                <Menu.Item
                                  icon={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleStatusUpdate(pickup._id, 'cancelled')}
                                  disabled={updatingId === pickup._id}
                                >
                                  Cancel Pickup
                                </Menu.Item>
                              </>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Stack>

      {/* Details Modal */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Pickup Details: ${selectedPickup?.customerName}`}
        size="lg"
      >
        {selectedPickup && (
          <Stack gap="md">
            {/* Customer Info */}
            <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
              <Title order={5} style={{ color: '#344e41' }} mb="md">Customer Information</Title>
              <SimpleGrid cols={2} gap="md">
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Name</Text>
                  <Text fw={600}>{selectedPickup.customerName}</Text>
                </div>
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Phone</Text>
                  <Text component="a" href={`tel:${selectedPickup.customerPhone}`} style={{ color: '#588157', textDecoration: 'none' }}>
                    {selectedPickup.customerPhone}
                  </Text>
                </div>
              </SimpleGrid>
            </div>

            {/* Address Info */}
            <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
              <Title order={5} style={{ color: '#344e41' }} mb="md">Pickup Location</Title>
              <Group gap="xs" mb="md">
                <IconMapPin size={16} color="#344e41" />
                <div>
                  <Text fw={500}>{selectedPickup.address}</Text>
                  <Text size="sm" color="dimmed">
                    {selectedPickup.city}, {selectedPickup.address?.split(',').pop() || 'Unknown'}
                  </Text>
                </div>
              </Group>
            </div>

            {/* Pickup Details */}
            <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
              <Title order={5} style={{ color: '#344e41' }} mb="md">Pickup Details</Title>
              <SimpleGrid cols={2} gap="md">
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Date</Text>
                  <Text>{new Date(selectedPickup.scheduledDate).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Time Slot</Text>
                  <Text>{selectedPickup.timeSlot}</Text>
                </div>
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Estimated Quantity</Text>
                  <Text>{selectedPickup.quantity}</Text>
                </div>
                <div>
                  <Text fw={500} size="sm" color="dimmed" mb={4}>Status</Text>
                  <Badge color={getStatusColor(selectedPickup.status)}>
                    {selectedPickup.status}
                  </Badge>
                </div>
              </SimpleGrid>
            </div>

            {/* Waste Types */}
            <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
              <Text fw={500} size="sm" color="dimmed" mb="md">Waste Types</Text>
              <Group gap="xs">
                {selectedPickup.wasteTypes.map(type => (
                  <Badge key={type} variant="light" color="#588157">
                    {type}
                  </Badge>
                ))}
              </Group>
            </div>

            {/* Special Instructions */}
            {selectedPickup.notes && (
              <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
                <Text fw={500} size="sm" color="dimmed" mb={4}>Special Instructions</Text>
                <Alert icon={<IconAlertCircle />} color="yellow">
                  {selectedPickup.notes}
                </Alert>
              </div>
            )}

            {/* Recycler Notes */}
            <div>
              <Text fw={500} size="sm" color="dimmed" mb="md">Your Notes</Text>
              <Textarea
                placeholder="Add private notes about this pickup..."
                value={notes}
                onChange={(e) => setNotes(e.currentTarget.value)}
                minRows={3}
              />
            </div>

            {/* Actions */}
            <Group justify="flex-end" pt="md">
              <Button
                variant="light"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedPickup.status === 'pending' && (
                <>
                  <Button
                    color="red"
                    onClick={() => {
                      handleDeclinePickup(selectedPickup._id);
                      setDetailsModalOpen(false);
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    color="green"
                    onClick={() => {
                      handleAcceptPickup(selectedPickup._id);
                      setDetailsModalOpen(false);
                    }}
                  >
                    Accept
                  </Button>
                </>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default ScheduleHistory;
