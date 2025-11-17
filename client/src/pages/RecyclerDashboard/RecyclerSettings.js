import React, { useState } from 'react';
import {
  Container, Paper, Title, Button, Stack, Group, TextInput, PasswordInput, Tabs,
  Avatar, Alert, ThemeIcon, Text, Divider, Modal, SimpleGrid
} from '@mantine/core';
import { IconUpload, IconCheck, IconAlertCircle, IconLock, IconUser, IconAlertTriangle } from '@tabler/icons-react';

function RecyclerSettings() {
  const [contactData, setContactData] = useState({
    firstName: 'Raj',
    lastName: 'Kumar',
    email: 'raj@greenwaste.com',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivationConfirmation, setDeactivationConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const businessName = 'GreenCycle Recycling';

  const handleSaveContact = () => {
    console.log('Saving contact:', contactData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePassword = () => {
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    console.log('Updating password');
    setSaved(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeactivateAccount = () => {
    if (deactivationConfirmation.toLowerCase() !== businessName.toLowerCase()) {
      window.alert(`Please type "${businessName}" to confirm account deactivation`);
      return;
    }

    console.log('Deactivating account');
    window.alert('Your account has been deactivated. You will be logged out shortly.');
    setDeactivateModalOpen(false);
    setDeactivationConfirmation('');
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={2} style={{ color: '#344e41' }}>Account Settings</Title>
          <Text size="sm" color="dimmed">Manage your login credentials and account preferences</Text>
        </div>

        {saved && (
          <Alert icon={<IconCheck />} title="Success" color="#588157" withCloseButton onClose={() => setSaved(false)}>
            Your changes have been saved successfully!
          </Alert>
        )}

        <Tabs value={activeTab} onTabChange={setActiveTab} orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="account" leftSection={<IconUser size={14} />}>Account</Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconLock size={14} />}>Security</Tabs.Tab>
            <Tabs.Tab value="danger" leftSection={<IconAlertTriangle size={14} />}>Danger Zone</Tabs.Tab>
          </Tabs.List>

          {/* Account Tab */}
          <Tabs.Panel value="account" pl="lg">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap="lg">
                <div>
                  <Title order={4} style={{ color: '#344e41' }} mb="xs">Primary Contact Information</Title>
                  <Text size="sm" color="dimmed" mb="lg">Manage your login and contact information</Text>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
                  <TextInput
                    label="First Name"
                    placeholder="First name"
                    value={contactData.firstName}
                    onChange={(e) => setContactData({ ...contactData, firstName: e.currentTarget.value })}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last name"
                    value={contactData.lastName}
                    onChange={(e) => setContactData({ ...contactData, lastName: e.currentTarget.value })}
                  />
                </SimpleGrid>

                <div>
                  <TextInput
                    label="Email Address (Primary Login)"
                    placeholder="your@email.com"
                    value={contactData.email}
                    disabled
                    description="This is your primary login and notification email. To transfer ownership of this account, please contact Scrapp support."
                  />
                </div>

                <div>
                  <Text fw={500} size="sm" mb="xs" style={{ color: '#344e41' }}>Business Associated:</Text>
                  <Paper p="md" radius="md" style={{ backgroundColor: '#ecebe5' }}>
                    <Text fw={600} style={{ color: '#344e41' }}>{businessName}</Text>
                    <Text size="sm" color="dimmed" mt="xs">This is the main business account. Account transfer requires support assistance for security purposes.</Text>
                  </Paper>
                </div>

                <Group justify="flex-end">
                  <Button variant="default">Cancel</Button>
                  <Button style={{ background: 'linear-gradient(135deg, #588157 0%, #3a5a40 100%)', color: '#ffffff', border: 'none' }} onClick={handleSaveContact}>Save Changes</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* Security Tab */}
          <Tabs.Panel value="security" pl="lg">
            <Stack gap="lg">
              <Paper p="lg" radius="md" withBorder>
                <Stack gap="lg">
                  <div>
                    <Title order={4} style={{ color: '#344e41' }} mb="xs">Change Password</Title>
                    <Text size="sm" color="dimmed">Update your login password to keep your account secure</Text>
                  </div>

                  {passwordError && (
                    <Alert icon={<IconAlertCircle />} title="Error" color="red" withCloseButton onClose={() => setPasswordError('')}>
                      {passwordError}
                    </Alert>
                  )}

                  <Stack gap="md">
                    <PasswordInput
                      label="Current Password"
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.currentTarget.value })}
                    />
                    <PasswordInput
                      label="New Password"
                      placeholder="Enter a new password"
                      description="Must be at least 8 characters with uppercase and numbers"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.currentTarget.value })}
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      placeholder="Confirm your new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.currentTarget.value })}
                    />
                  </Stack>

                  <Group justify="flex-end">
                    <Button variant="default" onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}>Cancel</Button>
                    <Button style={{ background: 'linear-gradient(135deg, #588157 0%, #3a5a40 100%)', color: '#ffffff', border: 'none' }} onClick={handleUpdatePassword}>Update Password</Button>
                  </Group>
                </Stack>
              </Paper>

              <Alert icon={<IconAlertCircle />} title="Password Security Tips" color="#588157">
                <Stack gap="xs">
                  <Text size="sm">• Use a unique password that you don't use elsewhere</Text>
                  <Text size="sm">• Include uppercase letters, numbers, and special characters</Text>
                  <Text size="sm">• Avoid using personal information like business name or phone</Text>
                  <Text size="sm">• Never share your password with anyone, including Scrapp staff</Text>
                </Stack>
              </Alert>
            </Stack>
          </Tabs.Panel>

          {/* Danger Zone Tab */}
          <Tabs.Panel value="danger" pl="lg">
            <Paper p="lg" radius="md" style={{ border: '2px solid #fa5252', backgroundColor: '#ffe0e0' }}>
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon size="lg" radius="md" color="red" variant="light">
                    <IconAlertTriangle size={20} />
                  </ThemeIcon>
                  <div>
                    <Title order={4} style={{ color: '#c92a2a' }}>Danger Zone</Title>
                    <Text size="sm" color="dimmed">Irreversible account actions</Text>
                  </div>
                </Group>

                <Divider />

                <div>
                  <Text fw={600} mb="xs" style={{ color: '#c92a2a' }}>Deactivate Scrapp Account</Text>
                  <Text size="sm" color="dimmed" mb="lg">
                    This will permanently deactivate your account and remove your profile from the Scrapp platform. All your data will be preserved but you will no longer receive new pickup requests. This action cannot be undone.
                  </Text>
                  <Button color="red" onClick={() => setDeactivateModalOpen(true)}>Deactivate Account</Button>
                </div>
              </Stack>
            </Paper>

          <Alert icon={<IconAlertCircle />} title="What Happens After Deactivation?" color="yellow" mt="lg">
            <Stack gap="xs">
              <Text size="sm">• Your profile will be hidden from the marketplace</Text>
              <Text size="sm">• You won't receive new pickup requests</Text>
              <Text size="sm">• Your historical data and transactions are preserved</Text>
              <Text size="sm">• You can reactivate your account by contacting support</Text>
            </Stack>
          </Alert>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Deactivation Confirmation Modal */}
      <Modal opened={deactivateModalOpen} onClose={() => { setDeactivateModalOpen(false); setDeactivationConfirmation(''); }} title="Confirm Account Deactivation" size="md" centered>
        <Stack gap="lg">
          <Alert icon={<IconAlertTriangle />} title="This action cannot be undone" color="red">
            Deactivating your account will immediately hide your profile and stop all future pickup requests. Your historical data will be preserved.
          </Alert>

          <div>
            <Text fw={600} mb="xs" style={{ color: '#344e41' }}>To confirm, please type your business name:</Text>
            <Text fw={700} size="lg" mb="lg" style={{ color: '#c92a2a' }}>{businessName}</Text>
            <TextInput placeholder={`Type "${businessName}" to confirm`} value={deactivationConfirmation} onChange={(e) => setDeactivationConfirmation(e.currentTarget.value)} />
          </div>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => { setDeactivateModalOpen(false); setDeactivationConfirmation(''); }}>Cancel</Button>
            <Button color="red" onClick={handleDeactivateAccount} disabled={deactivationConfirmation.toLowerCase() !== businessName.toLowerCase()}>Deactivate Account</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default RecyclerSettings;
