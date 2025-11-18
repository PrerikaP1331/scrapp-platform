import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Stepper,
  Button,
  Group,
  Text,
  SimpleGrid,
  Card,
  TextInput,
  Select,
  Radio,
  Stack,
  Badge,
  Progress,
  Modal,
  Box,
  LoadingOverlay
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconClock, IconMapPin, IconRecycle, IconTruck, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createCommunityPickup, getRecyclers } from '../../api/pickupService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import MapView from '../../components/MapView/MapView';

const wasteTypes = [
  { id: 'paper', name: 'Paper & Cardboard', icon: '📄', color: '#e8f5e8' },
  { id: 'plastic', name: 'Plastics', icon: '🥤', color: '#fff3e0' },
  { id: 'glass', name: 'Glass', icon: '🍾', color: '#f0f8ff' },
  { id: 'metal', name: 'Metal', icon: '🥫', color: '#f5f5f5' },
  { id: 'ewaste', name: 'E-Waste', icon: '💻', color: '#f0f0f0' },
  { id: 'organic', name: 'Organic Waste', icon: '🥬', color: '#f1f8e9' },
  { id: 'hazardous', name: 'Hazardous', icon: '⚠️', color: '#fff3cd' },
  { id: 'other', name: 'Mixed Items', icon: '📦', color: '#e3f2fd' }
];

const quantityOptions = [
  { value: 'bins', label: 'Multiple Large Bins (10+)' },
  { value: 'truckload', label: 'Small Truckload' },
  { value: 'specialty', label: 'Specialty Bulk Items' }
];

