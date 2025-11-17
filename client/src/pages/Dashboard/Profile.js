import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Stack, Group, TextInput, Textarea, Button, Title, Text, Avatar, Badge, Alert, Skeleton } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../api/axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/user/profile');
      if (res.data) {
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address?.street || '',
          city: res.data.address?.city || '',
          state: res.data.address?.state || '',
          postalCode: res.data.address?.postalCode || ''
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err.response?.data || err.message);
      setMessage(err.response?.data?.msg || 'Error loading profile');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put('/api/user/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack gap="lg">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={60} radius="md" />)}
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Avatar name={user?.name} size="lg" radius="xl" />
          <div>
            <Title order={2}>{user?.name || 'User Profile'}</Title>
            <Badge variant="light">{user?.role || 'Individual'}</Badge>
          </div>
        </Group>

        {/* Messages */}
        {message && (
          <Alert icon={message.includes('success') ? <IconCheck size={16} /> : <IconAlertCircle size={16} />} color={message.includes('success') ? 'green' : 'red'}>
            {message}
          </Alert>
        )}

        {/* Profile Form */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <div>
              <Title order={3}>Personal Information</Title>
              <Text size="sm" c="dimmed">Update your account details</Text>
            </div>

            <TextInput
              label="Full Name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
            />

            <TextInput
              label="Email"
              placeholder="Email"
              value={formData.email}
              disabled
            />

            <TextInput
              label="Phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.currentTarget.value })}
            />
          </Stack>
        </Card>

        {/* Address */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <div>
              <Title order={3}>Address</Title>
              <Text size="sm" c="dimmed">Help us deliver your pickups correctly</Text>
            </div>

            <Textarea
              label="Street Address"
              placeholder="Building name, street address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.currentTarget.value })}
              minRows={2}
            />

            <Group grow>
              <TextInput
                label="City"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.currentTarget.value })}
              />
              <TextInput
                label="State"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.currentTarget.value })}
              />
              <TextInput
                label="Postal Code"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.currentTarget.value })}
              />
            </Group>
          </Stack>
        </Card>

        {/* Save Button */}
        <Button size="lg" onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </Stack>
    </Container>
  );
};

export default Profile;
