import React from 'react';
import { Container, Paper, Title, Button, TextInput, Textarea, Select, Stack, Group, Checkbox, FileInput, Tabs } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

function CreateDrive() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      wasteTypes: '',
      location: '',
      isPublic: true,
      targetQuantity: '',
      image: null,
    },
    validate: {
      title: (value) => !value ? 'Title is required' : null,
      startDate: (value) => !value ? 'Start date is required' : null,
      location: (value) => !value ? 'Location is required' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      // TODO: Replace with API call to /communities/drives
      console.log('Creating drive:', values);
      alert('Drive created successfully!');
      navigate('/community-dashboard/drives');
    } catch (error) {
      console.error('Error creating drive:', error);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Create New Drive</Title>
          <p style={{ color: '#666' }}>Set up a new recycling drive for your community</p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              {/* Basic Information */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Basic Information</Title>
                <Stack gap="md">
                  <TextInput
                    label="Drive Title"
                    placeholder="e.g., E-waste Collection Drive"
                    {...form.getInputProps('title')}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe the drive, its goals, and what waste types are accepted"
                    rows={3}
                    {...form.getInputProps('description')}
                  />
                </Stack>
              </div>

              {/* Dates */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Duration</Title>
                <Stack gap="md">
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
                </Stack>
              </div>

              {/* Drive Details */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Drive Details</Title>
                <Stack gap="md">
                  <Textarea
                    label="Waste Types Accepted"
                    placeholder="e.g., Plastic, Glass, Paper, Metals, E-waste"
                    rows={2}
                    {...form.getInputProps('wasteTypes')}
                  />
                  <TextInput
                    label="Collection Location"
                    placeholder="e.g., Community Center, Basement"
                    {...form.getInputProps('location')}
                  />
                  <TextInput
                    label="Target Quantity (kg)"
                    type="number"
                    placeholder="Leave empty for no target"
                    {...form.getInputProps('targetQuantity')}
                  />
                </Stack>
              </div>

              {/* Visibility */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Visibility & Access</Title>
                <Stack gap="md">
                  <Checkbox
                    label="Make this drive PUBLIC (visible to all Scrapp users)"
                    description="Private drives are only visible to community members"
                    {...form.getInputProps('isPublic', { type: 'checkbox' })}
                  />
                </Stack>
              </div>

              {/* Media */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Media</Title>
                <Stack gap="md">
                  <FileInput
                    label="Upload Drive Banner Image"
                    placeholder="Click to upload image"
                    icon={<IconUpload size={14} />}
                    {...form.getInputProps('image')}
                  />
                </Stack>
              </div>

              {/* Submit */}
              <Group justify="flex-end" gap="md" mt="lg">
                <Button variant="default" onClick={() => navigate('/community-dashboard/drives')}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: '#588157' }} type="submit">
                  Create Drive
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default CreateDrive;
