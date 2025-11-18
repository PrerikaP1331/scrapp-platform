import React, { useState } from 'react';
import { Container, Paper, Title, Button, TextInput, Textarea, Select, Stack, Group, Checkbox, FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

function ScheduleBulkPickup() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      wasteTypes: '',
      isRecurring: false,
      frequency: 'weekly',
      volume: '',
      purchaseOrder: '',
      instructions: '',
      file: null,
    },
    validate: {
      title: (value) => !value ? 'Title is required' : null,
      date: (value) => !value ? 'Date is required' : null,
      location: (value) => !value ? 'Location is required' : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Scheduling bulk pickup:', values);
      setTimeout(() => {
        setLoading(false);
        form.reset();
        alert('Bulk pickup scheduled successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      setLoading(false);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Schedule Bulk Pickup</Title>
          <p style={{ color: '#666' }}>Schedule large-volume commercial waste collection for your organization</p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              {/* Basic Information */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Pickup Details</Title>
                <Stack gap="md">
                  <TextInput
                    label="Pickup Title"
                    placeholder="e.g., Monthly Waste Collection"
                    {...form.getInputProps('title')}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe the pickup and waste streams"
                    rows={3}
                    {...form.getInputProps('description')}
                  />
                  <Group grow>
                    <TextInput
                      label="Date"
                      type="date"
                      {...form.getInputProps('date')}
                    />
                    <TextInput
                      label="Time"
                      type="time"
                      {...form.getInputProps('time')}
                    />
                  </Group>
                  <TextInput
                    label="Pickup Location"
                    placeholder="Building address or warehouse location"
                    {...form.getInputProps('location')}
                  />
                </Stack>
              </div>

              {/* Waste Details */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Waste Information</Title>
                <Stack gap="md">
                  <Textarea
                    label="Waste Types"
                    placeholder="e.g., Cardboard, E-waste, Paper, Plastic"
                    rows={2}
                    {...form.getInputProps('wasteTypes')}
                  />
                  <TextInput
                    label="Estimated Volume (kg)"
                    type="number"
                    placeholder="Approximate weight"
                    {...form.getInputProps('volume')}
                  />
                  <TextInput
                    label="Purchase Order / Reference Number"
                    placeholder="Internal reference code"
                    {...form.getInputProps('purchaseOrder')}
                  />
                </Stack>
              </div>

              {/* Recurring Setup */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Recurring Schedule</Title>
                <Stack gap="md">
                  <Checkbox
                    label="Make this a recurring pickup"
                    {...form.getInputProps('isRecurring', { type: 'checkbox' })}
                  />
                  {form.values.isRecurring && (
                    <Select
                      label="Frequency"
                      placeholder="Select frequency"
                      data={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'biweekly', label: 'Bi-weekly' },
                        { value: 'monthly', label: 'Monthly' },
                      ]}
                      {...form.getInputProps('frequency')}
                    />
                  )}
                </Stack>
              </div>

              {/* Additional Info */}
              <div>
                <Title order={4} style={{ color: '#344e41' }} mb="md">Additional Information</Title>
                <Stack gap="md">
                  <Textarea
                    label="Special Instructions"
                    placeholder="Any specific handling or access requirements"
                    rows={3}
                    {...form.getInputProps('instructions')}
                  />
                  <FileInput
                    label="Attach Documentation"
                    placeholder="Upload waste manifest or inventory list"
                    icon={<IconUpload size={14} />}
                    {...form.getInputProps('file')}
                  />
                </Stack>
              </div>

              {/* Submit */}
              <Group justify="flex-end" gap="md" mt="lg">
                <Button variant="default" onClick={() => form.reset()}>
                  Clear
                </Button>
                <Button
                  style={{ backgroundColor: '#588157' }}
                  loading={loading}
                  type="submit"
                >
                  Schedule Pickup
                </Button>
              </Group>
            </Stack>
          </Paper>
        </form>
      </Stack>
    </Container>
  );
}

export default ScheduleBulkPickup;
