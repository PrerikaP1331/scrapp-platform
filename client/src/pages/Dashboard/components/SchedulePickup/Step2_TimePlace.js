// /client/src/pages/Dashboard/components/SchedulePickup/Step2_TimePlace.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Card,
  Group,
  Button,
  Badge,
  SimpleGrid,
  Paper,
  Input,
} from '@mantine/core';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { getTimeSlots } from '../../../../api/pickupService';
import styles from './SchedulePickup.module.css';

function Step2_TimePlace({ formData, setFormData, onNext, onBack }) {
  const { user } = useContext(AuthContext);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch time slots when date changes
  useEffect(() => {
    if (formData.scheduledDate) {
      fetchTimeSlots();
    }
  }, [formData.scheduledDate]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await getTimeSlots(formData.scheduledDate);
      setTimeSlots(data.timeSlots || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      scheduledDate: date,
      timeSlot: '', // Reset time slot when date changes
    }));
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData((prev) => ({
      ...prev,
      timeSlot: slot,
    }));
  };

  const isFormValid = formData.scheduledDate && formData.timeSlot;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={2} mb="xs" style={{ color: '#344e41' }}>
            Step 2 of 3: When and where?
          </Title>
          <Text color="dimmed">Select a date, time slot, and confirm your address</Text>
        </div>

        {/* Date Selection */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>
            Select a pickup date
          </Title>
          <Card withBorder p="md" style={{ backgroundColor: '#f9f9f9' }}>
            <Input
              type="date"
              value={formData.scheduledDate ? formData.scheduledDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  handleDateChange(date);
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              size="lg"
            />
          </Card>
        </div>

        {/* Time Slot Selection */}
        {formData.scheduledDate && (
          <div>
            <Title order={4} mb="md" style={{ color: '#344e41' }}>
              Select a time slot
            </Title>
            {loading ? (
              <Text>Loading time slots...</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 3 }} gap="md">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <Card
                      key={slot}
                      onClick={() => handleTimeSlotSelect(slot)}
                      style={{
                        cursor: 'pointer',
                        border:
                          formData.timeSlot === slot
                            ? '2px solid #588157'
                            : '1px solid #e0e0e0',
                        backgroundColor:
                          formData.timeSlot === slot ? '#f0f8f5' : '#fff',
                      }}
                      p="md"
                    >
                      <Text fw={500} ta="center" style={{ color: '#344e41' }}>
                        {slot}
                      </Text>
                      {formData.timeSlot === slot && (
                        <Badge color="teal" mt="sm" fullWidth>
                          Selected
                        </Badge>
                      )}
                    </Card>
                  ))
                ) : (
                  <Text>No time slots available</Text>
                )}
              </SimpleGrid>
            )}
          </div>
        )}

        {/* Address Confirmation */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>
            Confirm your pickup address
          </Title>
          {user?.address ? (
            <Paper p="md" withBorder style={{ backgroundColor: '#f0f8f5' }}>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text fw={500} style={{ color: '#344e41' }}>
                    {user.address.addressLine1}
                  </Text>
                  {user.address.addressLine2 && (
                    <Text size="sm" color="dimmed">
                      {user.address.addressLine2}
                    </Text>
                  )}
                  <Text size="sm" color="dimmed">
                    {user.address.city}, {user.address.state} {user.address.postalCode}
                  </Text>
                </Stack>
                <Badge color="teal">Default Address</Badge>
              </Group>
            </Paper>
          ) : (
            <Text color="red">Please add an address to your profile</Text>
          )}
        </div>

        {/* Navigation */}
        <Group justify="space-between" mt="xl">
          <Button variant="light" size="md" onClick={onBack}>
            ← Back
          </Button>
          <Button
            size="md"
            onClick={onNext}
            disabled={!isFormValid}
            style={{
              backgroundColor: '#588157',
            }}
          >
            Next →
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Step2_TimePlace;
