import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Stack,
  Group,
  TextInput,
  Select,
  Checkbox,
  Grid,
  Card,
  Text,
  Switch,
  FileInput,
  LoadingOverlay,
  Alert,
  Box,
  Divider
} from '@mantine/core';
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconWorld,
  IconLock,
  IconUpload,
  IconInfoCircle
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createDrive } from '../../api/driveService';
import { getAdminCommunity, getUserCommunities } from '../../api/communityService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateDrive() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  const form = useForm({
    initialValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      wasteTypes: [],
      visibility: 'public',
      maxParticipants: ''
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      date: (value) => (!value ? 'Date is required' : null),
      time: (value) => (!value ? 'Time is required' : null),
      location: (value) => (!value ? 'Location is required' : null),
      description: (value) => (!value || value === '<p><br></p>' ? 'Description is required' : null),
      wasteTypes: (value) => (value.length === 0 ? 'At least one waste type is required' : null)
    }
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote'
  ];

  const wasteTypeOptions = [
    { value: 'e-waste', label: 'E-Waste (Electronics)' },
    { value: 'textiles', label: 'Textiles (Clothes)' },
    { value: 'furniture', label: 'Old Furniture' },
    { value: 'plastic', label: 'Plastic Waste' },
    { value: 'paper', label: 'Paper & Cardboard' },
    { value: 'metal', label: 'Metal Scrap' },
    { value: 'glass', label: 'Glass' },
    { value: 'batteries', label: 'Batteries' }
  ];

  const handleWasteTypeToggle = (wasteType) => {
    const currentTypes = form.values.wasteTypes;
    if (currentTypes.includes(wasteType)) {
      form.setFieldValue('wasteTypes', currentTypes.filter(type => type !== wasteType));
    } else {
      form.setFieldValue('wasteTypes', [...currentTypes, wasteType]);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let communityId = user?.communityId || localStorage.getItem('communityId');
      if (!communityId) {
        try {
          const c = await getAdminCommunity();
          communityId = c?._id || c?.id;
          if (communityId) localStorage.setItem('communityId', communityId);
        } catch (_) {}
      }
      if (!communityId) {
        try {
          const my = await getUserCommunities();
          const list = Array.isArray(my?.data) ? my.data : my;
          communityId = (Array.isArray(list) && (list[0]?._id || list[0]?.id)) || communityId;
          if (communityId) localStorage.setItem('communityId', communityId);
        } catch (_) {}
      }
      if (!communityId) {
        notifications.show({ title: 'Error', message: 'Community ID not found', color: 'red' });
        return;
      }

      const driveData = {
        ...values,
        communityId,
        date: new Date(values.date).toISOString(),
        time: values.time ? new Date(`2000-01-01T${values.time}`).toISOString() : undefined,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : undefined
      };

      await createDrive(driveData);
      
      notifications.show({
        title: 'Success',
        message: 'Drive created successfully',
        color: 'green'
      });
      
      navigate('/community-dashboard/drives');
    } catch (error) {
      notifications.show({
        title: 'Error creating drive',
        message: error.response?.data?.msg || 'Failed to create drive',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg">
      <LoadingOverlay visible={loading} />
      
      <Stack gap="lg">
        <style>{`
          .quill-error .ql-toolbar {
            border-bottom: 1px solid #ff6b6b !important;
          }
          .quill-error .ql-container {
            border-top: 1px solid #ff6b6b !important;
          }
          .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #e9ecef !important;
          }
          .ql-container {
            border: none !important;
            border-top: 1px solid #e9ecef !important;
            font-size: 14px;
          }
          .ql-editor {
            min-height: 150px;
          }
        `}</style>
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Create New Drive</Title>
            <p style={{ color: '#666' }}>Set up a community recycling drive</p>
          </div>
          <Button variant="subtle" onClick={() => navigate('/community-dashboard/drives')}>
            Back to Drives
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* Basic Information */}
            <Paper withBorder radius="md" p="lg">
              <Title order={4} mb="md">Basic Information</Title>
              
              <Stack gap="md">
                <TextInput
                  label="Drive Title"
                  placeholder="e.g., Annual E-Waste Collection Drive"
                  required
                  {...form.getInputProps('title')}
                />

                <Grid>
                  <Grid.Col span={{ base: 6 }}>
                    <TextInput
                      label="Date"
                      type="date"
                      required
                      {...form.getInputProps('date')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 6 }}>
                    <TextInput
                      label="Time"
                      type="time"
                      required
                      {...form.getInputProps('time')}
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="Location / Venue"
                  placeholder="e.g., Community Clubhouse Parking Lot"
                  required
                  leftSection={<IconMapPin size={16} />}
                  {...form.getInputProps('location')}
                />

                <Stack gap={4}>
                  <Text size="sm" fw={500}>
                    Detailed Description
                    <Text component="span" c="red" ml={4}>*</Text>
                  </Text>
                  <Box 
                    className={form.errors.description ? 'quill-error' : ''}
                    style={{ 
                      border: form.errors.description ? '1px solid #ff6b6b' : '1px solid #e9ecef',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={form.values.description}
                      onChange={(value) => form.setFieldValue('description', value)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Describe the purpose, goals, and any special instructions for this drive..."
                      style={{ height: '200px' }}
                    />
                  </Box>
                  {form.errors.description && (
                    <Text size="xs" c="red">{form.errors.description}</Text>
                  )}
                </Stack>

                <FileInput
                  label="Cover Photo (Optional)"
                  placeholder="Upload an image for the drive announcement"
                  leftSection={<IconUpload size={16} />}
                  accept="image/*"
                  value={coverImage}
                  onChange={setCoverImage}
                />
              </Stack>
            </Paper>

            {/* Waste Types */}
            <Paper withBorder radius="md" p="lg">
              <Title order={4} mb="md">Accepted Waste Types</Title>
              
              <Text size="sm" c="dimmed" mb="md">
                Select the types of waste that will be accepted at this drive
              </Text>

              <Grid>
                {wasteTypeOptions.map((option) => (
                  <Grid.Col span={{ base: 6, md: 3 }} key={option.value}>
                    <Checkbox
                      label={option.label}
                      checked={form.values.wasteTypes.includes(option.value)}
                      onChange={() => handleWasteTypeToggle(option.value)}
                    />
                  </Grid.Col>
                ))}
              </Grid>
              
              {form.errors.wasteTypes && (
                <Text size="sm" c="red" mt="xs">
                  {form.errors.wasteTypes}
                </Text>
              )}
            </Paper>

            {/* Visibility Settings */}
            <Paper withBorder radius="md" p="lg">
              <Title order={4} mb="md">Visibility Settings</Title>
              
              <Stack gap="md">
                <Card withBorder p="md" radius="md">
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={600} mb="xs">
                        <Group gap={8}>
                          {form.values.visibility === 'public' ? <IconWorld size={16} /> : <IconLock size={16} />}
                          {form.values.visibility === 'public' ? 'Public Drive' : 'Private Drive'}
                        </Group>
                      </Text>
                      <Text size="sm" c="dimmed">
                        {form.values.visibility === 'public' 
                          ? 'Visible to all Scrapp users and can attract participants from outside your community'
                          : 'Only visible to your community members'
                        }
                      </Text>
                    </div>
                    <Switch
                      checked={form.values.visibility === 'public'}
                      onChange={(e) => form.setFieldValue('visibility', e.target.checked ? 'public' : 'private')}
                      size="lg"
                    />
                  </Group>
                </Card>

                <TextInput
                  label="Maximum Participants (Optional)"
                  placeholder="Leave empty for unlimited"
                  type="number"
                  min={1}
                  {...form.getInputProps('maxParticipants')}
                />
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Group justify="flex-end" gap="md">
              <Button variant="subtle" onClick={() => navigate('/community-dashboard/drives')}>
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: '#588157' }}>
                Create Drive
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}

export default CreateDrive;
