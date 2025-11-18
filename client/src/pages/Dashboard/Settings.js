import React, { useEffect, useState, useContext } from 'react';
import { Container, Tabs, Card, Stack, Group, TextInput, PasswordInput, Button, Title, Text, Divider, Alert, Checkbox, Skeleton } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconShield, IconBell, IconUser } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../api/axios';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Profile tab state
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '' });
  const [profileChanged, setProfileChanged] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Security tab state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Notifications tab state
  const [notifications, setNotifications] = useState({
    pickupReminders: { email: true, push: false },
    communityUpdates: { email: true, push: true },
    rewardsPromos: { email: true, push: false }
  });
  const [notificationsChanged, setNotificationsChanged] = useState(false);
  const [notificationsSaving, setNotificationsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/user/profile');
      console.log('Full API Response:', res.data);
      console.log('Address object:', res.data.address);
      
      if (res.data) {
        const addr = res.data.address || {};
        const newProfileData = {
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          addressLine1: addr.addressLine1 || '',
          addressLine2: addr.addressLine2 || '',
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.postalCode || ''
        };
        console.log('Loaded profile data:', newProfileData);
        setProfileData(newProfileData);
        if (res.data.notifications) {
          setNotifications(res.data.notifications);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      showMessage('Error loading profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    setProfileChanged(true);
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setMessage('');
    try {
      const payload = {
        phone: profileData.phone,
        address: {
          addressLine1: profileData.addressLine1,
          addressLine2: profileData.addressLine2,
          city: profileData.city,
          state: profileData.state,
          postalCode: profileData.postalCode
        }
      };
      console.log('Sending payload:', payload);
      const res = await axios.put('/api/user/profile', payload);
      console.log('Save response:', res.data);
      showMessage('✓ Profile updated successfully!', 'success');
      setProfileChanged(false);
      // Reload to verify
      loadProfile();
    } catch (err) {
      console.error('Save error:', err);
      showMessage(err.response?.data?.msg || 'Error updating profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordErrors('');
    
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordErrors('All fields are required');
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      setPasswordErrors('New password must be at least 6 characters');
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordErrors('Passwords do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await axios.put('/api/user/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      });
      showMessage('Password changed successfully! Please log in again.', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMessage(err.response?.data?.msg || 'Error changing password', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleNotificationToggle = (type, channel) => {
    const updated = {
      ...notifications,
      [type]: { ...notifications[type], [channel]: !notifications[type][channel] }
    };
    setNotifications(updated);
    setNotificationsChanged(true);
  };

  const handleNotificationsSave = async () => {
    setNotificationsSaving(true);
    try {
      await axios.put('/api/user/notifications', { notifications });
      showMessage('Notification preferences saved!', 'success');
      setNotificationsChanged(false);
    } catch (err) {
      showMessage(err.response?.data?.msg || 'Error saving preferences', 'error');
    } finally {
      setNotificationsSaving(false);
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
        <div>
          <Title order={2}>Profile & Settings</Title>
          <Text c="dimmed">Manage your personal information and preferences</Text>
        </div>

        {/* Messages */}
        {message && (
          <Alert
            icon={messageType === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
            color={messageType === 'success' ? 'green' : 'red'}
          >
            {message}
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={14} />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconShield size={14} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={14} />}>
              Notifications
            </Tabs.Tab>
          </Tabs.List>

          {/* PROFILE TAB */}
          <Tabs.Panel value="profile" py="md">
            <Stack gap="lg">
              <Card withBorder p="lg">
                <Stack gap="md">
                  <div>
                    <Title order={3}>Personal Information</Title>
                    <Text size="sm" c="dimmed">Update your account details</Text>
                  </div>
                  <Divider />

                  <TextInput
                    label="Full Name"
                    placeholder="Your name"
                    value={profileData.name}
                    disabled
                    description="Name cannot be changed. Please contact support if you need to update it."
                  />

                  <TextInput
                    label="Email Address"
                    placeholder="Email"
                    value={profileData.email}
                    disabled
                    description="To change your email, please contact support."
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="+91 XXXXX XXXXX"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.currentTarget.value)}
                  />
                </Stack>
              </Card>

              <Card withBorder p="lg">
                <Stack gap="md">
                  <div>
                    <Title order={3}>Default Pickup Address</Title>
                    <Text size="sm" c="dimmed">This is where we'll pick up your waste</Text>
                  </div>
                  <Divider />

                  <TextInput
                    label="Address Line 1"
                    placeholder="Building/house number, street"
                    value={profileData.addressLine1}
                    onChange={(e) => handleProfileChange('addressLine1', e.currentTarget.value)}
                  />

                  <TextInput
                    label="Address Line 2 (Optional)"
                    placeholder="Apt, Suite, etc."
                    value={profileData.addressLine2}
                    onChange={(e) => handleProfileChange('addressLine2', e.currentTarget.value)}
                  />

                  <Group grow>
                    <TextInput
                      label="City"
                      placeholder="City"
                      value={profileData.city}
                      onChange={(e) => handleProfileChange('city', e.currentTarget.value)}
                    />
                    <TextInput
                      label="State"
                      placeholder="State"
                      value={profileData.state}
                      onChange={(e) => handleProfileChange('state', e.currentTarget.value)}
                    />
                  </Group>

                  <TextInput
                    label="Postal Code"
                    placeholder="ZIP/Postal code"
                    value={profileData.postalCode}
                    onChange={(e) => handleProfileChange('postalCode', e.currentTarget.value)}
                  />
                </Stack>
              </Card>

              <Button
                size="lg"
                onClick={handleProfileSave}
                loading={profileSaving}
                disabled={!profileChanged}
              >
                Save Changes
              </Button>
            </Stack>
          </Tabs.Panel>

          {/* SECURITY TAB */}
          <Tabs.Panel value="security" py="md">
            <Stack gap="lg">
              <Card withBorder p="lg">
                <Stack gap="md">
                  <div>
                    <Title order={3}>Change Password</Title>
                    <Text size="sm" c="dimmed">Keep your account secure with a strong password</Text>
                  </div>
                  <Divider />

                  {passwordErrors && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red">
                      {passwordErrors}
                    </Alert>
                  )}

                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.currentTarget.value })}
                  />

                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password (min 6 characters)"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.currentTarget.value })}
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.currentTarget.value })}
                  />

                  <Button
                    size="lg"
                    onClick={handlePasswordChange}
                    loading={passwordSaving}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Tabs.Panel>

          {/* NOTIFICATIONS TAB */}
          <Tabs.Panel value="notifications" py="md">
            <Stack gap="lg">
              <Card withBorder p="lg">
                <Stack gap="md">
                  <div>
                    <Title order={3}>Notification Preferences</Title>
                    <Text size="sm" c="dimmed">Choose how you'd like to hear from us</Text>
                  </div>
                  <Divider />

                  {/* Pickup Reminders */}
                  <div>
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={600}>Pickup Reminders</Text>
                        <Text size="sm" c="dimmed">Get notified a day before your scheduled pickup</Text>
                      </div>
                    </Group>
                    <Group gap="lg" ml="xs">
                      <Checkbox
                        label="Email"
                        checked={notifications.pickupReminders.email}
                        onChange={() => handleNotificationToggle('pickupReminders', 'email')}
                      />
                      <Checkbox
                        label="Push Notification"
                        checked={notifications.pickupReminders.push}
                        onChange={() => handleNotificationToggle('pickupReminders', 'push')}
                      />
                    </Group>
                  </div>

                  <Divider />

                  {/* Community Updates */}
                  <div>
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={600}>Community Updates</Text>
                        <Text size="sm" c="dimmed">Receive updates about new posts and announcements in your communities</Text>
                      </div>
                    </Group>
                    <Group gap="lg" ml="xs">
                      <Checkbox
                        label="Email"
                        checked={notifications.communityUpdates.email}
                        onChange={() => handleNotificationToggle('communityUpdates', 'email')}
                      />
                      <Checkbox
                        label="Push Notification"
                        checked={notifications.communityUpdates.push}
                        onChange={() => handleNotificationToggle('communityUpdates', 'push')}
                      />
                    </Group>
                  </div>

                  <Divider />

                  {/* Rewards & Promotions */}
                  <div>
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={600}>Rewards & Promotions</Text>
                        <Text size="sm" c="dimmed">Be the first to know when you've earned a new coupon or about special offers</Text>
                      </div>
                    </Group>
                    <Group gap="lg" ml="xs">
                      <Checkbox
                        label="Email"
                        checked={notifications.rewardsPromos.email}
                        onChange={() => handleNotificationToggle('rewardsPromos', 'email')}
                      />
                      <Checkbox
                        label="Push Notification"
                        checked={notifications.rewardsPromos.push}
                        onChange={() => handleNotificationToggle('rewardsPromos', 'push')}
                      />
                    </Group>
                  </div>
                </Stack>
              </Card>

              <Button
                size="lg"
                onClick={handleNotificationsSave}
                loading={notificationsSaving}
                disabled={!notificationsChanged}
              >
                Save Preferences
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default Settings;
