import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Button, 
  Stack, 
  Group, 
  Tabs, 
  Table, 
  Badge, 
  ActionIcon, 
  Modal, 
  Tooltip, 
  Grid, 
  Card, 
  Text,
  Select,
  LoadingOverlay,
  Alert,
  Menu,
  TextInput
} from '@mantine/core';
import { 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconPlus, 
  IconChartBar, 
  IconCalendar, 
  IconUsers, 
  IconWorld, 
  IconLock,
  IconSearch,
  IconFilter
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { getCommunityDrives, createDrive, updateDrive, deleteDrive } from '../../api/driveService';
import { getAdminCommunity, getUserCommunities } from '../../api/communityService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './DriveManagement.module.css';

function DriveManagement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [driveToDelete, setDriveToDelete] = useState(null);

  // Calculate active and completed drives
  const activeDrives = filteredDrives.filter(drive => 
    new Date(drive.date) > new Date() && drive.status !== 'completed'
  );
  const completedDrives = filteredDrives.filter(drive => drive.status === 'completed');

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [drives, filter, searchTerm]);

  const fetchDrives = async () => {
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
      
      const response = await getCommunityDrives(communityId);
      setDrives(response);
    } catch (error) {
      notifications.show({
        title: 'Error loading drives',
        message: error.response?.data?.msg || 'Failed to load drives',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = drives;
    
    if (searchTerm) {
      filtered = filtered.filter((drive) => 
        drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'upcoming') {
      filtered = filtered.filter((drive) => drive.status === 'upcoming' || drive.status === 'active');
    } else if (filter === 'completed') {
      filtered = filtered.filter((drive) => drive.status === 'completed');
    }
    
    setFilteredDrives(filtered);
  };

  const handleViewStats = (drive) => {
    setSelectedDrive(drive);
    setStatsModalOpen(true);
  };

  const handleDeleteDrive = (drive) => {
    setDriveToDelete(drive);
    setDeleteModalOpen(true);
  };

  const confirmDeleteDrive = async () => {
    try {
      let cid = user?.communityId || localStorage.getItem('communityId');
      if (!cid) {
        try {
          const c = await getAdminCommunity();
          cid = c?._id || c?.id;
          if (cid) localStorage.setItem('communityId', cid);
        } catch (_) {}
      }
      await deleteDrive(cid, driveToDelete._id);
      notifications.show({
        title: 'Success',
        message: 'Drive deleted successfully',
        color: 'green'
      });
      fetchDrives();
      setDeleteModalOpen(false);
      setDriveToDelete(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.msg || 'Failed to delete drive',
        color: 'red'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'active': return 'green';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getVisibilityIcon = (visibility) => {
    return visibility === 'public' ? <IconWorld size={16} /> : <IconLock size={16} />;
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Drive Management</Title>
            <p style={{ color: '#666' }}>Organize and manage community recycling drives</p>
          </div>
          <Button
            style={{ backgroundColor: '#588157' }}
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate('/community-dashboard/drives/new')}
          >
            Create New Drive
          </Button>
        </Group>

        {/* Search and Filter Bar */}
        <Group justify="space-between" align="center">
          <TextInput
            placeholder="Search drives..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter drives"
            leftSection={<IconFilter size={16} />}
            value={filter}
            onChange={setFilter}
            data={[
              { value: 'all', label: 'All Drives' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'completed', label: 'Completed' }
            ]}
            style={{ width: 200 }}
          />
        </Group>

        {/* No Drives State */}
        {filteredDrives.length === 0 && (
          <Paper withBorder radius="md" p="xl" style={{ textAlign: 'center' }}>
            <Stack align="center" gap="md">
              <IconCalendar size={48} style={{ color: '#999' }} />
              <Title order={3} style={{ color: '#666' }}>No drives found</Title>
              <Text style={{ color: '#666' }}>
                {searchTerm || filter !== 'all' 
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't created any drives yet. Click 'Create New Drive' to get started!"
                }
              </Text>
            </Stack>
          </Paper>
        )}

        {/* Drives Table */}
        {filteredDrives.length > 0 && (
          <Paper withBorder radius="md" p={0} className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th>Drive Title</Table.Th>
                  <Table.Th>Date & Time</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Visibility</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Participants</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredDrives.map((drive) => (
                  <Table.Tr key={drive._id}>
                    <Table.Td fw={500}>{drive.title}</Table.Td>
                    <Table.Td>{new Date(drive.date).toLocaleDateString()} {drive.time && new Date(drive.time).toLocaleTimeString()}</Table.Td>
                    <Table.Td>{typeof drive.location === 'string' ? drive.location : (drive.location?.venue || '')}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {getVisibilityIcon(drive.visibility)}
                        <Badge variant="light" color={drive.visibility === 'public' ? 'blue' : 'gray'}>
                          {drive.visibility === 'public' ? 'Public' : 'Private'}
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(drive.status)}>
                        {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{drive.participants || 0}</Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleViewStats(drive)}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => navigate(`/community-dashboard/drives/${drive._id}/edit`)}
                          >
                            Edit Drive
                          </Menu.Item>
                          {drive.status === 'completed' && (
                            <Menu.Item
                              leftSection={<IconChartBar size={14} />}
                              onClick={() => handleViewStats(drive)}
                            >
                              View Stats
                            </Menu.Item>
                          )}
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteDrive(drive)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Stack>

      {/* View Drive Statistics Modal */}
      <Modal
        opened={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        title="Drive Statistics"
        size="lg"
      >
        {selectedDrive && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">Drive Title</Title>
                  <Text fw={600} size="lg">{selectedDrive.title}</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">Total Participants</Title>
                  <Text fw={600} size="lg" style={{ color: '#588157' }}>{selectedDrive.participants || 0}</Text>
                </Card>
              </Grid.Col>
            </Grid>
            {selectedDrive.totalCollected && (
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <Card withBorder p="md" radius="md">
                    <Title order={5} mb="xs">Total Collected</Title>
                    <Text fw={600} size="lg" style={{ color: '#588157' }}>{selectedDrive.totalCollected}</Text>
                  </Card>
                </Grid.Col>
              </Grid>
            )}
            <Button style={{ backgroundColor: '#588157' }} onClick={() => navigate(`/community-dashboard/drives/${selectedDrive._id}/stats`)}>
              View Full Report
            </Button>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Drive"
        size="md"
      >
        <Stack gap="md">
          <Text>Are you sure you want to permanently delete this drive?</Text>
          <Text size="sm" style={{ color: '#666' }}>
            This action cannot be undone. The drive "{driveToDelete?.title}" will be permanently removed.
          </Text>
          <Group justify="flex-end" gap="md">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeleteDrive}>
              Delete Drive
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default DriveManagement;
