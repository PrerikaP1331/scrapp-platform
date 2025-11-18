// /client/src/pages/Dashboard/components/SchedulePickup/Step3_ChooseRecycler.js
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
  Rating,
  Paper,
  Grid,
  Loader,
  Center,
} from '@mantine/core';
import { IconMapPin, IconStar } from '@tabler/icons-react';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { getAvailableRecyclers } from '../../../../api/pickupService';
import styles from './SchedulePickup.module.css';

function Step3_ChooseRecycler({ formData, setFormData, onNext, onBack }) {
  const { user } = useContext(AuthContext);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(null);

  // Fetch available recyclers when component mounts or form data changes
  useEffect(() => {
    if (formData.scheduledDate && formData.timeSlot && formData.wasteTypes.length > 0) {
      fetchAvailableRecyclers();
    }
  }, [formData.scheduledDate, formData.timeSlot, formData.wasteTypes]);

  const fetchAvailableRecyclers = async () => {
    try {
      setLoading(true);
      const criteria = {
        scheduledDate: formData.scheduledDate,
        timeSlot: formData.timeSlot,
        wasteTypes: formData.wasteTypes,
        userCity: user?.address?.city || '',
      };
      const data = await getAvailableRecyclers(criteria);
      setRecyclers(data || []);
    } catch (error) {
      console.error('Error fetching recyclers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecyclerSelect = (recyclerId) => {
    setSelectedRecyclerId(recyclerId);
    setFormData((prev) => ({
      ...prev,
      selectedRecyclerId: recyclerId,
    }));
  };

  const isFormValid = selectedRecyclerId;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={2} mb="xs" style={{ color: '#344e41' }}>
            Step 3 of 3: Who will pick it up?
          </Title>
          <Text color="dimmed">Select a recycler from available options</Text>
        </div>

        {/* Recyclers List */}
        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : recyclers.length > 0 ? (
          <Stack gap="md">
            {recyclers.map((recycler) => (
              <Card
                key={recycler._id}
                onClick={() => handleRecyclerSelect(recycler._id)}
                style={{
                  cursor: 'pointer',
                  border:
                    selectedRecyclerId === recycler._id
                      ? '2px solid #588157'
                      : '1px solid #e0e0e0',
                  backgroundColor:
                    selectedRecyclerId === recycler._id ? '#f0f8f5' : '#fff',
                  transition: 'all 0.2s ease',
                }}
                p="md"
              >
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 8 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Title order={4} style={{ color: '#344e41' }}>
                          {recycler.businessName}
                        </Title>
                        {selectedRecyclerId === recycler._id && (
                          <Badge color="teal">Selected</Badge>
                        )}
                      </Group>

                      {/* Rating */}
                      <Group gap="xs">
                        <Group gap="xs">
                          <Rating
                            value={recycler.rating?.averageScore || 0}
                            readOnly
                            size="sm"
                          />
                          <Text size="sm" color="dimmed">
                            {recycler.rating?.averageScore?.toFixed(1) || 'N/A'} (
                            {recycler.rating?.totalReviews || 0} reviews)
                          </Text>
                        </Group>
                      </Group>

                      {/* Specialties */}
                      {recycler.specialties && recycler.specialties.length > 0 && (
                        <Group gap="xs">
                          {recycler.specialties.map((specialty) => (
                            <Badge key={specialty} variant="light" size="sm">
                              {specialty}
                            </Badge>
                          ))}
                        </Group>
                      )}

                      {/* Accepted Waste Types */}
                      <Text size="sm" fw={500} color="dimmed">
                        Accepts:{' '}
                        {recycler.acceptedWasteTypes?.join(', ') || 'Various types'}
                      </Text>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Stack align="flex-end" gap="sm">
                      {recycler.location && (
                        <Group gap="xs">
                          <IconMapPin size={16} color="#588157" />
                          <Text size="sm" color="dimmed">
                            {recycler.location.latitude?.toFixed(2)},
                            {recycler.location.longitude?.toFixed(2)}
                          </Text>
                        </Group>
                      )}
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => handleRecyclerSelect(recycler._id)}
                        style={{
                          color: '#588157',
                        }}
                      >
                        {selectedRecyclerId === recycler._id ? 'Selected' : 'Select'}
                      </Button>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper p="md" withBorder>
            <Text color="dimmed" ta="center">
              No recyclers available for your selected date and location. Please try a different date.
            </Text>
          </Paper>
        )}

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
            Confirm & Schedule Pickup
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Step3_ChooseRecycler;
