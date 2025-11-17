import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, Table, Badge, ActionIcon, Modal, Grid, Card, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function InitiativeManagement() {
  const navigate = useNavigate();
  const [activeInitiatives] = useState([
    {
      id: 1,
      title: 'Office E-Waste Collection Week',
      date: 'Nov 18-25, 2025',
      visibility: 'Internal',
      status: 'Active',
      participants: 34,
    },
    {
      id: 2,
      title: 'Paper Reduction Challenge',
      date: 'Nov 1 - Dec 31, 2025',
      visibility: 'Public',
      status: 'Active',
      participants: 89,
    },
  ]);

  const [completedInitiatives] = useState([
    {
      id: 3,
      title: 'Zero-Waste Training Session',
      date: 'Oct 15, 2025',
      visibility: 'Internal',
      totalParticipants: 156,
      wasteReduced: '1,230 kg',
    },
  ]);

  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewReport = (initiative) => {
    setSelectedInitiative(initiative);
    setModalOpen(true);
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Initiative Management</Title>
            <p style={{ color: '#666' }}>Create and manage corporate sustainability campaigns</p>
          </div>
          <Button
            style={{ backgroundColor: '#588157' }}
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate('/org-dashboard/initiatives/new')}
          >
            Create Initiative
          </Button>
        </Group>

        <Tabs defaultValue="active">
          <Tabs.List>
            <Tabs.Tab value="active">Active & Upcoming ({activeInitiatives.length})</Tabs.Tab>
            <Tabs.Tab value="completed">Completed ({completedInitiatives.length})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Initiative Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {activeInitiatives.map((initiative) => (
                    <Table.Tr key={initiative.id}>
                      <Table.Td fw={500}>{initiative.title}</Table.Td>
                      <Table.Td>{initiative.date}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={initiative.visibility === 'Public' ? 'blue' : 'gray'}>
                          {initiative.visibility}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color="green">{initiative.status}</Badge>
                      </Table.Td>
                      <Table.Td>{initiative.participants}</Table.Td>
                      <Table.Td>
                        <Group gap={0}>
                          <ActionIcon variant="subtle" color="blue" onClick={() => handleViewReport(initiative)}>
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="gray" onClick={() => navigate(`/org-dashboard/initiatives/${initiative.id}/edit`)}>
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="red">
                            <IconTrash size={16} />
                          </ActionIcon>
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
                    <Table.Th>Initiative Title</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Visibility</Table.Th>
                    <Table.Th>Total Participants</Table.Th>
                    <Table.Th>Waste Reduced</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {completedInitiatives.map((initiative) => (
                    <Table.Tr key={initiative.id}>
                      <Table.Td fw={500}>{initiative.title}</Table.Td>
                      <Table.Td>{initiative.date}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={initiative.visibility === 'Public' ? 'blue' : 'gray'}>
                          {initiative.visibility}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{initiative.totalParticipants}</Table.Td>
                      <Table.Td style={{ color: '#588157', fontWeight: 600 }}>{initiative.wasteReduced}</Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="blue" onClick={() => handleViewReport(initiative)}>
                          <IconEye size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* View Report Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Initiative Summary"
        size="lg"
      >
        {selectedInitiative && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">Initiative</Title>
                  <Text fw={600} size="lg">{selectedInitiative.title}</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6 }}>
                <Card withBorder p="md" radius="md">
                  <Title order={5} mb="xs">Participants</Title>
                  <Text fw={600} size="lg" style={{ color: '#588157' }}>
                    {selectedInitiative.participants || selectedInitiative.totalParticipants}
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
            {selectedInitiative.wasteReduced && (
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <Card withBorder p="md" radius="md">
                    <Title order={5} mb="xs">Waste Reduced</Title>
                    <Text fw={600} size="lg" style={{ color: '#588157' }}>{selectedInitiative.wasteReduced}</Text>
                  </Card>
                </Grid.Col>
              </Grid>
            )}
            <Button style={{ backgroundColor: '#588157' }} onClick={() => navigate(`/org-dashboard/initiatives/${selectedInitiative.id}/report`)}>
              View Full Report
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default InitiativeManagement;
