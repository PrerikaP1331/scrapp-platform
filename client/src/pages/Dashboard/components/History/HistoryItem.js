// /client/src/pages/Dashboard/components/History/HistoryItem.js
import React, { useState } from 'react';
import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Grid,
  Button,
  Collapse,
  Divider,
  Paper,
  ThemeIcon,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const statusColors = {
  scheduled: 'blue',
  upcoming: 'blue',
  'in-transit': 'cyan',
  completed: 'green',
  cancelled: 'red',
  available: 'green',
  used: 'gray',
  expired: 'red',
};

function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card withBorder p="md" mb="md" style={{ cursor: 'pointer' }}>
      <Card.Section>
        <Group
          justify="space-between"
          p="md"
          onClick={() => setExpanded(!expanded)}
          style={{ backgroundColor: expanded ? '#f9f9f9' : 'transparent' }}
        >
          <Group grow>
            <Group gap="md" grow>
              <ThemeIcon size="lg" radius="md" variant="light">
                <Text size="xl">{item.icon}</Text>
              </ThemeIcon>

              <Stack gap="xs" style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text fw={500} style={{ color: '#344e41' }}>
                    {item.title}
                  </Text>
                  <Badge
                    color={statusColors[item.status] || 'gray'}
                    variant="filled"
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </Group>
                <Text size="sm" color="dimmed">
                  {formatDate(item.date)}
                  {item.type === 'pickup' && ` at ${item.details.timeSlot}`}
                </Text>
              </Stack>
            </Group>
          </Group>

          <ThemeIcon variant="subtle" color="gray" size="lg">
            {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </ThemeIcon>
        </Group>
      </Card.Section>

      <Collapse in={expanded}>
        <Divider />
        <Card.Section p="md">
          <Stack gap="md">
            {item.type === 'pickup' && (
              <>
                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    WASTE TYPES
                  </Text>
                  <Group gap="xs">
                    {item.details.wasteTypes?.map((type) => (
                      <Badge key={type} variant="light">
                        {type}
                      </Badge>
                    ))}
                  </Group>
                </div>

                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    QUANTITY
                  </Text>
                  <Text size="sm">{item.details.quantity}</Text>
                </div>

                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    RECYCLER
                  </Text>
                  <Text size="sm" fw={500}>
                    {item.details.recyclerName}
                  </Text>
                  {item.details.rating && (
                    <Text size="sm" color="dimmed">
                      ⭐ {item.details.rating.averageScore?.toFixed(1) || 'N/A'} (
                      {item.details.rating.totalReviews || 0} reviews)
                    </Text>
                  )}
                </div>

                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    PICKUP ADDRESS
                  </Text>
                  <Stack gap="xs">
                    <Text size="sm">{item.details.address?.addressLine1}</Text>
                    {item.details.address?.addressLine2 && (
                      <Text size="sm">{item.details.address.addressLine2}</Text>
                    )}
                    <Text size="sm" color="dimmed">
                      {item.details.address?.city}, {item.details.address?.state}{' '}
                      {item.details.address?.postalCode}
                    </Text>
                  </Stack>
                </div>

                {item.details.notes && (
                  <div>
                    <Text fw={500} mb="xs" size="sm" color="dimmed">
                      NOTES
                    </Text>
                    <Paper p="sm" withBorder style={{ backgroundColor: '#fffbf0' }}>
                      <Text size="sm">{item.details.notes}</Text>
                    </Paper>
                  </div>
                )}
              </>
            )}

            {item.type === 'coupon' && (
              <>
                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    COUPON CODE
                  </Text>
                  <Paper p="sm" withBorder style={{ backgroundColor: '#f0f8f5' }}>
                    <Text fw={700} style={{ fontFamily: 'monospace' }}>
                      {item.details.code}
                    </Text>
                  </Paper>
                </div>

                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    DISCOUNT
                  </Text>
                  <Text size="sm">
                    {item.details.discountValue}
                    {item.details.discountType === 'percentage' ? '%' : '₹'} Off
                  </Text>
                </div>

                <div>
                  <Text fw={500} mb="xs" size="sm" color="dimmed">
                    EXPIRY DATE
                  </Text>
                  <Text size="sm">{formatDate(item.details.expiryDate)}</Text>
                </div>

                {item.details.usedAt && (
                  <div>
                    <Text fw={500} mb="xs" size="sm" color="dimmed">
                      USED ON
                    </Text>
                    <Text size="sm">{formatDate(item.details.usedAt)}</Text>
                  </div>
                )}
              </>
            )}
          </Stack>
        </Card.Section>
      </Collapse>
    </Card>
  );
}

export default HistoryItem;
