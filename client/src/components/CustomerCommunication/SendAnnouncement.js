// client/src/components/CustomerCommunication/SendAnnouncement.js
import React, { useState } from 'react';
import {
  Paper,
  Stack,
  TextInput,
  Textarea,
  Button,
  Alert,
  Group,
  Modal,
  Text,
  Box
} from '@mantine/core';
import { IconAlertCircle, IconSend } from '@tabler/icons-react';

const SendAnnouncement = ({ customerCount, onSend, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isValid = subject.trim().length > 0 && message.trim().length > 0;

  const handleSendClick = () => {
    if (!isValid) return;
    setModalOpen(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    setError(null);

    try {
      await onSend(subject, message);
      setSubject('');
      setMessage('');
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send announcement');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Paper p="lg" radius="md" withBorder>
        <Stack gap="lg">
          <Box>
            <Text fw={600} size="lg" mb="xs">
              Create a New Announcement
            </Text>
            <Text size="sm" c="dimmed">
              Your message will be sent as a notification to all customers who have previously completed a pickup with you.
            </Text>
          </Box>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
              {error}
            </Alert>
          )}

          <TextInput
            label="Subject"
            placeholder="e.g., Holiday Hours Update"
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
            disabled={isLoading || isSending}
            description="The title of your announcement"
          />

          <Textarea
            label="Message"
            placeholder="Hello valued customers, please note that..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            minRows={6}
            disabled={isLoading || isSending}
            description="The body of your announcement"
          />

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {customerCount > 0 ? (
                <>
                  This will be sent to <Text component="span" fw={600}>{customerCount}</Text> customer{customerCount !== 1 ? 's' : ''}
                </>
              ) : (
                'No customers to send to'
              )}
            </Text>

            <Button
              leftSection={<IconSend size={16} />}
              onClick={handleSendClick}
              disabled={!isValid || customerCount === 0 || isLoading || isSending}
              loading={isSending}
              color="blue"
            >
              Send Announcement {customerCount > 0 && `to ${customerCount} Customer${customerCount !== 1 ? 's' : ''}`}
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Announcement"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to send this message to all <Text component="span" fw={600}>{customerCount}</Text> of your customers?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone.
          </Text>

          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => setModalOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSend}
              loading={isSending}
              color="green"
            >
              Confirm & Send
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SendAnnouncement;
