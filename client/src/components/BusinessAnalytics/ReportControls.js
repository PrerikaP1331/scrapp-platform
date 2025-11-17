// client/src/components/BusinessAnalytics/ReportControls.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Paper,
  Flex
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconDownload, IconCalendar } from '@tabler/icons-react';

const ReportControls = ({ onDateRangeChange, onExport, isLoading }) => {
  const [selectedPreset, setSelectedPreset] = useState('last30days');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDateRange = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'last30days':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = today;
        break;
      case 'thisquarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = today;
        break;
      case 'lastquarter':
        const lastQ = Math.floor((today.getMonth() - 3) / 3);
        start = new Date(today.getFullYear(), lastQ * 3, 1);
        end = new Date(today.getFullYear(), (lastQ + 1) * 3, 0);
        break;
      case 'thisyear':
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        break;
      default:
        start = null;
        end = null;
    }

    return { start, end };
  };

  const handlePresetChange = (value) => {
    setSelectedPreset(value);
    const { start, end } = getDateRange(value);
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
      onDateRangeChange(start, end);
    }
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
      setSelectedPreset('custom');
    }
  };

  const handleExport = () => {
    onExport();
  };

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Box>
          <Text fw={600} size="lg" mb="md">
            Report Controls
          </Text>
        </Box>

        <Flex gap="md" wrap="wrap" align="flex-end">
          <Select
            label="Quick Presets"
            placeholder="Select date range"
            value={selectedPreset}
            onChange={handlePresetChange}
            data={[
              { value: 'last30days', label: 'Last 30 Days' },
              { value: 'thisquarter', label: 'This Quarter' },
              { value: 'lastquarter', label: 'Last Quarter' },
              { value: 'thisyear', label: 'This Year' }
            ]}
            style={{ flex: 1, minWidth: '200px' }}
          />

          <DatePickerInput
            label="Start Date"
            placeholder="Pick start date"
            value={startDate}
            onChange={setStartDate}
            icon={<IconCalendar size={16} />}
            style={{ flex: 1, minWidth: '180px' }}
          />

          <DatePickerInput
            label="End Date"
            placeholder="Pick end date"
            value={endDate}
            onChange={setEndDate}
            icon={<IconCalendar size={16} />}
            style={{ flex: 1, minWidth: '180px' }}
          />

          <Button
            onClick={handleCustomDateChange}
            disabled={!startDate || !endDate}
            variant="light"
          >
            Apply
          </Button>

          <Button
            onClick={handleExport}
            leftSection={<IconDownload size={16} />}
            disabled={isLoading}
            variant="filled"
            color="green"
          >
            Export CSV
          </Button>
        </Flex>

        {selectedPreset && selectedPreset !== 'custom' && startDate && endDate && (
          <Text size="sm" c="dimmed">
            Selected range: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default ReportControls;
