import React from 'react';
import { Container, Paper, Title, Table, Badge, Stack, Group, Button, Card, Grid } from '@mantine/core';
import { Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

function CommunityBilling() {
  const billingInfo = {
    planName: 'Community Pro',
    monthlyFee: '₹2,499',
    billingCycle: 'Monthly',
    nextBillingDate: 'Dec 16, 2025',
    status: 'Active',
  };

  const paymentHistory = [
    { id: 1, date: 'Nov 16, 2025', amount: '₹2,499', status: 'Paid', method: 'Credit Card' },
    { id: 2, date: 'Oct 16, 2025', amount: '₹2,499', status: 'Paid', method: 'Bank Transfer' },
    { id: 3, date: 'Sep 16, 2025', amount: '₹2,499', status: 'Paid', method: 'Credit Card' },
  ];

  const invoices = [
    { id: 'INV-001', date: 'Nov 16, 2025', amount: '₹2,499', status: 'Paid' },
    { id: 'INV-002', date: 'Oct 16, 2025', amount: '₹2,499', status: 'Paid' },
    { id: 'INV-003', date: 'Sep 16, 2025', amount: '₹2,499', status: 'Paid' },
  ];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Community Billing</Title>
          <p style={{ color: '#666' }}>Manage your community's platform subscription and payments</p>
        </div>

        {/* Current Plan */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Current Subscription</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Plan Name</Text>
                <Text fw={600}>{billingInfo.planName}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Monthly Fee</Text>
                <Text fw={600} style={{ color: '#588157' }}>{billingInfo.monthlyFee}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Billing Cycle</Text>
                <Text fw={600}>{billingInfo.billingCycle}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md" radius="md">
                <Text size="sm" color="dimmed" fw={500} mb="xs">Next Billing</Text>
                <Text fw={600}>{billingInfo.nextBillingDate}</Text>
              </Card>
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="lg" gap="md">
            <Button variant="default">Change Plan</Button>
            <Button style={{ backgroundColor: '#588157' }}>Update Payment Method</Button>
          </Group>
        </Paper>

        {/* Payment History */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Payment History</Title>
          <Table>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Payment Method</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paymentHistory.map((payment) => (
                <Table.Tr key={payment.id}>
                  <Table.Td>{payment.date}</Table.Td>
                  <Table.Td fw={500}>{payment.amount}</Table.Td>
                  <Table.Td>
                    <Badge color="green">{payment.status}</Badge>
                  </Table.Td>
                  <Table.Td>{payment.method}</Table.Td>
                  <Table.Td>
                    <Button variant="subtle" size="xs">
                      View Receipt
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Invoices */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Title order={4} style={{ color: '#344e41' }}>Invoices</Title>
            <Button leftSection={<IconDownload size={18} />} variant="default" size="sm">
              Download All
            </Button>
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                <Table.Th>Invoice ID</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoices.map((invoice) => (
                <Table.Tr key={invoice.id}>
                  <Table.Td fw={500}>{invoice.id}</Table.Td>
                  <Table.Td>{invoice.date}</Table.Td>
                  <Table.Td>{invoice.amount}</Table.Td>
                  <Table.Td>
                    <Badge color="green">{invoice.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}>
                      Download
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Container>
  );
}

export default CommunityBilling;
