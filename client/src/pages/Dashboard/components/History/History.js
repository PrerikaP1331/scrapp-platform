// /client/src/pages/Dashboard/components/History/History.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Title,
  Card,
  Text,
  Pagination,
  Center,
  Loader,
  Paper,
  Tabs,
  Group,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getUserHistory } from '../../../../api/historyService';
import FilterBar from './FilterBar';
import HistoryItem from './HistoryItem';
import styles from './History.module.css';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch history
  useEffect(() => {
    fetchHistory();
  }, [searchTerm, typeFilter, statusFilter, currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserHistory({
        type: typeFilter,
        status: statusFilter,
        search: searchTerm,
        page: currentPage,
        limit: 10,
      });

      setHistory(data.history);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching history:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch history',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Card withBorder p="lg" style={{ backgroundColor: '#f0f8f5' }}>
          <Title order={1} style={{ color: '#344e41' }} mb="xs">
            Transaction History
          </Title>
          <Text color="dimmed">
            View your pickups, coupons, and other activities
          </Text>
        </Card>

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilters}
        />

        {/* Tabs */}
        <Tabs
          value={typeFilter}
          onChange={handleTypeChange}
          defaultValue="all"
        >
          <Tabs.List>
            <Tabs.Tab value="all">All Activity</Tabs.Tab>
            <Tabs.Tab value="pickups">Pickups</Tabs.Tab>
            <Tabs.Tab value="coupons">Coupons</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* History List */}
        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : history.length > 0 ? (
          <Stack>
            {history.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}

            {/* Pagination */}
            {pagination.total > 1 && (
              <Center mt="xl">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={pagination.total}
                  size="lg"
                />
              </Center>
            )}
          </Stack>
        ) : (
          <Paper p="xl" ta="center" withBorder>
            <Text color="dimmed">
              {searchTerm || statusFilter !== 'all'
                ? 'No transactions found matching your filters.'
                : 'You have no transaction history yet. Start by scheduling a pickup!'}
            </Text>
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="light"
                onClick={handleResetFilters}
                mt="md"
                style={{ color: '#588157' }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>
        )}

        {/* Summary Stats */}
        {pagination.totalItems > 0 && (
          <Paper p="md" withBorder style={{ backgroundColor: '#f9f9f9' }}>
            <Group justify="center">
              <Text size="sm" color="dimmed">
                Showing {history.length} of {pagination.totalItems} transactions
              </Text>
            </Group>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

export default History;
