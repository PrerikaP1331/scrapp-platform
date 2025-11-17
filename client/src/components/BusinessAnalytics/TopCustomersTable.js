// client/src/components/BusinessAnalytics/TopCustomersTable.js
import React, { useState } from 'react';
import {
  Paper,
  Text,
  Table,
  Tabs,
  Box,
  Badge,
  Group,
  ThemeIcon
} from '@mantine/core';
import { IconTrendingUp, IconUser, IconBuilding } from '@tabler/icons-react';

const TopCustomersTable = ({ topIndividuals, topOrganizations }) => {
  const [activeTab, setActiveTab] = useState('individuals');

  const individuals = topIndividuals || [];
  const organizations = topOrganizations || [];

  const CustomerRow = ({ customer, type }) => (
    <Table.Tr key={customer.customerId}>
      <Table.Td>
        <Group gap="sm">
          <ThemeIcon variant="light" radius="md">
            {type === 'individual' ? <IconUser size={16} /> : <IconBuilding size={16} />}
          </ThemeIcon>
          <Text fw={500} size="sm">
            {customer.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light">{customer.pickups}</Badge>
      </Table.Td>
      <Table.Td>
        <Text fw={600} size="sm">
          ₹{customer.revenue.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {customer.weight.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} kg
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {new Date(customer.lastPickupDate).toLocaleDateString('en-IN')}
        </Text>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <Paper p="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconTrendingUp size={20} color="#588157" />
          <Text fw={600} size="lg" style={{ color: '#344e41' }}>
            Top Customers
          </Text>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="individuals" leftSection={<IconUser size={14} />}>
            Top Individuals ({individuals.length})
          </Tabs.Tab>
          <Tabs.Tab value="organizations" leftSection={<IconBuilding size={14} />}>
            Organizations ({organizations.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="individuals" pt="md">
          {individuals.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No individual customer data available
            </Text>
          ) : (
            <Box style={{ overflowX: 'auto' }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer Name</Table.Th>
                    <Table.Th>Total Pickups</Table.Th>
                    <Table.Th>Total Revenue</Table.Th>
                    <Table.Th>Total Weight</Table.Th>
                    <Table.Th>Last Pickup Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {individuals.map((customer) => (
                    <CustomerRow key={customer.customerId} customer={customer} type="individual" />
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="organizations" pt="md">
          {organizations.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No organization customer data available
            </Text>
          ) : (
            <Box style={{ overflowX: 'auto' }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Organization Name</Table.Th>
                    <Table.Th>Total Pickups</Table.Th>
                    <Table.Th>Total Revenue</Table.Th>
                    <Table.Th>Total Weight</Table.Th>
                    <Table.Th>Last Pickup Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {organizations.map((customer) => (
                    <CustomerRow key={customer.customerId} customer={customer} type="organization" />
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default TopCustomersTable;
