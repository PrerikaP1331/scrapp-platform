import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  Button,
  Modal,
  Badge,
  Group,
  Text,
  TextInput,
  Select,
  Loader,
  Center,
  Pagination,
  Card,
  SimpleGrid,
  ActionIcon,
  Grid,
  Stack,
  ThemeIcon,
  RingProgress,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconSearch,
  IconDownload,
  IconCalendar,
  IconList,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCheck,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { getPickupsFiltered } from '../../api/recyclerService';
import classes from './ScheduleHistory.module.css';

const ScheduleHistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // View toggle
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchPickups();
  }, [search, statusFilter, dateRange]);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (dateRange[0]) filters.startDate = dateRange[0].toISOString().split('T')[0];
      if (dateRange[1]) filters.endDate = dateRange[1].toISOString().split('T')[0];

      const response = await getPickupsFiltered(filters);
      setPickups(response.pickups || []);
      setError(null);
    } catch (err) {
      setError(err.msg || 'Failed to fetch pickups');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const csv = [
      ['Date', 'Time', 'Customer', 'Location', 'Waste Types', 'Status'].join(','),
      ...filteredPickups.map(p =>
        [
          p.date,
          p.time,
          p.customerName,
          p.address,
          p.wasteTypes.join('; '),
          p.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (pickup) => {
    setSelectedPickup(pickup);
    setOpened(true);
  };

  // Filter pickups
  const filteredPickups = pickups.filter(p => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Get pickups for selected date (Calendar view)
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const pickupsForDate = filteredPickups.filter(p => p.date === selectedDateStr);

  // Pagination for list view
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPickups = filteredPickups.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage);

  // Calendar data - count pickups per day
  const pickupsByDate = {};
  filteredPickups.forEach(p => {
    pickupsByDate[p.date] = (pickupsByDate[p.date] || 0) + 1;
  });

  // Get status counts
  const statusCounts = {
    pending: filteredPickups.filter(p => p.status === 'pending').length,
    upcoming: filteredPickups.filter(p => p.status === 'upcoming').length,
    inTransit: filteredPickups.filter(p => p.status === 'in-transit').length,
    completed: filteredPickups.filter(p => p.status === 'completed').length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <IconCheck size={16} />;
      case 'in-transit':
        return <IconClock size={16} />;
      case 'pending':
        return <IconAlertCircle size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'in-transit':
        return '#4ecdc4';
      case 'pending':
        return '#fa5252';
      default:
        return '#0d2b34';
    }
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <h1>Schedule & History</h1>
          <Text c="dimmed" size="sm">
            Manage and track all your pickup jobs
          </Text>
        </div>
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleDownloadReport}
          disabled={filteredPickups.length === 0}
        >
          Download Report
        </Button>
      </Group>

      {/* Statistics Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg" spacing="md">
        <Card withBorder p="md" className={classes.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              Total Pickups
            </Text>
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              <IconList size={18} />
            </ThemeIcon>
          </Group>
          <Text fw={700} size="lg">
            {filteredPickups.length}
          </Text>
        </Card>

        <Card withBorder p="md" className={classes.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              Completed
            </Text>
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              <IconCheck size={18} />
            </ThemeIcon>
          </Group>
          <Text fw={700} size="lg">
            {statusCounts.completed}
          </Text>
        </Card>

        <Card withBorder p="md" className={classes.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              In Transit
            </Text>
            <ThemeIcon color="cyan" variant="light" size="lg" radius="md">
              <IconClock size={18} />
            </ThemeIcon>
          </Group>
          <Text fw={700} size="lg">
            {statusCounts.inTransit}
          </Text>
        </Card>

        <Card withBorder p="md" className={classes.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} c="dimmed">
              Pending
            </Text>
            <ThemeIcon color="red" variant="light" size="lg" radius="md">
              <IconAlertCircle size={18} />
            </ThemeIcon>
          </Group>
          <Text fw={700} size="lg">
            {statusCounts.pending}
          </Text>
        </Card>
      </SimpleGrid>

      {/* Control Bar - Filters and View Toggle */}
      <Paper p="md" radius="md" withBorder mb="lg" className={classes.controlBar}>
        <Stack gap="md">
          {/* Filters Row 1 */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <TextInput
                placeholder="Search customer or location..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                  setCurrentPage(1);
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Status"
                placeholder="Filter by status"
                data={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'in-transit', label: 'In Transit' },
                  { value: 'completed', label: 'Completed' },
                ]}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                clearable
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <DatePickerInput
                type="range"
                label="Date Range"
                placeholder="Select date range"
                value={dateRange}
                onChange={setDateRange}
                clearable
              />
            </Grid.Col>
          </Grid>

          {/* View Toggle */}
          <Group justify="flex-end">
            <Tooltip label="Calendar View">
              <ActionIcon
                size="lg"
                variant={viewMode === 'calendar' ? 'filled' : 'light'}
                color={viewMode === 'calendar' ? '#1a535c' : 'gray'}
                onClick={() => setViewMode('calendar')}
              >
                <IconCalendar size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="List View">
              <ActionIcon
                size="lg"
                variant={viewMode === 'list' ? 'filled' : 'light'}
                color={viewMode === 'list' ? '#1a535c' : 'gray'}
                onClick={() => setViewMode('list')}
              >
                <IconList size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>

      {/* Main Content */}
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : error ? (
        <Text c="red">{error}</Text>
      ) : (
        <>
          {viewMode === 'list' ? (
            // LIST VIEW
            <Paper p="md" radius="md" withBorder>
              <Table striped highlightOnHover className={classes.table}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date & Time</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Waste Types</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedPickups.length > 0 ? (
                    paginatedPickups.map((pickup) => (
                      <Table.Tr key={pickup._id} className={classes.tableRow}>
                        <Table.Td>
                          <Stack gap={0}>
                            <Text fw={500}>{pickup.date}</Text>
                            <Text size="sm" c="dimmed">
                              {pickup.time}
                            </Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={0}>
                            <Text fw={500}>{pickup.customerName}</Text>
                            <Group gap="xs">
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={() =>
                                  window.open(`tel:${pickup.customerPhone}`)
                                }
                              >
                                <IconPhone size={14} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="blue"
                                onClick={() =>
                                  window.open(`mailto:${pickup.customerEmail}`)
                                }
                              >
                                <IconMail size={14} />
                              </ActionIcon>
                            </Group>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <IconMapPin size={14} color="#4ecdc4" />
                            <Text size="sm">{pickup.address}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            {pickup.wasteTypes.slice(0, 2).map((type, idx) => (
                              <Badge key={idx} size="sm" variant="dot">
                                {type}
                              </Badge>
                            ))}
                            {pickup.wasteTypes.length > 2 && (
                              <Badge size="sm" variant="light">
                                +{pickup.wasteTypes.length - 2}
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            {getStatusIcon(pickup.status)}
                            <Badge
                              color={getStatusColor(pickup.status)}
                              variant="light"
                            >
                              {pickup.status}
                            </Badge>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            variant="subtle"
                            onClick={() => handleViewDetails(pickup)}
                          >
                            View Details
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center py="xl">
                          <Text c="dimmed">No pickups found</Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <Group justify="center" mt="lg">
                  <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={totalPages}
                  />
                </Group>
              )}
            </Paper>
          ) : (
            // CALENDAR VIEW
            <Grid gutter="lg">
              {/* Calendar Selector */}
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Paper p="md" radius="md" withBorder className={classes.calendarCard}>
                  <DatePickerInput
                    type="default"
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    renderDay={(date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const count = pickupsByDate[dateStr] || 0;
                      const isSelected =
                        selectedDate?.toISOString().split('T')[0] === dateStr;

                      return (
                        <Tooltip
                          label={count > 0 ? `${count} pickup${count > 1 ? 's' : ''}` : 'No pickups'}
                          disabled={count === 0}
                        >
                          <div
                            className={`${classes.dayCell} ${
                              isSelected ? classes.daySelected : ''
                            } ${count > 0 ? classes.dayWithPickups : ''}`}
                            style={{
                              backgroundColor:
                                count > 0
                                  ? `rgba(82, 196, 26, ${Math.min(count * 0.3, 1)})`
                                  : 'transparent',
                            }}
                          >
                            {date.getDate()}
                            {count > 0 && (
                              <div className={classes.pickupCount}>{count}</div>
                            )}
                          </div>
                        </Tooltip>
                      );
                    }}
                  />
                </Paper>
              </Grid.Col>

              {/* Daily Pickup Details */}
              <Grid.Col span={{ base: 12, md: 9 }}>
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={700} size="lg">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text c="dimmed" size="sm">
                          {pickupsForDate.length} pickup
                          {pickupsForDate.length !== 1 ? 's' : ''} scheduled
                        </Text>
                      </div>

                      <RingProgress
                        sections={[
                          {
                            value: statusCounts.completed > 0 ? 25 : 0,
                            color: '#52c41a',
                          },
                          {
                            value: statusCounts.inTransit > 0 ? 25 : 0,
                            color: '#4ecdc4',
                          },
                          {
                            value: statusCounts.pending > 0 ? 25 : 0,
                            color: '#fa5252',
                          },
                        ]}
                        radius={60}
                        size={120}
                        thickness={4}
                        label={
                          <Stack gap={0} align="center">
                            <Text fw={700} size="sm">
                              {pickupsForDate.length}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Jobs
                            </Text>
                          </Stack>
                        }
                      />
                    </Group>

                    <div className={classes.divider} />

                    {pickupsForDate.length > 0 ? (
                      <Stack gap="sm">
                        {pickupsForDate.map((pickup, idx) => (
                          <Card
                            key={pickup._id}
                            p="md"
                            radius="md"
                            className={classes.pickupCard}
                            withBorder
                          >
                            <Group justify="space-between" mb="xs">
                              <Group>
                                <ThemeIcon
                                  size={32}
                                  radius="md"
                                  color="blue"
                                  variant="light"
                                >
                                  <Text fw={700} size="sm">
                                    {idx + 1}
                                  </Text>
                                </ThemeIcon>
                                <Stack gap={0}>
                                  <Text fw={600}>{pickup.customerName}</Text>
                                  <Text size="sm" c="dimmed">
                                    {pickup.time}
                                  </Text>
                                </Stack>
                              </Group>
                              <Badge
                                color={getStatusColor(pickup.status)}
                                variant="light"
                              >
                                {pickup.status}
                              </Badge>
                            </Group>

                            <Text size="sm" mb="xs">
                              <IconMapPin
                                size={14}
                                style={{ display: 'inline', marginRight: 4 }}
                              />
                              {pickup.address}, {pickup.city}
                            </Text>

                            <Group gap="xs" mb="md">
                              {pickup.wasteTypes.map((type, idx) => (
                                <Badge key={idx} size="sm" variant="dot">
                                  {type}
                                </Badge>
                              ))}
                            </Group>

                            <Button
                              fullWidth
                              size="sm"
                              variant="light"
                              onClick={() => handleViewDetails(pickup)}
                            >
                              View Full Details
                            </Button>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Center py="xl">
                        <Stack align="center" gap="sm">
                          <IconCalendar size={32} color="#adb5bd" />
                          <Text c="dimmed">No pickups scheduled for this date</Text>
                        </Stack>
                      </Center>
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          )}
        </>
      )}

      {/* Details Modal - Comprehensive Pickup Information */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Pickup Details"
        size="lg"
        scrollAreaComponent={Paper}
      >
        {selectedPickup && (
          <Stack gap="lg">
            {/* Header Section */}
            <Paper p="md" radius="md" style={{ background: '#f0f8f5', border: '1px solid #c3fae8' }}>
              <Group justify="space-between" mb="sm">
                <div>
                  <Text fw={700} size="lg" c="#1a535c">
                    {selectedPickup.customerName}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Pickup ID: {selectedPickup._id.substring(0, 8)}...
                  </Text>
                </div>
                <Badge
                  size="lg"
                  color={getStatusColor(selectedPickup.status)}
                  leftSection={getStatusIcon(selectedPickup.status)}
                >
                  {selectedPickup.status.charAt(0).toUpperCase() + selectedPickup.status.slice(1)}
                </Badge>
              </Group>
            </Paper>

            {/* Date & Time Section */}
            <Card withBorder p="md" radius="md">
              <Card.Section inheritPadding py="md">
                <Group gap="md">
                  <ThemeIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="md"
                  >
                    <IconCalendar size={18} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text fw={500} size="sm" c="dimmed">
                      Scheduled Date & Time
                    </Text>
                    <Text fw={600} size="md">
                      {selectedPickup.date}
                    </Text>
                    <Text fw={600} size="md" c="#4ecdc4">
                      {selectedPickup.time}
                    </Text>
                  </Stack>
                </Group>
              </Card.Section>
            </Card>

            {/* Location Section */}
            <Card withBorder p="md" radius="md">
              <Card.Section inheritPadding py="md">
                <Group gap="md" align="flex-start">
                  <ThemeIcon
                    variant="light"
                    color="cyan"
                    size="lg"
                    radius="md"
                  >
                    <IconMapPin size={18} />
                  </ThemeIcon>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text fw={500} size="sm" c="dimmed">
                      Pickup Location
                    </Text>
                    <Text fw={600}>
                      {selectedPickup.address}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedPickup.city}, {selectedPickup.state} {selectedPickup.postalCode}
                    </Text>
                    {selectedPickup.coordinates && (
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">
                          📍 {selectedPickup.coordinates.latitude?.toFixed(4)}, {selectedPickup.coordinates.longitude?.toFixed(4)}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Group>
              </Card.Section>
            </Card>

            {/* Customer Contact Section */}
            <Card withBorder p="md" radius="md">
              <Card.Section inheritPadding py="md">
                <Text fw={600} size="sm" mb="xs" c="#1a535c">
                  Contact Information
                </Text>
                <Stack gap="xs">
                  <Group gap="md">
                    <ThemeIcon
                      variant="light"
                      color="blue"
                      size="md"
                      radius="md"
                    >
                      <IconPhone size={16} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">
                        Phone
                      </Text>
                      <Text
                        component="a"
                        href={`tel:${selectedPickup.customerPhone}`}
                        fw={600}
                        c="#4ecdc4"
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                      >
                        {selectedPickup.customerPhone}
                      </Text>
                    </Stack>
                  </Group>
                  <Group gap="md">
                    <ThemeIcon
                      variant="light"
                      color="blue"
                      size="md"
                      radius="md"
                    >
                      <IconMail size={16} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">
                        Email
                      </Text>
                      <Text
                        component="a"
                        href={`mailto:${selectedPickup.customerEmail}`}
                        fw={600}
                        c="#4ecdc4"
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                      >
                        {selectedPickup.customerEmail}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card.Section>
            </Card>

            {/* Waste Types Section */}
            <Card withBorder p="md" radius="md">
              <Card.Section inheritPadding py="md">
                <Text fw={600} size="sm" mb="xs" c="#1a535c">
                  Waste Types to Collect
                </Text>
                <Group gap="xs">
                  {selectedPickup.wasteTypes && selectedPickup.wasteTypes.length > 0 ? (
                    selectedPickup.wasteTypes.map((type, idx) => (
                      <Badge
                        key={idx}
                        size="lg"
                        variant="dot"
                        color="#1a535c"
                      >
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No waste types specified
                    </Text>
                  )}
                </Group>
              </Card.Section>
            </Card>

            {/* Quantity & Weight Section */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Card.Section inheritPadding py="md">
                    <Text fw={600} size="sm" mb="xs" c="#1a535c">
                      Quantity
                    </Text>
                    <Text fw={600} size="lg" c="#4ecdc4">
                      {selectedPickup.quantity || 'Not specified'}
                    </Text>
                  </Card.Section>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Card.Section inheritPadding py="md">
                    <Text fw={600} size="sm" mb="xs" c="#1a535c">
                      Estimated Weight
                    </Text>
                    <Text fw={600} size="lg" c="#52c41a">
                      {selectedPickup.estimatedWeight ? `${selectedPickup.estimatedWeight} kg` : 'Not estimated'}
                    </Text>
                  </Card.Section>
                </Card>
              </Grid.Col>
            </Grid>

            {/* Special Instructions Section */}
            {selectedPickup.notes && (
              <Card withBorder p="md" radius="md" style={{ background: '#fffbeb', border: '1px solid #fde047' }}>
                <Card.Section inheritPadding py="md">
                  <Group gap="md" align="flex-start">
                    <ThemeIcon
                      variant="light"
                      color="yellow"
                      size="lg"
                      radius="md"
                    >
                      <IconAlertCircle size={18} />
                    </ThemeIcon>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={600} size="sm" c="#1a535c">
                        Special Instructions
                      </Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedPickup.notes}
                      </Text>
                    </Stack>
                  </Group>
                </Card.Section>
              </Card>
            )}

            {/* Notes/Comments Section - Recycler Add Notes */}
            <Card withBorder p="md" radius="md" style={{ background: '#f0f8f5' }}>
              <Card.Section inheritPadding py="md">
                <Text fw={600} size="sm" mb="xs" c="#1a535c">
                  Recycler Notes
                </Text>
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Add internal notes or observations about this pickup
                  </Text>
                  <textarea
                    placeholder="E.g., Customer requests separate sorting, fragile items, etc."
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      fontColor: '#495057',
                    }}
                    defaultValue={selectedPickup.recyclerNotes || ''}
                  />
                </Stack>
              </Card.Section>
            </Card>

            {/* Metadata Section */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed">
                  Created: {new Date(selectedPickup.createdAt).toLocaleDateString()} {new Date(selectedPickup.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" ta="right">
                  Last Updated: {new Date(selectedPickup.updatedAt).toLocaleDateString()} {new Date(selectedPickup.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Grid.Col>
            </Grid>

            {/* Action Buttons */}
            <Group justify="flex-end" gap="md">
              <Button
                variant="light"
                onClick={() => setOpened(false)}
              >
                Close
              </Button>
              <Button
                variant="light"
                color="blue"
                leftSection={<IconPhone size={16} />}
                onClick={() => window.open(`tel:${selectedPickup.customerPhone}`)}
              >
                Call Customer
              </Button>
              <Button
                variant="light"
                color="cyan"
                leftSection={<IconMail size={16} />}
                onClick={() => window.open(`mailto:${selectedPickup.customerEmail}`)}
              >
                Email Customer
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default ScheduleHistoryPage;
