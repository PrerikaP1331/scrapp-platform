// client/src/components/CustomerCommunication/SentHistory.js
import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Loader,
  Center,
  Text,
  Box,
  Card,
  Group,
  Badge,
  Collapse
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

const SentHistory = ({ announcements, isLoading }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Center h={400}>
          <Loader />
        </Center>
      </Paper>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Text c="dimmed">You haven't sent any announcements yet.</Text>
            <Text size="sm" c="dimmed">
              Announcements will appear here once you send them.
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">
          Sent History
        </Text>

        {announcements.map((announcement) => (
          <Card
            key={announcement._id}
            p="md"
            radius="md"
            withBorder
            style={{
              cursor: 'pointer',
              backgroundColor: expandedId === announcement._id ? '#f8f9fa' : 'transparent',
              transition: 'all 0.2s ease'
            }}
            onClick={() =>
              setExpandedId(expandedId === announcement._id ? null : announcement._id)
            }
          >
            <Group justify="space-between" mb="md">
              <Stack gap={0} style={{ flex: 1 }}>
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="md">
                      {announcement.subject}
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      Sent on:{' '}
                      {new Date(announcement.sentAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                  </Box>

                  <IconChevronDown
                    size={20}
                    style={{
                      transform:
                        expandedId === announcement._id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      marginTop: '4px'
                    }}
                  />
                </Group>
              </Stack>
            </Group>

            <Group gap="sm" mb="md">
              <Badge variant="light" color="blue">
                Sent to {announcement.recipientCount} customer{announcement.recipientCount !== 1 ? 's' : ''}
              </Badge>
            </Group>

            <Collapse in={expandedId === announcement._id}>
              <Box
                p="md"
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  marginTop: 'md'
                }}
              >
                <Text fw={600} size="sm" mb="md">
                  Message:
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {announcement.message}
                </Text>
              </Box>
            </Collapse>
          </Card>
        ))}

        <Text size="sm" c="dimmed" mt="md">
          Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </Text>
      </Stack>
    </Paper>
  );
};

export default SentHistory;
