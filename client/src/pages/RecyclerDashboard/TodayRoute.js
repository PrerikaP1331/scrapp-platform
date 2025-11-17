import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Title, Text, Stack, Group, Button, Badge, Card, Grid,
  Modal, Loader, Center, Alert, SimpleGrid, ActionIcon, Tooltip, ThemeIcon
} from '@mantine/core';
import { IconMapPin, IconClock, IconPhone, IconAlertCircle, IconPrinter, IconMapSearch, IconCheck, IconLoader } from '@tabler/icons-react';
import styles from './TodayRoute.module.css';
import { getRouteToday, updatePickupStatus } from '../../api/recyclerService';

function TodayRoute() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [completedStops, setCompletedStops] = useState({});
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const stopListRef = useRef(null);

  // Fetch today's route data
  useEffect(() => {
    fetchTodayRoute();
  }, []);

  const fetchTodayRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRouteToday();
      
      if (data.pickups && data.pickups.length > 0) {
        setPickups(data.pickups);
        // Initialize completed stops based on status
        const completed = {};
        data.pickups.forEach(p => {
          if (p.status === 'completed') {
            completed[p._id] = true;
          }
        });
        setCompletedStops(completed);
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError(err.msg || 'Failed to load today\'s route');
    } finally {
      setLoading(false);
    }
  };

  // Mark pickup as completed
  const handleMarkCompleted = async (pickupId, isCompleting) => {
    try {
      setUpdatingId(pickupId);
      const newStatus = isCompleting ? 'completed' : 'scheduled';
      await updatePickupStatus(pickupId, newStatus);
      
      setCompletedStops(prev => ({
        ...prev,
        [pickupId]: isCompleting
      }));

      // Update pickup status in state
      setPickups(prev => 
        prev.map(p => p._id === pickupId ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.msg || 'Failed to update pickup status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open details modal
  const handleViewDetails = (stop) => {
    setSelectedStop(stop);
    setDetailsModalOpen(true);
  };

  // Scroll stop into view when map marker is clicked
  const scrollToStop = (index) => {
    setCurrentStopIndex(index);
    if (stopListRef.current?.children[index]) {
      stopListRef.current.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Open in native maps app
  const handleOpenMaps = (stop) => {
    const address = `${stop.address}, ${stop.city}`;
    const encodedAddress = encodeURIComponent(address);
    
    // Detect mobile device
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      const mapsUrl = /iPhone|iPad/.test(navigator.userAgent)
        ? `maps://maps.apple.com/?address=${encodedAddress}&q=${encodedAddress}`
        : `geo:${stop.coordinates.latitude},${stop.coordinates.longitude}?q=${encodedAddress}`;
      window.location.href = mapsUrl;
    } else {
      // Desktop - open Google Maps in new tab
      const googleMapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  // Print route
  const handlePrintRoute = () => {
    const printContent = `
      <html>
        <head>
          <title>Today's Route - Scrapp</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1a535c; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #1a535c; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Today's Optimized Route</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Total Stops: ${pickups.length}</p>
          <table>
            <tr>
              <th>Stop #</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Time Slot</th>
              <th>Waste Types</th>
              <th>Phone</th>
            </tr>
            ${pickups.map(p => `
              <tr>
                <td>${p.position}</td>
                <td>${p.customerName}</td>
                <td>${p.address}, ${p.city}</td>
                <td>${p.timeSlot}</td>
                <td>${p.wasteTypes.join(', ')}</td>
                <td>${p.customerPhone}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <Center style={{ height: '400px' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="#1a535c" />
          <Text>Loading today's route...</Text>
        </Stack>
      </Center>
    );
  }

  if (error && pickups.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle />} title="Error" color="red" mb="xl">
          {error}
        </Alert>
        <Button onClick={fetchTodayRoute}>Retry</Button>
      </Container>
    );
  }

  const completedCount = Object.values(completedStops).filter(Boolean).length;
  const currentStop = pickups[currentStopIndex];

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} style={{ color: '#1a535c' }}>
              Today's Optimized Route
            </Title>
            <Text size="sm" color="dimmed">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {pickups.length} stops
            </Text>
          </div>

          {/* Utility Buttons */}
          <Group gap="xs">
            <Tooltip label="Print Route">
              <ActionIcon 
                variant="light" 
                color="#1a535c"
                onClick={handlePrintRoute}
                size="lg"
              >
                <IconPrinter size={20} />
              </ActionIcon>
            </Tooltip>
            {currentStop && (
              <Tooltip label="Open in Maps">
                <ActionIcon 
                  variant="light" 
                  color="#4ecdc4"
                  onClick={() => handleOpenMaps(currentStop)}
                  size="lg"
                >
                  <IconMapSearch size={20} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        {pickups.length === 0 ? (
          <Alert icon={<IconAlertCircle />} title="No Pickups" color="blue">
            There are no pickups scheduled for today.
          </Alert>
        ) : (
          <Grid gutter="lg">
            {/* Left Panel: Stop List */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper p="lg" radius="md" withBorder style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Group justify="space-between" mb="lg">
                  <Title order={4} style={{ color: '#1a535c' }}>Route Checklist</Title>
                  <Badge size="lg" variant="light" color="#4ecdc4">
                    {completedCount} / {pickups.length}
                  </Badge>
                </Group>

                <Stack gap="md" ref={stopListRef}>
                  {pickups.map((stop, idx) => (
                    <Card
                      key={stop._id}
                      withBorder
                      p="md"
                      radius="md"
                      className={`${styles.stopCard} ${completedStops[stop._id] ? styles.completed : ''} ${currentStopIndex === idx ? styles.current : ''}`}
                      onClick={() => scrollToStop(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Group justify="space-between" mb="sm">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ThemeIcon
                            size={36}
                            radius="50%"
                            style={{
                              backgroundColor: completedStops[stop._id] ? '#52c41a' : '#4ecdc4',
                              color: 'white'
                            }}
                            fw={700}
                          >
                            {completedStops[stop._id] ? <IconCheck size={20} /> : stop.position}
                          </ThemeIcon>
                          <div style={{ flex: 1 }}>
                            <Text
                              fw={600}
                              style={{
                                color: '#1a535c',
                                textDecoration: completedStops[stop._id] ? 'line-through' : 'none',
                                opacity: completedStops[stop._id] ? 0.6 : 1
                              }}
                            >
                              {stop.customerName}
                            </Text>
                            <Text size="xs" color="dimmed">{stop.city}</Text>
                          </div>
                        </div>
                        {currentStopIndex === idx && (
                          <Badge size="sm" color="#4ecdc4">Current</Badge>
                        )}
                      </Group>

                      <Group gap="xs" mb="sm">
                        <Group gap={4}>
                          <IconClock size={14} color="#1a535c" />
                          <Text size="sm">{stop.timeSlot}</Text>
                        </Group>
                      </Group>

                      {stop.wasteTypes.length > 0 && (
                        <Group gap={4} mb="md">
                          {stop.wasteTypes.map(type => (
                            <Badge key={type} size="xs" variant="light">
                              {type}
                            </Badge>
                          ))}
                        </Group>
                      )}

                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="light"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(stop);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="xs"
                          color={completedStops[stop._id] ? 'gray' : '#52c41a'}
                          loading={updatingId === stop._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkCompleted(stop._id, !completedStops[stop._id]);
                          }}
                        >
                          {completedStops[stop._id] ? 'Mark Pending' : 'Mark Complete'}
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Right Panel: Map & Summary */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                {/* Map Placeholder */}
                <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f0f8f5', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon size={64} radius="50%" style={{ backgroundColor: '#4ecdc4', color: 'white', margin: '0 auto 16px' }}>
                      <IconMapPin size={32} />
                    </ThemeIcon>
                    <Text fw={600} style={{ color: '#1a535c' }} mb="xs">
                      Interactive Map View
                    </Text>
                    <Text size="sm" color="dimmed">
                      Route map with live tracking would display here
                    </Text>
                    <Text size="xs" color="dimmed" mt="md" style={{ fontStyle: 'italic' }}>
                      (React Leaflet Integration Coming Soon)
                    </Text>
                  </div>
                </Paper>

                {/* Route Summary */}
                <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f0f8f5' }}>
                  <Title order={4} style={{ color: '#1a535c' }} mb="lg">Today's Summary</Title>
                  <SimpleGrid cols={{ base: 2, sm: 3 }} gap="md">
                    <div>
                      <Text fw={500} size="sm" color="dimmed">Total Stops</Text>
                      <Text size="lg" fw={700} style={{ color: '#1a535c' }}>{pickups.length}</Text>
                    </div>
                    <div>
                      <Text fw={500} size="sm" color="dimmed">Completed</Text>
                      <Text size="lg" fw={700} style={{ color: '#52c41a' }}>{completedCount}</Text>
                    </div>
                    <div>
                      <Text fw={500} size="sm" color="dimmed">Remaining</Text>
                      <Text size="lg" fw={700} style={{ color: '#1a535c' }}>{pickups.length - completedCount}</Text>
                    </div>
                  </SimpleGrid>

                  {completedCount === pickups.length && pickups.length > 0 && (
                    <Alert icon={<IconCheck />} title="Great Job!" color="#52c41a" mt="lg">
                      You've completed all pickups for today!
                    </Alert>
                  )}
                </Paper>

                {/* Current Stop Details */}
                {currentStop && (
                  <Paper p="lg" radius="md" withBorder style={{ borderLeft: '4px solid #4ecdc4' }}>
                    <Title order={5} style={{ color: '#1a535c' }} mb="md">Current Stop</Title>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={600} style={{ color: '#1a535c' }}>{currentStop.customerName}</Text>
                        <Badge size="sm" color="#4ecdc4">Stop {currentStop.position}</Badge>
                      </Group>
                      <Text size="sm">{currentStop.address}, {currentStop.city}</Text>
                      <Group gap="xs">
                        <IconClock size={16} color="#1a535c" />
                        <Text size="sm">{currentStop.timeSlot}</Text>
                      </Group>
                      {currentStop.customerPhone && (
                        <Group gap="xs">
                          <IconPhone size={16} color="#1a535c" />
                          <Text size="sm" component="a" href={`tel:${currentStop.customerPhone}`} style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                            {currentStop.customerPhone}
                          </Text>
                        </Group>
                      )}
                      {currentStop.notes && (
                        <Alert icon={<IconAlertCircle />} title="Special Instructions" color="yellow" size="sm">
                          {currentStop.notes}
                        </Alert>
                      )}
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#4ecdc4' }}
                        onClick={() => handleOpenMaps(currentStop)}
                        fullWidth
                      >
                        Navigate to This Stop
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        )}
      </Stack>

      {/* Details Modal */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Pickup Details: ${selectedStop?.customerName}`}
        size="md"
      >
        {selectedStop && (
          <Stack gap="md">
            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Customer Name</Text>
              <Text fw={600}>{selectedStop.customerName}</Text>
            </div>

            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Phone Number</Text>
              <Text component="a" href={`tel:${selectedStop.customerPhone}`} style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                {selectedStop.customerPhone}
              </Text>
            </div>

            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Address</Text>
              <Text>{selectedStop.address}, {selectedStop.city} {selectedStop.postalCode}</Text>
            </div>

            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Time Slot</Text>
              <Text>{selectedStop.timeSlot}</Text>
            </div>

            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Waste Types</Text>
              <Group gap="xs">
                {selectedStop.wasteTypes.map(type => (
                  <Badge key={type} variant="light">{type}</Badge>
                ))}
              </Group>
            </div>

            <div>
              <Text fw={500} size="sm" color="dimmed" mb={4}>Quantity</Text>
              <Text>{selectedStop.quantity}</Text>
            </div>

            {selectedStop.notes && (
              <div>
                <Text fw={500} size="sm" color="dimmed" mb={4}>Special Instructions</Text>
                <Alert icon={<IconAlertCircle />} color="yellow">
                  {selectedStop.notes}
                </Alert>
              </div>
            )}

            <Group justify="flex-end" mt="lg">
              <Button
                variant="light"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                style={{ backgroundColor: '#4ecdc4' }}
                onClick={() => {
                  handleOpenMaps(selectedStop);
                  setDetailsModalOpen(false);
                }}
              >
                Navigate
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default TodayRoute;
