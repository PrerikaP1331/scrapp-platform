// /client/src/pages/Dashboard/components/SchedulePickup/SuccessModal.js
import React from 'react';
import {
  Modal,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Center,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function SuccessModal({ opened, onViewHistory, onBackToDashboard, pickupId }) {
  return (
    <Modal opened={opened} onClose={() => {}} centered size="md" withCloseButton={false}>
      <Stack gap="xl" align="center">
        {/* Success Icon */}
        <ThemeIcon
          size="xl"
          radius="xl"
          style={{ backgroundColor: '#588157' }}
        >
          <IconCheck size={48} color="white" />
        </ThemeIcon>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <Title order={2} style={{ color: '#344e41' }}>
            Pickup Scheduled! 🎉
          </Title>
          <Text color="dimmed" mt="xs">
            Your waste pickup has been successfully scheduled. A recycler will contact you soon.
          </Text>
        </div>

        {/* Pickup ID */}
        {pickupId && (
          <Group gap="xs" justify="center">
            <Text size="sm" color="dimmed">
              Pickup ID: <strong>{pickupId}</strong>
            </Text>
          </Group>
        )}

        {/* Divider Text */}
        <Text size="sm" color="dimmed" ta="center">
          You can view your pickup details and track status in your history
        </Text>

        {/* Action Buttons */}
        <Group grow>
          <Button
            variant="light"
            onClick={onBackToDashboard}
            style={{ color: '#588157' }}
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={onViewHistory}
            style={{ backgroundColor: '#588157' }}
          >
            View in My History
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default SuccessModal;
