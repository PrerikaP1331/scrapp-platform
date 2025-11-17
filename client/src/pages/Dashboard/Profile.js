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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/user/profile');
      console.log('Full API Response:', res.data);
      console.log('Address object:', res.data.address);
      
      if (res.data) {
        const addr = res.data.address || {};
        console.log('Address values:', {
          line1: addr.addressLine1,
          line2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          postal: addr.postalCode
        });
        
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          addressLine1: addr.addressLine1 || '',
          addressLine2: addr.addressLine2 || '',
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.postalCode || ''
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setMessage('Error loading profile: ' + (err.response?.data?.msg || err.message));
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        phone: formData.phone,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        }
      };
      console.log('Sending payload:', payload);
      const res = await axios.put('/user/profile', payload);
      console.log('Save response:', res.data);
      setMessage('✓ Profile saved successfully!');
      // Reload the form with latest data
      loadProfile();
    } catch (err) {
      console.error('Save error:', err);
      setMessage('Error: ' + (err.response?.data?.msg || err.message));
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
              disabled
              description="Name cannot be changed. Please contact support if you need to update it."
            />

            <TextInput
              label="Email"
              placeholder="Email"
              value={formData.email}
              disabled
              description="Email cannot be changed. Please contact support to update."
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

            <TextInput
              label="Address Line 1"
              placeholder="Building name, street address"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.currentTarget.value })}
            />

            <TextInput
              label="Address Line 2 (Optional)"
              placeholder="Apt, Suite, etc."
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.currentTarget.value })}
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
