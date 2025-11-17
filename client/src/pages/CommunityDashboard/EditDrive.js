import React from 'react';
import { Container, Paper, Title, Button, TextInput, Textarea, Select, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';

function EditDrive() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - replace with API call
  const driveData = {
    id,
    title: 'E-waste Drive',
    description: 'Community-wide electronic waste collection',
    startDate: '2025-11-20',
    endDate: '2025-11-20',
    wasteTypes: 'Electronics, Old phones, Cables',
    location: 'Community Center',
    targetQuantity: '500',
    isPublic: true,
  };

  const form = useForm({
    initialValues: driveData,
    validate: {
      title: (value) => !value ? 'Title is required' : null,
      startDate: (value) => !value ? 'Start date is required' : null,
      location: (value) => !value ? 'Location is required' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      // TODO: Replace with API call to /communities/drives/:id
      console.log('Updating drive:', values);
      alert('Drive updated successfully!');
      navigate('/community-dashboard/drives');
    } catch (error) {
      console.error('Error updating drive:', error);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Edit Drive</Title>
          <p style={{ color: '#666' }}>Update the details of your recycling drive</p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Basic Information</Title>
                <Stack gap="md">
                  <TextInput
                    label="Drive Title"
                    {...form.getInputProps('title')}
                  />
                  <Textarea
                    label="Description"
                    rows={3}
                    {...form.getInputProps('description')}
                  />
                </Stack>
              </div>

              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Duration</Title>
                <Group grow>
                  <TextInput
                    label="Start Date"
                    type="date"
                    {...form.getInputProps('startDate')}
                  />
                  <TextInput
                    label="End Date"
                    type="date"
                    {...form.getInputProps('endDate')}
                  />
                </Group>
              </div>

              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Drive Details</Title>
                <Stack gap="md">
                  <Textarea
                    label="Waste Types Accepted"
                    rows={2}
                    {...form.getInputProps('wasteTypes')}
                  />
                  <TextInput
                    label="Collection Location"
                    {...form.getInputProps('location')}
                  />
                  <TextInput
                    label="Target Quantity (kg)"
                    type="number"
                    {...form.getInputProps('targetQuantity')}
                  />
                </Stack>
              </div>

              <Group justify="flex-end" gap="md" mt="lg">
                <Button variant="default" onClick={() => navigate('/community-dashboard/drives')}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: '#588157' }} type="submit">
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default EditDrive;
