import { useEffect, useState, useContext } from 'react';
import { Container, Stack, Group, Title, Tabs, Card, Text, TextInput, PasswordInput, Button, Grid, Select, Modal, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { getMe, updateProfileName, changePassword } from '../../api/userService';
import { getCommunityDetails, updateCommunityDetails } from '../../api/communityService';

function CommunitySettings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Community state
  const [community, setCommunity] = useState({
    name: '',
    type: '',
    households: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    state: ''
  });
  const [communityDirty, setCommunityDirty] = useState(false);
  const [savingCommunity, setSavingCommunity] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getMe();
        setProfile({ name: me?.name || '', email: me?.email || '' });
      } catch (_) {}
      if (user?.communityId) {
        try {
          const cd = await getCommunityDetails(user.communityId);
          setCommunity({
            name: cd?.name || '',
            type: cd?.type || '',
            households: cd?.households || '',
            address1: cd?.address?.line1 || '',
            address2: cd?.address?.line2 || '',
            city: cd?.address?.city || '',
            postalCode: cd?.address?.postalCode || '',
            state: cd?.address?.state || ''
          });
        } catch (_) {}
      }
    };
    load();
  }, [user?.communityId]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfileName(profile.name);
      notifications.show({ title: 'Profile Updated', message: 'Your name has been updated.', color: 'green' });
    } catch (_) {
      notifications.show({ title: 'Error', message: 'Failed to update profile', color: 'red' });
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      notifications.show({ title: 'Error', message: 'New passwords do not match', color: 'red' });
      return;
    }
    setUpdatingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      notifications.show({ title: 'Password Updated', message: 'Your password has been changed.', color: 'green' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (_) {
      notifications.show({ title: 'Error', message: 'Failed to update password', color: 'red' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const saveCommunity = async () => {
    if (!user?.communityId) return;
    setSavingCommunity(true);
    try {
      const payload = {
        name: community.name,
        households: community.households,
        address: {
          line1: community.address1,
          line2: community.address2,
          city: community.city,
          postalCode: community.postalCode,
          state: community.state
        }
      };
      await updateCommunityDetails(user.communityId, payload);
      notifications.show({ title: 'Community Updated', message: 'Community details saved.', color: 'green' });
      setCommunityDirty(false);
    } catch (_) {
      notifications.show({ title: 'Error', message: 'Failed to save community details', color: 'red' });
    } finally {
      setSavingCommunity(false);
    }
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Settings</Title>
            <Text c="dimmed">Manage your personal and community settings</Text>
          </div>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="profile">My Profile</Tabs.Tab>
            <Tabs.Tab value="community">Community Details</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <Stack gap="lg" mt="md">
              <Card withBorder p="lg" radius="md">
                <Text fw={600} mb="md">Personal Information</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Email Address" value={profile.email} disabled />
                    <Text size="xs" c="dimmed" mt="xs">This is your login email. To transfer ownership of this community to a different admin, please contact support.</Text>
                  </Grid.Col>
                </Grid>
                <Group mt="md">
                  <Button loading={savingProfile} onClick={saveProfile}>Save Profile Changes</Button>
                </Group>
              </Card>

              <Card withBorder p="lg" radius="md">
                <Text fw={600} mb="md">Change Password</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <PasswordInput label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <PasswordInput label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Grid.Col>
                </Grid>
                <Group mt="md">
                  <Button loading={updatingPassword} onClick={updatePassword}>Update Password</Button>
                </Group>
              </Card>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="community">
            <Stack gap="lg" mt="md">
              <Card withBorder p="lg" radius="md">
                <Text fw={600} mb="md">Core Information</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Community Name" value={community.name} onChange={(e) => { setCommunity({ ...community, name: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Community Type" value={community.type} disabled />
                    <Text size="xs" c="dimmed" mt="xs">To change your community type, please contact support.</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select label="Approximate Number of Households" data={[
                      { value: '1-50', label: '1-50' },
                      { value: '51-200', label: '51-200' },
                      { value: '201-500', label: '201-500' },
                      { value: '500+', label: '500+' }
                    ]} value={community.households} onChange={(v) => { setCommunity({ ...community, households: v }); setCommunityDirty(true); }} />
                  </Grid.Col>
                </Grid>
              </Card>

              <Card withBorder p="lg" radius="md">
                <Text fw={600} mb="md">Location</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Address Line 1" value={community.address1} onChange={(e) => { setCommunity({ ...community, address1: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput label="Address Line 2" value={community.address2} onChange={(e) => { setCommunity({ ...community, address2: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput label="City" value={community.city} onChange={(e) => { setCommunity({ ...community, city: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput label="Postal / ZIP Code" value={community.postalCode} onChange={(e) => { setCommunity({ ...community, postalCode: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput label="State / Province" value={community.state} onChange={(e) => { setCommunity({ ...community, state: e.target.value }); setCommunityDirty(true); }} />
                  </Grid.Col>
                </Grid>
              </Card>

              <Card withBorder p="lg" radius="md" style={{ borderColor: '#ff6b6b' }}>
                <Text fw={700} c="red" mb="sm">Danger Zone</Text>
                <Text c="dimmed" size="sm" mb="md">This action is permanent and cannot be undone. This will delete all community data, including member lists, drives, and impact reports.</Text>
                <Button color="red" variant="light" onClick={() => setDangerModalOpen(true)}>Delete this Community</Button>
              </Card>

              <Group>
                <Button disabled={!communityDirty} loading={savingCommunity} onClick={saveCommunity}>Save Community Details</Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Modal opened={dangerModalOpen} onClose={() => setDangerModalOpen(false)} title="Confirm Deletion">
          <Stack gap="md">
            <Text>Type the community name to confirm deletion.</Text>
            <Badge variant="light">{community.name || 'Community Name'}</Badge>
            <TextInput placeholder="Type community name" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setDangerModalOpen(false)}>Cancel</Button>
              <Button color="red" disabled={confirmName !== community.name} onClick={() => setDangerModalOpen(false)}>Confirm Delete</Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}

export default CommunitySettings;
