import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, Table, Badge, ActionIcon, Modal, Tooltip, Grid, Card, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function DriveManagement() {
  const navigate = useNavigate();
  const [activeDrives] = useState([
    {
      id: 1,
      title: 'E-waste Drive',
      date: 'Nov 20, 2025',
      visibility: 'Public',
      status: 'Upcoming',
      participants: 24,
    },
    {
      id: 2,
      title: 'Plastic Bottle Collection',
      date: 'Nov 18, 2025',
      visibility: 'Private',
      status: 'Active',
      participants: 45,
    },
  ]);

  const [completedDrives] = useState([
    {
      id: 3,
      title: 'Monthly Recycling Drive',
      date: 'Nov 10, 2025',
      visibility: 'Public',
      totalCollected: '450 kg',
      participants: 67,
    },
  ]);

  const [selectedDrive, setSelectedDrive] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewStats = (drive) => {
    setSelectedDrive(drive);
    setModalOpen(true);
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

        <Tabs defaultValue="active">
          <Tabs.List>
            <Tabs.Tab value="active">Active & Upcoming ({activeDrives.length})</Tabs.Tab>
            <Tabs.Tab value="completed">Completed ({completedDrives.length})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Drive Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activeDrives.map((drive) => (
                    <Table.Tr key={drive.id}>
                      <Table.Td fw={500}>{drive.title}</Table.Td>
                      <Table.Td>{drive.date}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={drive.visibility === 'Public' ? 'blue' : 'gray'}>
                          {drive.visibility}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={drive.status === 'Active' ? 'green' : 'yellow'}>
                          {drive.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{drive.participants}</Table.Td>
                      <Table.Td>
                        <Group gap={0}>
                          <Tooltip label="View Details">
                            <ActionIcon variant="subtle" color="blue" onClick={() => handleViewStats(drive)}>
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Edit">
                            <ActionIcon variant="subtle" color="gray" onClick={() => navigate(`/community-dashboard/drives/${drive.id}/edit`)}>
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <ActionIcon variant="subtle" color="red">
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Drive Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Total Collected</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {completedDrives.map((drive) => (
                    <Table.Tr key={drive.id}>
                      <Table.Td fw={500}>{drive.title}</Table.Td>
                      <Table.Td>{drive.date}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={drive.visibility === 'Public' ? 'blue' : 'gray'}>
                          {drive.visibility}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ color: '#588157', fontWeight: 600 }}>{drive.totalCollected}</Table.Td>
                      <Table.Td>{drive.participants}</Table.Td>
                      <Table.Td>
                        <Tooltip label="View Statistics">
                          <ActionIcon variant="subtle" color="blue" onClick={() => handleViewStats(drive)}>
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* View Drive Statistics Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
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
                  <Text fw={600} size="lg" style={{ color: '#588157' }}>{selectedDrive.participants}</Text>
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
            <Button style={{ backgroundColor: '#588157' }} onClick={() => navigate(`/community-dashboard/drives/${selectedDrive.id}/stats`)}>
              View Full Report
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default DriveManagement;
