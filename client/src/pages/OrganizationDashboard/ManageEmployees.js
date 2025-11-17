import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, Table, Badge, ActionIcon, Modal, TextInput, FileInput } from '@mantine/core';
import { IconPlus, IconTrash, IconCheck, IconX, IconUpload, IconFileImport } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

function ManageEmployees() {
  const [approvedEmployees] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@company.com', joinDate: 'Oct 1, 2025', department: 'Operations' },
    { id: 2, name: 'Priya Singh', email: 'priya@company.com', joinDate: 'Oct 15, 2025', department: 'Finance' },
  ]);

  const [pendingRequests] = useState([
    { id: 3, name: 'Amit Patel', email: 'amit@company.com', requestDate: 'Nov 15, 2025' },
  ]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [bulkInviteTab, setBulkInviteTab] = useState('manual');

  const form = useForm({
    initialValues: {
      emailList: '',
      domain: '',
    },
  });

  const handleInviteSubmit = (values) => {
    console.log('Sending invites:', values);
    alert('Invitations sent successfully!');
    form.reset();
    setInviteModalOpen(false);
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} style={{ color: '#344e41' }} mb="xs">Manage Employees</Title>
            <p style={{ color: '#666' }}>Manage team members and access requests</p>
          </div>
          <Button
            style={{ backgroundColor: '#588157' }}
            leftSection={<IconPlus size={18} />}
            onClick={() => setInviteModalOpen(true)}
          >
            Invite Employees
          </Button>
        </Group>

        <Tabs defaultValue="approved">
          <Tabs.List>
            <Tabs.Tab value="approved">Approved ({approvedEmployees.length})</Tabs.Tab>
            <Tabs.Tab value="pending">Pending Requests ({pendingRequests.length})</Tabs.Tab>
          </Tabs.List>

          {/* Approved Employees Tab */}
          <Tabs.Panel value="approved" pt="md">
            <Paper withBorder radius="md" p={0} className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Department</Table.Th>
                    <Table.Th>Join Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {approvedEmployees.map((employee) => (
                    <Table.Tr key={employee.id}>
                      <Table.Td fw={500}>{employee.name}</Table.Td>
                      <Table.Td>{employee.email}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue">
                          {employee.department}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{employee.joinDate}</Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="red">
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          {/* Pending Requests Tab */}
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
                          <ActionIcon variant="subtle" color="green">
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
        opened={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Employees"
        size="lg"
      >
        <Tabs defaultValue={bulkInviteTab} onTabChange={setBulkInviteTab}>
          <Tabs.List>
            <Tabs.Tab value="manual">Individual Invite</Tabs.Tab>
            <Tabs.Tab value="bulk">Bulk Upload (CSV)</Tabs.Tab>
            <Tabs.Tab value="domain">Domain Auto-Approval</Tabs.Tab>
          </Tabs.List>

          {/* Manual Invite Tab */}
          <Tabs.Panel value="manual" pt="md">
            <form onSubmit={form.onSubmit(handleInviteSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Email Address"
                  placeholder="employee@company.com"
                  type="email"
                  required
                />
                <Button style={{ backgroundColor: '#588157' }} type="submit">
                  Send Invitation
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          {/* Bulk Upload Tab */}
          <Tabs.Panel value="bulk" pt="md">
            <Stack gap="md">
              <FileInput
                label="Upload CSV File"
                placeholder="Click to upload"
                accept=".csv"
                icon={<IconUpload size={14} />}
              />
              <p style={{ fontSize: '12px', color: '#666' }}>
                CSV format: name, email, department
              </p>
              <Button style={{ backgroundColor: '#588157' }}>
                Import & Send Invitations
              </Button>
            </Stack>
          </Tabs.Panel>

          {/* Domain Auto-Approval Tab */}
          <Tabs.Panel value="domain" pt="md">
            <Stack gap="md">
              <TextInput
                label="Company Email Domain"
                placeholder="@company.com"
                description="Automatically approve anyone with this email domain"
              />
              <Button style={{ backgroundColor: '#588157' }}>
                Enable Domain Auto-Approval
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </Container>
  );
}

export default ManageEmployees;
