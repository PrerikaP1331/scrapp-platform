import React from 'react';
import { Container, Paper, Title, Button, TextInput, Textarea, Select, Stack, Group, Checkbox, FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

function CreateInitiative() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      location: '',
      isPublic: true,
      targetParticipants: '',
      image: null,
    },
    validate: {
      title: (value) => !value ? 'Title is required' : null,
      startDate: (value) => !value ? 'Start date is required' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      console.log('Creating initiative:', values);
      alert('Initiative created successfully!');
      navigate('/org-dashboard/initiatives');
    } catch (error) {
      console.error('Error creating initiative:', error);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Create Sustainability Initiative</Title>
          <p style={{ color: '#666' }}>Launch a new sustainability campaign or program</p>
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
                <Checkbox
                  label="Make this initiative PUBLIC (visible to all Scrapp users)"
                  description="Private initiatives are only visible to organization employees"
                  {...form.getInputProps('isPublic', { type: 'checkbox' })}
                />
              </div>

              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Media</Title>
                <FileInput
                  label="Upload Initiative Banner"
                  placeholder="Click to upload image"
                  icon={<IconUpload size={14} />}
                  {...form.getInputProps('image')}
                />
              </div>

              <Group justify="flex-end" gap="md" mt="lg">
                <Button variant="default" onClick={() => navigate('/org-dashboard/initiatives')}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: '#588157' }} type="submit">
                  Create Initiative
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default CreateInitiative;
