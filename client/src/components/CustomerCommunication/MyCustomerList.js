// client/src/components/CustomerCommunication/MyCustomerList.js
import React, { useState, useMemo } from 'react';
import {
  Paper,
  Stack,
  TextInput,
  Table,
  Loader,
  Center,
  Text,
  Badge,
  Group,
  Menu,
  ActionIcon,
  Box
} from '@mantine/core';
import { IconSearch, IconDots, IconHistory } from '@tabler/icons-react';

const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '*'.repeat(Math.max(0, name.length - 2)) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
};

const MyCustomerList = ({ customers, isLoading, onViewHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  if (isLoading) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Center h={400}>
          <Loader />
        </Center>
      </Paper>
    );
  }

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Box>
          <Text fw={600} size="lg" mb="md">
            My Customer List
          </Text>

          <TextInput
            placeholder="Search by customer name or email..."
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            mb="lg"
          />
        </Box>

        {filteredCustomers.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">
              {searchQuery ? 'No customers match your search' : 'No customers yet'}
            </Text>
          </Center>
        ) : (
          <Box style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Total Pickups</Table.Th>
                  <Table.Th>Last Pickup Date</Table.Th>
                  <Table.Th style={{ width: '50px' }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredCustomers.map((customer) => (
                  <Table.Tr key={customer._id}>
                    <Table.Td>
                      <Text fw={500}>{customer.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {maskEmail(customer.email)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        variant="light"
                        color={
                          customer.customerType === 'individual'
                            ? 'blue'
                            : customer.customerType === 'community'
                            ? 'green'
                            : 'purple'
                        }
                      >
                        {customer.customerType === 'individual'
                          ? 'Individual'
                          : customer.customerType === 'community'
                          ? 'Community'
                          : 'Organization'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="dot">{customer.pickupCount}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(customer.lastPickupDate).toLocaleDateString('en-IN')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            icon={<IconHistory size={14} />}
                            onClick={() => onViewHistory(customer)}
                          >
                            View History
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        )}

        <Text size="sm" c="dimmed">
          Showing {filteredCustomers.length} of {customers?.length || 0} customers
        </Text>
      </Stack>
    </Paper>
  );
};

export default MyCustomerList;
