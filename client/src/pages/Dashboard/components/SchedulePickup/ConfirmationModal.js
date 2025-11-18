// /client/src/pages/Dashboard/components/SchedulePickup/ConfirmationModal.js
import React from 'react';
import {
  Modal,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Badge,
  Paper,
  Divider,
} from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  formData,
  selectedRecycler,
  loading,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Your Pickup"
      centered
      size="md"
    >
      <Stack gap="md">
        {/* Success Icon */}
        <Group justify="center">
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#f0f8f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconCheck size={32} color="#588157" />
          </div>
        </Group>

        {/* Summary */}
        <div>
          <Title order={3} ta="center" style={{ color: '#344e41' }} mb="lg">
            Ready to Schedule Pickup?
          </Title>

          {/* What */}
          <Paper p="md" mb="md" withBorder style={{ backgroundColor: '#f9f9f9' }}>
            <Text fw={500} size="sm" color="dimmed" mb="xs">
              WHAT
            </Text>
            <Group gap="xs">
              {formData.wasteTypes?.map((type) => (
                <Badge key={type} variant="light">
                  {type}
                </Badge>
              ))}
            </Group>
            <Text size="sm" mt="xs" color="dimmed">
              Quantity: {formData.quantity}
            </Text>
          </Paper>

          {/* When */}
          <Paper p="md" mb="md" withBorder style={{ backgroundColor: '#f9f9f9' }}>
            <Text fw={500} size="sm" color="dimmed" mb="xs">
              WHEN
            </Text>
            <Text fw={500}>
              {formData.scheduledDate
                ? new Date(formData.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </Text>
            <Text size="sm" mt="xs">
              {formData.timeSlot}
            </Text>
          </Paper>

          {/* Where */}
          <Paper p="md" mb="md" withBorder style={{ backgroundColor: '#f9f9f9' }}>
            <Text fw={500} size="sm" color="dimmed" mb="xs">
              WHERE
            </Text>
            <Stack gap="xs">
              <Text fw={500}>{formData.address?.addressLine1}</Text>
              {formData.address?.addressLine2 && (
                <Text size="sm">{formData.address.addressLine2}</Text>
              )}
              <Text size="sm" color="dimmed">
                {formData.address?.city}, {formData.address?.state}{' '}
                {formData.address?.postalCode}
              </Text>
            </Stack>
          </Paper>

          {/* Recycler */}
          <Paper p="md" withBorder style={{ backgroundColor: '#f0f8f5' }}>
            <Text fw={500} size="sm" color="dimmed" mb="xs">
              RECYCLER
            </Text>
            <Text fw={500}>{selectedRecycler?.businessName}</Text>
            <Group gap="xs" mt="xs">
              <Badge color="teal" variant="light">
                {selectedRecycler?.rating?.averageScore?.toFixed(1) || 'N/A'} ⭐
              </Badge>
              {selectedRecycler?.specialties?.[0] && (
                <Badge variant="light">{selectedRecycler.specialties[0]}</Badge>
              )}
            </Group>
          </Paper>

          {/* Notes */}
          {formData.notes && (
            <>
              <Divider my="md" />
              <Paper p="md" withBorder style={{ backgroundColor: '#fffbf0' }}>
                <Text fw={500} size="sm" color="dimmed" mb="xs">
                  NOTES
                </Text>
                <Text size="sm">{formData.notes}</Text>
              </Paper>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            style={{
              backgroundColor: '#588157',
            }}
          >
            Confirm & Schedule
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ConfirmationModal;
