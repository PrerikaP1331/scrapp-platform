import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Stack,
  Group,
  TextInput,
  Tabs,
  Table,
  Card,
  Text,
  Badge,
  ActionIcon,
  Modal,
  Textarea,
  LoadingOverlay,
  Box,
  Menu,
  Center
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconUserX,
  IconCheck,
  IconX,
  IconMail,
  IconClock,
  IconUserCheck
} from '@tabler/icons-react';
// import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { memberService } from '../../api/memberService';
import { getAdminCommunity, getUserCommunities } from '../../api/communityService';

function ManageResidents() {
  // const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // State for API data
  const [activeResidents, setActiveResidents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [invitationsSent, setInvitationsSent] = useState([]);

  // Fetch data on component mount and when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let cid = user?.communityId || localStorage.getItem('communityId');
      if (!cid) {
        try {
          const c = await getAdminCommunity();
          cid = c?._id || c?.id;
          if (cid) localStorage.setItem('communityId', cid);
        } catch (_) {}
      }
      if (!cid) {
        try {
          const my = await getUserCommunities();
          const list = Array.isArray(my?.data) ? my.data : my;
          cid = (Array.isArray(list) && (list[0]?._id || list[0]?.id)) || cid;
          if (cid) localStorage.setItem('communityId', cid);
        } catch (_) {}
      }
      if (!cid) {
        notifications.show({ title: 'Error', message: 'Community ID not found', color: 'red' });
        return;
      }
      if (activeTab === 'active') {
        const residents = await memberService.getActiveResidents(cid);
        setActiveResidents(residents);
      } else if (activeTab === 'pending') {
        const requests = await memberService.getPendingRequests(cid);
        setPendingRequests(requests);
      } else if (activeTab === 'invitations') {
        const invitations = await memberService.getInvitations(cid);
        setInvitationsSent(invitations);
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load data', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResidents = async () => {
    if (!inviteEmails.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter at least one email address',
        color: 'red'
      });
      return;
    }

    setLoading(true);
    try {
      // Parse emails and send invitations
      const emailList = inviteEmails.split(/[,\n]/).map((email) => email.trim()).filter((email) => email);
      let cid = user?.communityId || localStorage.getItem('communityId');
      if (!cid) {
        try {
          const c = await getAdminCommunity();
          cid = c?._id || c?.id;
          if (cid) localStorage.setItem('communityId', cid);
        } catch (_) {}
      }
      if (!cid) {
        try {
          const my = await getUserCommunities();
          const list = Array.isArray(my?.data) ? my.data : my;
          cid = (Array.isArray(list) && (list[0]?._id || list[0]?.id)) || cid;
          if (cid) localStorage.setItem('communityId', cid);
        } catch (_) {}
      }
      if (!cid) {
        notifications.show({ title: 'Error', message: 'Community ID not found', color: 'red' });
        return;
      }
      await memberService.inviteResidents(cid, emailList, inviteMessage);
      
      notifications.show({
        title: 'Success',
        message: `Invitations sent to ${emailList.length} residents`,
        color: 'green'
      });
      
      setInviteModalOpen(false);
      setInviteEmails('');
      setInviteMessage('');
      
      // Refresh invitations list if we're on that tab
      if (activeTab === 'invitations') {
        fetchData();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send invitations',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveResident = async (resident) => {
    if (!user?.communityId) return;
    
    try {
      await memberService.approveMember(user.communityId, resident.id);
      
      // Remove from pending and add to active
      setPendingRequests(pendingRequests.filter(r => r.id !== resident.id));
      setActiveResidents([...activeResidents, { ...resident, status: 'approved', dateJoined: new Date().toISOString().split('T')[0] }]);
      
      notifications.show({
        title: 'Success',
        message: `${resident.name} has been added to the community`,
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to approve resident',
        color: 'red'
      });
    }
  };

  const handleDenyResident = async (resident) => {
    if (!user?.communityId) return;
    
    try {
      await memberService.denyMember(user.communityId, resident.id);
      
      setPendingRequests(pendingRequests.filter(r => r.id !== resident.id));
      
      notifications.show({
        title: 'Request Denied',
        message: `${resident.name}'s request has been denied`,
        color: 'orange'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to deny request',
        color: 'red'
      });
    }
  };

  const handleRemoveResident = async () => {
    if (!selectedResident || !user?.communityId) return;
    
    setLoading(true);
    try {
      await memberService.removeMember(user.communityId, selectedResident.id);
      
      setActiveResidents(activeResidents.filter(r => r.id !== selectedResident.id));
      
      notifications.show({
        title: 'Success',
        message: `${selectedResident.name} has been removed from the community`,
        color: 'green'
      });
      
      setRemoveModalOpen(false);
      setSelectedResident(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove resident',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitation) => {
    if (!user?.communityId) return;
    
    try {
      await memberService.resendInvitation(user.communityId, invitation.id);
      
      notifications.show({
        title: 'Success',
        message: `Invitation resent to ${invitation.email}`,
        color: 'green'
      });
      
      // Refresh invitations list
      fetchData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to resend invitation',
        color: 'red'
      });
    }
  };

  const filteredActiveResidents = activeResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container size="lg">
      <LoadingOverlay visible={loading} />
      
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Manage Residents</Title>
            <p style={{ color: '#666' }}>Manage your community members and invitations</p>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setInviteModalOpen(true)}
            style={{ backgroundColor: '#588157' }}
          >
            Invite New Residents
          </Button>
        </Group>

        <Paper withBorder radius="md">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="active" rightSection={<Badge variant="light" size="sm">{activeResidents.length}</Badge>}>
                Active Residents
              </Tabs.Tab>
              <Tabs.Tab 
                value="pending" 
                rightSection={
                  <Badge variant="light" size="sm" color={pendingRequests.length > 0 ? 'orange' : 'gray'}>
                    {pendingRequests.length}
                  </Badge>
                }
              >
                Pending Requests
                {pendingRequests.length > 0 && (
                  <Box ml="xs" style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: '#ff6b6b', borderRadius: '50%' }} />
                )}
              </Tabs.Tab>
              <Tabs.Tab value="invitations" rightSection={<Badge variant="light" size="sm">{invitationsSent.length}</Badge>}>
                Invitations Sent
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="active">
              <Box p="md">
                <TextInput
                  placeholder="Search by name or email..."
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  mb="md"
                />
                
                {filteredActiveResidents.length === 0 ? (
                  <Center style={{ height: 200 }}>
                    <Stack align="center" gap="md">
                      <IconSearch size={48} style={{ color: '#999' }} />
                      <Text size="lg" style={{ color: '#666' }}>No residents found</Text>
                      <Text size="sm" style={{ color: '#999' }}>Try adjusting your search terms</Text>
                    </Stack>
                  </Center>
                ) : (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email Address</Table.Th>
                        <Table.Th>Date Joined</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredActiveResidents.map((resident) => (
                        <Table.Tr key={resident.id}>
                          <Table.Td>
                            <Group gap="sm">
                              <IconUserCheck size={16} style={{ color: '#588157' }} />
                              <Text fw={500}>{resident.name}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>{resident.email}</Table.Td>
                          <Table.Td>{new Date(resident.dateJoined).toLocaleDateString()}</Table.Td>
                          <Table.Td>
                            <Menu shadow="md" width={200}>
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDotsVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  color="red"
                                  leftSection={<IconUserX size={16} />}
                                  onClick={() => {
                                    setSelectedResident(resident);
                                    setRemoveModalOpen(true);
                                  }}
                                >
                                  Remove from Community
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="pending">
              <Box p="md">
                {pendingRequests.length === 0 ? (
                  <Center style={{ height: 200 }}>
                    <Stack align="center" gap="md">
                      <IconUserCheck size={48} style={{ color: '#999' }} />
                      <Text size="lg" style={{ color: '#666' }}>There are no pending requests to join</Text>
                    </Stack>
                  </Center>
                ) : (
                  <Stack gap="md">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} withBorder radius="md" padding="lg">
                        <Group justify="space-between" align="flex-start">
                          <Stack gap="xs">
                            <Group gap="sm">
                              <IconClock size={16} style={{ color: '#ff6b6b' }} />
                              <Text fw={500} size="lg">{request.name}</Text>
                            </Group>
                            <Text size="sm" c="dimmed">{request.email}</Text>
                            <Text size="xs" c="dimmed">
                              Requested on {new Date(request.dateRequested).toLocaleDateString()}
                            </Text>
                          </Stack>
                          <Group gap="sm">
                            <Button
                              size="sm"
                              color="green"
                              leftSection={<IconCheck size={14} />}
                              onClick={() => handleApproveResident(request)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              color="gray"
                              leftSection={<IconX size={14} />}
                              onClick={() => handleDenyResident(request)}
                            >
                              Deny
                            </Button>
                          </Group>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="invitations">
              <Box p="md">
                {invitationsSent.length === 0 ? (
                  <Center style={{ height: 200 }}>
                    <Stack align="center" gap="md">
                      <IconMail size={48} style={{ color: '#999' }} />
                      <Text size="lg" style={{ color: '#666' }}>No invitations sent yet</Text>
                    </Stack>
                  </Center>
                ) : (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Email Address</Table.Th>
                        <Table.Th>Date Sent</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {invitationsSent.map((invitation) => (
                        <Table.Tr key={invitation.id}>
                          <Table.Td>{invitation.email}</Table.Td>
                          <Table.Td>{new Date(invitation.dateSent).toLocaleDateString()}</Table.Td>
                          <Table.Td>
                            <Badge color={invitation.status === 'accepted' ? 'green' : 'blue'}>
                              {invitation.status === 'accepted' ? 'Accepted' : 'Sent'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {invitation.status === 'sent' && (
                              <Button
                                size="xs"
                                variant="subtle"
                                leftSection={<IconMail size={14} />}
                                onClick={() => handleResendInvitation(invitation)}
                              >
                                Resend
                              </Button>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>

      {/* Invite New Residents Modal */}
      <Modal
        opened={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Residents to Join Your Community"
        size="lg"
      >
        <Stack gap="md">
          <Textarea
            label="Email Addresses"
            placeholder="Enter one or more email addresses, separated by commas or on new lines"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            minRows={4}
            required
          />
          <Textarea
            label="Custom Message (Optional)"
            placeholder="e.g., Hi everyone, please join our official Scrapp community to stay updated on recycling drives!"
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            minRows={3}
          />
          <Group justify="flex-end" gap="md">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInviteResidents}
              leftSection={<IconMail size={16} />}
              style={{ backgroundColor: '#588157' }}
            >
              Send Invitations
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Remove Resident Confirmation Modal */}
      <Modal
        opened={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        title="Remove Resident from Community"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to remove <strong>{selectedResident?.name}</strong>? They will lose access to all private community posts and announcements.
          </Text>
          <Group justify="flex-end" gap="md">
            <Button variant="outline" onClick={() => setRemoveModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleRemoveResident}>
              Confirm Removal
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default ManageResidents;