const timeSlots = [
  { value: 'morning', label: '9 AM - 1 PM' },
  { value: 'afternoon', label: '1 PM - 5 PM' }
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

function ScheduleCommunityPickup() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recyclers, setRecyclers] = useState([]);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const form = useForm({
    initialValues: {
      wasteTypes: [],
      quantity: '',
      scheduleType: 'onetime',
      date: null,
      timeSlot: '',
      frequency: '',
      dayOfWeek: '',
      recurringTimeSlot: '',
      location: '',
      notes: ''
    },
    validate: {
      wasteTypes: (value) => value.length === 0 ? 'Please select at least one waste type' : null,
      quantity: (value) => !value ? 'Please select quantity' : null,
      date: (value, values) => values.scheduleType === 'onetime' && !value ? 'Please select a date' : null,
      timeSlot: (value, values) => values.scheduleType === 'onetime' && !value ? 'Please select a time slot' : null,
      frequency: (value, values) => values.scheduleType === 'recurring' && !value ? 'Please select frequency' : null,
      dayOfWeek: (value, values) => values.scheduleType === 'recurring' && !value ? 'Please select day of week' : null,
      recurringTimeSlot: (value, values) => values.scheduleType === 'recurring' && !value ? 'Please select time slot' : null,
      location: (value) => !value.trim() ? 'Please specify pickup location' : null
    }
  });

  const handleWasteTypeToggle = (wasteType) => {
    const currentTypes = form.values.wasteTypes;
    if (currentTypes.includes(wasteType)) {
      form.setFieldValue('wasteTypes', currentTypes.filter(type => type !== wasteType));
    } else {
      form.setFieldValue('wasteTypes', [...currentTypes, wasteType]);
    }
  };

  const nextStep = () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }
    
    if (active === 0) {
      // Load recyclers for step 2
      loadRecyclers();
    }
    
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const loadRecyclers = async () => {
    setLoading(true);
    try {
      const params = {
        capacity: 'bulk',
        wasteTypes: form.values.wasteTypes.join(','),
        location: user?.community?.address || 'Mumbai, India'
      };
      const response = await getRecyclers(params);
      setRecyclers(response.data);
    } catch (error) {
      notifications.show({
        title: 'Error loading recyclers',
        message: 'Unable to load available recycling partners',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRecycler) {
      notifications.show({
        title: 'Please select a recycler',
        message: 'Choose a recycling partner to continue',
        color: 'yellow'
      });
      return;
    }

    setLoading(true);
    try {
      const pickupData = {
        ...form.values,
        communityId: user?.community?._id,
        recyclerId: selectedRecycler._id,
        pickupType: 'community_bulk'
      };

      await createCommunityPickup(pickupData);
      setSuccessModal(true);
    } catch (error) {
      notifications.show({
        title: 'Scheduling failed',
        message: error.response?.data?.msg || 'Unable to schedule pickup',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSummaryText = () => {
    const { wasteTypes, quantity, scheduleType, date, timeSlot, frequency, dayOfWeek, recurringTimeSlot, location } = form.values;
    const wasteTypeNames = wasteTypes.map(type => wasteTypes.find(w => w.id === type)?.name).join(', ');
    
    if (scheduleType === 'onetime') {
      return `One-time pickup of ${wasteTypeNames} (${quantityOptions.find(q => q.value === quantity)?.label}) on ${date?.toLocaleDateString()} at ${timeSlots.find(t => t.value === timeSlot)?.label} at ${location}`;
    } else {
      return `Recurring ${frequencyOptions.find(f => f.value === frequency)?.label} pickup of ${wasteTypeNames} (${quantityOptions.find(q => q.value === quantity)?.label}) every ${dayOptions.find(d => d.value === dayOfWeek)?.label} at ${timeSlots.find(t => t.value === recurringTimeSlot)?.label} at ${location}`;
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" radius="md">
        <Title order={2} mb="xl" style={{ color: '#344e41' }}>
          <IconTruck size={28} style={{ marginRight: '8px' }} />
          Schedule a Community Pickup
        </Title>

        <Stepper active={active} onStepClick={setActive} breakpoint="sm" mb="xl">
          <Stepper.Step label="Details & Schedule" description="What and when">
            <Box mt="xl">
              <Title order={4} mb="md">Step 1: What are you recycling and when?</Title>
              
              {/* Waste Type Selection */}
              <Text fw={600} mb="md">Select Waste Types *</Text>
              <SimpleGrid cols={4} spacing="md" mb="lg">
                {wasteTypes.map((waste) => (
                  <Card
                    key={waste.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: form.values.wasteTypes.includes(waste.id) ? waste.color : 'white',
                      borderColor: form.values.wasteTypes.includes(waste.id) ? '#588157' : '#e9ecef',
                      borderWidth: form.values.wasteTypes.includes(waste.id) ? '2px' : '1px'
                    }}
                    onClick={() => handleWasteTypeToggle(waste.id)}
                  >
                    <Text ta="center" size="xl" mb="xs">{waste.icon}</Text>
                    <Text ta="center" size="sm" fw={500}>{waste.name}</Text>
                  </Card>
                ))}
              </SimpleGrid>
              {form.errors.wasteTypes && <Text c="red" size="sm">{form.errors.wasteTypes}</Text>}

              {/* Quantity Selection */}
              <Select
                label="Estimated Quantity *"
                placeholder="Select quantity"
                data={quantityOptions}
                value={form.values.quantity}
                onChange={(value) => form.setFieldValue('quantity', value)}
                error={form.errors.quantity}
                mb="md"
                leftSection={<IconRecycle size={16} />}
              />

              {/* Schedule Type */}
              <Radio.Group
                label="Is this a one-time or recurring pickup? *"
                value={form.values.scheduleType}
                onChange={(value) => form.setFieldValue('scheduleType', value)}
                mb="md"
              >
                <Group>
                  <Radio value="onetime" label="One-Time Pickup" />
                  <Radio value="recurring" label="Recurring Pickup" />
                </Group>
              </Radio.Group>

              {/* One-Time Schedule Fields */}
              {form.values.scheduleType === 'onetime' && (
                <Group grow mb="md">
                  <DatePicker
                    label="Pickup Date *"
                    placeholder="Select date"
                    value={form.values.date}
                    onChange={(value) => form.setFieldValue('date', value)}
                    error={form.errors.date}
                    minDate={new Date()}
                    leftSection={<IconCalendar size={16} />}
                  />
                  <Select
                    label="Time Slot *"
                    placeholder="Select time"
                    data={timeSlots}
                    value={form.values.timeSlot}
                    onChange={(value) => form.setFieldValue('timeSlot', value)}
                    error={form.errors.timeSlot}
                    leftSection={<IconClock size={16} />}
                  />
                </Group>
              )}

              {/* Recurring Schedule Fields */}
              {form.values.scheduleType === 'recurring' && (
                <Box mb="md">
                  <Text fw={600} mb="md">Recurring Schedule</Text>
                  <Group grow mb="md">
                    <Select
                      label="Frequency *"
                      placeholder="Select frequency"
                      data={frequencyOptions}
                      value={form.values.frequency}
                      onChange={(value) => form.setFieldValue('frequency', value)}
                      error={form.errors.frequency}
                    />
                    <Select
                      label="Day of Week *"
                      placeholder="Select day"
                      data={dayOptions}
                      value={form.values.dayOfWeek}
                      onChange={(value) => form.setFieldValue('dayOfWeek', value)}
                      error={form.errors.dayOfWeek}
                    />
                    <Select
                      label="Time Slot *"
                      placeholder="Select time"
                      data={timeSlots}
                      value={form.values.recurringTimeSlot}
                      onChange={(value) => form.setFieldValue('recurringTimeSlot', value)}
                      error={form.errors.recurringTimeSlot}
                      leftSection={<IconClock size={16} />}
                    />
                  </Group>
                </Box>
              )}

              {/* Pickup Location */}
              <TextInput
                label="Pickup Location *"
                placeholder="e.g., Outside the clubhouse, Basement loading dock"
                value={form.values.location}
                onChange={(event) => form.setFieldValue('location', event.currentTarget.value)}
                error={form.errors.location}
                leftSection={<IconMapPin size={16} />}
                mb="md"
                description="The community's main address will be automatically included"
              />
            </Box>
          </Stepper.Step>

          <Stepper.Step label="Recycler & Confirmation" description="Choose partner and confirm">
            <Box mt="xl">
              <Title order={4} mb="md">Step 2: Choose a partner and confirm</Title>
              
              {loading && <LoadingOverlay visible={loading} />}
              
              {/* Available Recyclers List */}
              <Text fw={600} mb="md">Available Recycling Partners</Text>
              {recyclers.length === 0 ? (
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Text ta="center" c="dimmed">No recycling partners available for your selected criteria</Text>
                </Card>
              ) : (
                <Stack mb="lg">
                  {recyclers.map((recycler) => (
                    <Card
                      key={recycler._id}
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedRecycler?._id === recycler._id ? '#f4f3ef' : 'white',
                        borderColor: selectedRecycler?._id === recycler._id ? '#588157' : '#e9ecef'
                      }}
                      onClick={() => setSelectedRecycler(recycler)}
                    >
                      <Group justify="space-between">
                        <Box>
                          <Text fw={600}>{recycler.name}</Text>
                          <Text size="sm" c="dimmed">{recycler.specialties?.join(', ')}</Text>
                          <Group mt="xs">
                            <Badge color="green" variant="light">Bulk Capacity</Badge>
                            {recycler.rating && (
                              <Badge color="blue" variant="light">★ {recycler.rating}</Badge>
                            )}
                          </Group>
                        </Box>
                        <Box>
                          <Text size="sm" fw={500}>Distance: ~{recycler.distance || '5'} km</Text>
                          <Text size="sm" c="dimmed">{recycler.contact}</Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              )}

              {/* Map View */}
              {recyclers.length > 0 && (
                <Box mb="lg" style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                  <MapView
                    center={user?.community?.coordinates || [19.0760, 72.8777]}
                    markers={recyclers.map(r => ({
                      position: r.coordinates || [19.0760, 72.8777],
                      title: r.name,
                      description: r.specialties?.join(', ')
                    }))}
                  />
                </Box>
              )}

              {/* Confirmation Summary */}
              <Card shadow="sm" p="lg" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Text fw={600} mb="md">Confirmation Summary</Text>
                <Stack gap="xs">
                  <Text size="sm"><strong>What:</strong> {wasteTypes.filter(w => form.values.wasteTypes.includes(w.id)).map(w => w.name).join(', ')}</Text>
                  <Text size="sm"><strong>Quantity:</strong> {quantityOptions.find(q => q.value === form.values.quantity)?.label}</Text>
                  <Text size="sm"><strong>When:</strong> {getSummaryText().split(' at ')[0].replace(form.values.wasteTypes.map(t => wasteTypes.find(w => w.id === t)?.name).join(', ') + ' (', '').replace(')', '')}</Text>
                  <Text size="sm"><strong>Location:</strong> {form.values.location}</Text>
                  {selectedRecycler && (
                    <Text size="sm"><strong>Recycler:</strong> {selectedRecycler.name}</Text>
                  )}
                </Stack>
              </Card>
            </Box>
          </Stepper.Step>

          <Stepper.Completed>
            <Box mt="xl" ta="center">
              <IconCheck size={64} color="#588157" />
              <Title order={3} mt="md">Pickup Scheduled Successfully!</Title>
              <Text c="dimmed" mt="sm">Your community pickup has been scheduled and the recycler has been notified.</Text>
              <Button
                mt="lg"
                style={{ backgroundColor: '#588157' }}
                onClick={() => navigate('/community-dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="xl">
          {active > 0 && active < 2 && (
            <Button variant="outline" onClick={prevStep}>
              ← Back
            </Button>
          )}
          {active < 1 && (
            <Button
              style={{ backgroundColor: '#588157' }}
              onClick={nextStep}
              disabled={form.errors.wasteTypes || form.errors.quantity || form.errors.location}
            >
              Next: Choose Recycler →
            </Button>
          )}
          {active === 1 && (
            <Button
              style={{ backgroundColor: '#588157' }}
              onClick={handleSubmit}
              disabled={!selectedRecycler || loading}
            >
              Confirm & Schedule Pickup(s)
            </Button>
          )}
        </Group>
      </Paper>

      <Modal
        opened={successModal}
        onClose={() => setSuccessModal(false)}
        title="Community Pickup Scheduled! 👍"
        centered
      >
        <Text mb="md">{getSummaryText()}</Text>
        <Text size="sm" c="dimmed">The recycler has been notified. You can manage this pickup in the Drive Management section.</Text>
        <Group justify="flex-end" mt="md">
          <Button
            style={{ backgroundColor: '#588157' }}
            onClick={() => {
              setSuccessModal(false);
              navigate('/community-dashboard');
            }}
          >
            Back to Dashboard
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default ScheduleCommunityPickup;