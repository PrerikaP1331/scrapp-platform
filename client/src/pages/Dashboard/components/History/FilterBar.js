// /client/src/pages/Dashboard/components/History/FilterBar.js
import React from 'react';
import { Group, TextInput, Select, Button, Stack } from '@mantine/core';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';

function FilterBar({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
}) {
  const typeOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'pickups', label: 'Pickups' },
    { value: 'coupons', label: 'Coupons' },
  ];

  const getStatusOptions = () => {
    const baseOptions = [{ value: 'all', label: 'All Status' }];

    if (typeFilter === 'pickups') {
      return [
        ...baseOptions,
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ];
    } else if (typeFilter === 'coupons') {
      return [
        ...baseOptions,
        { value: 'upcoming', label: 'Available' },
        { value: 'completed', label: 'Used' },
      ];
    }

    return baseOptions;
  };

  return (
    <Stack gap="md">
      <Group grow>
        <TextInput
          placeholder="Search by recycler, item, or coupon..."
          icon={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="md"
        />
      </Group>

      <Group grow>
        <Select
          label="Filter by Type"
          placeholder="Select type"
          data={typeOptions}
          value={typeFilter}
          onChange={onTypeChange}
          size="md"
          searchable
        />

        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={getStatusOptions()}
          value={statusFilter}
          onChange={onStatusChange}
          size="md"
          searchable
          disabled={typeFilter === 'all'}
        />

        <div>
          <Button
            variant="light"
            leftSection={<IconFilterOff size={16} />}
            onClick={onReset}
            fullWidth
            style={{ marginTop: '24px' }}
          >
            Reset Filters
          </Button>
        </div>
      </Group>
    </Stack>
  );
}

export default FilterBar;
