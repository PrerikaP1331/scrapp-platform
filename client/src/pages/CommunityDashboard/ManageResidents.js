import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, Table, Badge, ActionIcon, Modal, TextInput, Select, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconCheck, IconX, IconMail, IconPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

function ManageResidents() {
  const [approvedMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: 'Nov 5, 2025', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: 'Oct 20, 2025', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joinDate: 'Sep 15, 2025', status: 'Active' },
  ]);

  const [pendingRequests] = useState([
    { id: 101, name: 'Alice Williams', email: 'alice@example.com', requestDate: 'Nov 16, 2025' },
    { id: 102, name: 'Charlie Brown', email: 'charlie@example.com', requestDate: 'Nov 14, 2025' },
  ]);

  const [inviteModal, setInviteModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const inviteForm = useForm({
    initialValues: {
      email: '',
      unit: '',
    },
    validate: {
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null,
    },
  });

  const handleInvite = async (values) => {
    try {
      console.log('Inviting resident:', values);
      alert('Invitation sent successfully!');
      inviteForm.reset();
      setInviteModal(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovalModal(true);
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Manage Residents</Title>
            <p style={{ color: '#666' }}>View and manage community members</p>
          </div>
          <Button
            style={{ backgroundColor: '#588157' }}
            leftSection={<IconPlus size={18} />}
            onClick={() => setInviteModal(true)}
          >
            Invite Resident
          </Button>
        </Group>

        <Tabs defaultValue="approved">
          <Tabs.List>
            <Tabs.Tab value="approved">Approved Members ({approvedMembers.length})</Tabs.Tab>
            <Tabs.Tab value="pending">Pending Requests ({pendingRequests.length})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="approved" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Join Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {approvedMembers.map((member) => (
                    <Table.Tr key={member.id}>
                      <Table.Td fw={500}>{member.name}</Table.Td>
                      <Table.Td>{member.email}</Table.Td>
                      <Table.Td>{member.joinDate}</Table.Td>
                      <Table.Td>
                        <Badge color="green">{member.status}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={0}>
                          <ActionIcon variant="subtle" color="gray">
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

          <Tabs.Panel value="pending" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Request Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {pendingRequests.map((request) => (
                    <Table.Tr key={request.id}>
                      <Table.Td fw={500}>{request.name}</Table.Td>
                      <Table.Td>{request.email}</Table.Td>
                      <Table.Td>{request.requestDate}</Table.Td>
                      <Table.Td>
                        <Group gap={0}>
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => handleApprove(request)}
                          >
                            <IconCheck size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="red">
                            <IconX size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Invite Modal */}
      <Modal
        opened={inviteModal}
        onClose={() => setInviteModal(false)}
        title="Invite New Resident"
      >
        <form onSubmit={inviteForm.onSubmit(handleInvite)}>
          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="resident@example.com"
              {...inviteForm.getInputProps('email')}
            />
            <TextInput
              label="Unit / Apartment Number"
              placeholder="e.g., A-101, Block B"
              {...inviteForm.getInputProps('unit')}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setInviteModal(false)}>
                Cancel
              </Button>
              <Button style={{ backgroundColor: '#588157' }} type="submit">
                Send Invitation
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Approval Modal */}
      <Modal
        opened={approvalModal}
        onClose={() => setApprovalModal(false)}
        title="Approve Membership Request"
      >
        {selectedRequest && (
          <Stack gap="md">
            <Paper p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Name</Text>
              <Text fw={600} mb="lg">{selectedRequest.name}</Text>
              <Text size="sm" color="dimmed">Email</Text>
              <Text fw={600}>{selectedRequest.email}</Text>
            </Paper>
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setApprovalModal(false)}>
                Cancel
              </Button>
              <Button
                color="green"
                onClick={() => {
                  alert('Member approved!');
                  setApprovalModal(false);
                }}
              >
                Approve
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default ManageResidents;
