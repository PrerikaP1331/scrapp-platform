import React from 'react';
import { Container, Paper, Title, Button, TextInput, Textarea, Select, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';

function EditInitiative() {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    initialValues: {
      title: 'Office E-Waste Collection Week',
      description: 'Company-wide initiative to collect and properly recycle e-waste',
      startDate: '2025-11-18',
      endDate: '2025-11-25',
      category: 'collection',
      location: 'All office locations',
      isPublic: true,
      targetParticipants: '100',
    },
    validate: {
      title: (value) => !value ? 'Title is required' : null,
      startDate: (value) => !value ? 'Start date is required' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      console.log('Updating initiative:', values);
      alert('Initiative updated successfully!');
      navigate('/org-dashboard/initiatives');
    } catch (error) {
      console.error('Error updating initiative:', error);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Edit Sustainability Initiative</Title>
          <p style={{ color: '#666' }}>Update the initiative details and settings</p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Basic Information</Title>
                <Stack gap="md">
                  <TextInput
                    label="Initiative Title"
                    placeholder="e.g., Office E-Waste Collection Week"
                    {...form.getInputProps('title')}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe the initiative and its goals"
                    rows={3}
                    {...form.getInputProps('description')}
                  />
                </Stack>
              </div>

              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Schedule</Title>
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
                <Title order={4} style={{ color: '#344e41' }} mb="md">Initiative Details</Title>
                <Stack gap="md">
                  <Select
                    label="Category"
                    placeholder="Select category"
                    data={[
                      { value: 'training', label: 'Training/Education' },
                      { value: 'collection', label: 'Waste Collection' },
                      { value: 'challenge', label: 'Employee Challenge' },
                      { value: 'awareness', label: 'Awareness Campaign' },
                      { value: 'reduction', label: 'Waste Reduction' },
                    ]}
                    {...form.getInputProps('category')}
                  />
                  <TextInput
                    label="Location"
                    placeholder="Office or facility location"
                    {...form.getInputProps('location')}
                  />
                  <TextInput
                    label="Target Participants"
                    type="number"
                    placeholder="Expected number of participants"
                    {...form.getInputProps('targetParticipants')}
                  />
                </Stack>
              </div>

              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Visibility & Access</Title>
                <Group gap="lg">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.values.isPublic}
                      onChange={(e) => form.setFieldValue('isPublic', e.currentTarget.checked)}
                    />
                    {' '}Make this initiative PUBLIC (visible to all Scrapp users)
                  </label>
                </Group>
              </div>

              <Group justify="flex-end" gap="md" mt="lg">
                <Button variant="default" onClick={() => navigate('/org-dashboard/initiatives')}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: '#588157' }} type="submit">
                  Update Initiative
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default EditInitiative;
