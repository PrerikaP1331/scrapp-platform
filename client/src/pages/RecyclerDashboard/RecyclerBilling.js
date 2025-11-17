import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Stack,
  Group,
  Table,
  Badge,
  Text,
  Card,
  Grid,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Modal,
  Select,
  Alert
} from '@mantine/core';
import {
  IconDownload,
  IconCreditCard,
  IconCheck,
  IconAlertCircle,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import classes from './RecyclerBilling.module.css';

function RecyclerBilling() {
  const [subscription] = useState({
    plan: 'Professional',
    status: 'Active',
    monthlyCharge: 2499,
    billingCycle: 'Monthly',
    nextBillingDate: 'Dec 1, 2025',
    startDate: 'Sep 1, 2024'
  });

  const [earnings] = useState({
    thisMonth: 15900,
    totalEarned: 127650,
    availableBalance: 15900,
    lastPayout: 'Nov 15, 2025'
  });

  const [invoices] = useState([
    { id: 1, date: 'Nov 1, 2025', amount: 2499, status: 'Paid', pdf: 'INV-REC-001' },
    { id: 2, date: 'Oct 1, 2025', amount: 2499, status: 'Paid', pdf: 'INV-REC-002' },
    { id: 3, date: 'Sep 1, 2025', amount: 2499, status: 'Paid', pdf: 'INV-REC-003' },
    { id: 4, date: 'Aug 1, 2025', amount: 2499, status: 'Paid', pdf: 'INV-REC-004' },
  ]);

  const [payouts] = useState([
    { id: 1, date: 'Nov 15, 2025', amount: 14000, status: 'Completed', method: 'Bank Transfer' },
    { id: 2, date: 'Oct 15, 2025', amount: 14000, status: 'Completed', method: 'Bank Transfer' },
    { id: 3, date: 'Sep 15, 2025', amount: 14000, status: 'Completed', method: 'Bank Transfer' },
  ]);

  const [planModal, setPlanModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const plans = [
    { name: 'Basic', price: 999, features: ['Free listings', 'Basic analytics', 'Email support'] },
    { name: 'Professional', price: 2499, features: ['Priority listings', 'Advanced analytics', 'Phone support', 'Custom branding'] },
    { name: 'Enterprise', price: 4999, features: ['Dedicated listings', 'Real-time analytics', '24/7 support', 'API access'] }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={2} style={{ color: '#344e41' }}>Billing & Subscription</Title>
          <Text size="sm" color="dimmed">Manage your Scrapp platform subscription and view earnings</Text>
        </div>

        {/* Earnings Overview */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} gap="lg">
          <Paper p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <div>
                <Text size="sm" color="dimmed" fw={500}>This Month</Text>
                <Text size="xl" fw={700} style={{ color: '#344e41' }}>₹{earnings.thisMonth.toLocaleString()}</Text>
              </div>
              <ThemeIcon size={48} radius="md" style={{ backgroundColor: '#f0f8f5' }}>
                <IconCreditCard size={24} color="#588157" />
              </ThemeIcon>
            </Group>
            <Text size="xs" color="dimmed">From {15} completed pickups</Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <div>
                <Text size="sm" color="dimmed" fw={500}>Available Balance</Text>
                <Text size="xl" fw={700} style={{ color: '#588157' }}>₹{earnings.availableBalance.toLocaleString()}</Text>
              </div>
              <ThemeIcon size={48} radius="md" style={{ backgroundColor: '#f0f8f5' }}>
                <IconCheck size={24} color="#588157" />
              </ThemeIcon>
            </Group>
            <Button size="xs" mt="md" style={{ backgroundColor: '#588157' }}>Request Payout</Button>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Text size="sm" color="dimmed" fw={500} mb="xs">Total Earned</Text>
            <Text size="xl" fw={700} style={{ color: '#344e41' }}>₹{earnings.totalEarned.toLocaleString()}</Text>
            <Text size="xs" color="dimmed" mt="md">All time</Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Text size="sm" color="dimmed" fw={500} mb="xs">Last Payout</Text>
            <Text size="xl" fw={700} style={{ color: '#344e41' }}>{earnings.lastPayout}</Text>
            <Text size="xs" color="dimmed" mt="md">Completed</Text>
          </Paper>
        </SimpleGrid>

        {/* Current Plan */}
        <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f0f8f5' }}>
          <Group justify="space-between" mb="md">
            <div>
              <Title order={4} style={{ color: '#344e41' }} mb="md">Current Subscription</Title>
              <SimpleGrid cols={{ base: 2, sm: 4 }} gap="md">
                <div>
                  <Text size="sm" color="dimmed" mb="xs">Plan Type</Text>
                  <Text fw={600} style={{ color: '#344e41' }}>{subscription.plan}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed" mb="xs">Status</Text>
                  <Badge color="#588157" leftSection={<IconCheck size={12} />}>
                    {subscription.status}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" color="dimmed" mb="xs">Monthly Charge</Text>
                  <Text fw={600} style={{ color: '#588157' }}>₹{subscription.monthlyCharge}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed" mb="xs">Next Billing</Text>
                  <Text fw={600}>{subscription.nextBillingDate}</Text>
                </div>
              </SimpleGrid>
            </div>
            <Button
              style={{ backgroundColor: '#588157' }}
              onClick={() => setPlanModal(true)}
            >
              Change Plan
            </Button>
          </Group>
        </Paper>

        {/* Subscription Plans Modal */}
        <Modal
          opened={planModal}
          onClose={() => setPlanModal(false)}
          title="Choose Your Plan"
          size="lg"
        >
          <SimpleGrid cols={{ base: 1, md: 3 }} gap="lg">
            {plans.map(plan => (
              <Paper key={plan.name} p="lg" radius="md" withBorder style={{ border: plan.name === 'Professional' ? '2px solid #588157' : '1px solid #ddd' }}>
                <Text fw={600} style={{ color: '#344e41' }} mb="xs">{plan.name}</Text>
                <Text size="xl" fw={700} style={{ color: '#588157' }} mb="md">₹{plan.price}/mo</Text>
                <Stack gap="xs" mb="lg">
                  {plan.features.map(feature => (
                    <Group key={feature} gap="xs">
                      <IconCheck size={16} color="#588157" />
                      <Text size="sm">{feature}</Text>
                    </Group>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant={plan.name === 'Professional' ? 'filled' : 'light'}
                  style={{ backgroundColor: plan.name === 'Professional' ? '#588157' : 'transparent' }}
                >
                  {plan.name === 'Professional' ? 'Current Plan' : 'Upgrade'}
                </Button>
              </Paper>
            ))}
          </SimpleGrid>
        </Modal>

        {/* Invoices */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Title order={4} style={{ color: '#344e41' }}>Recent Invoices</Title>
            <Button variant="light" leftSection={<IconDownload size={14} />}>
              Download All
            </Button>
          </Group>

          <div style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th>Invoice #</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td fw={500}>{invoice.pdf}</Table.Td>
                    <Table.Td>{invoice.date}</Table.Td>
                    <Table.Td fw={600} style={{ color: '#588157' }}>₹{invoice.amount}</Table.Td>
                    <Table.Td>
                      <Badge color="#588157">{invoice.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        leftSection={<IconDownload size={14} />}
                        variant="subtle"
                        size="xs"
                      >
                        Download
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Paper>

        {/* Payouts */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={4} style={{ color: '#344e41' }} mb="lg">Payout History</Title>

          <div style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Method</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {payouts.map((payout) => (
                  <Table.Tr key={payout.id}>
                    <Table.Td fw={500}>{payout.date}</Table.Td>
                    <Table.Td fw={600} style={{ color: '#588157' }}>₹{payout.amount}</Table.Td>
                    <Table.Td>{payout.method}</Table.Td>
                    <Table.Td>
                      <Badge color="#588157">{payout.status}</Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Paper>

        {/* Payment Method */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Title order={4} style={{ color: '#344e41' }}>Payment Method</Title>
            <Button
              variant="light"
              leftSection={<IconEdit size={14} />}
              onClick={() => setPaymentModal(true)}
            >
              Edit
            </Button>
          </Group>

          <Card withBorder p="md" radius="md" style={{ backgroundColor: '#f0f8f5' }}>
            <Group justify="space-between">
              <div>
                <Group gap="md" mb="xs">
                  <ThemeIcon size={40} radius="md" style={{ backgroundColor: '#588157' }}>
                    <IconCreditCard size={24} color="white" />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} style={{ color: '#344e41' }}>Visa Card</Text>
                    <Text size="sm" color="dimmed">ending in 4242</Text>
                  </div>
                </Group>
                <Text size="sm" color="dimmed">Expires 12/26</Text>
              </div>
              <Group gap="xs">
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setPaymentModal(true)}
                >
                  Update
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  leftSection={<IconTrash size={14} />}
                >
                  Remove
                </Button>
              </Group>
            </Group>
          </Card>
        </Paper>

        {/* Billing FAQs */}
        <Alert icon={<IconAlertCircle />} title="Billing Information" color="#588157">
          <Stack gap="xs">
            <Text size="sm">• Invoices are issued on the 1st of every month</Text>
            <Text size="sm">• Payouts are processed weekly to your registered bank account</Text>
            <Text size="sm">• Service charges are deducted from your earnings automatically</Text>
          </Stack>
        </Alert>
      </Stack>
    </Container>
  );
}

export default RecyclerBilling;
