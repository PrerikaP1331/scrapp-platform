// /client/src/pages/Dashboard/components/SchedulePickup/Step1_WasteDetails.js
import React from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  SimpleGrid,
  Badge,
  Stack,
  Textarea,
  Select,
  Group,
  Button,
} from '@mantine/core';
import {
  IconRecycle,
  IconBox,
  IconBottle,
  IconFlame,
  IconPlug,
  IconShirt,
  IconQuestionMark,
} from '@tabler/icons-react';
import styles from './SchedulePickup.module.css';

const wasteTypes = [
  { label: 'Paper & Cardboard', icon: IconBox, value: 'Paper & Cardboard' },
  { label: 'Plastics', icon: IconBottle, value: 'Plastics' },
  { label: 'Glass', icon: IconFlame, value: 'Glass' },
  { label: 'Metal', icon: IconRecycle, value: 'Metal' },
  { label: 'E-Waste', icon: IconPlug, value: 'E-Waste' },
  { label: 'Textiles', icon: IconShirt, value: 'Textiles' },
  { label: 'Other', icon: IconQuestionMark, value: 'Other' },
];

const quantityOptions = [
  { value: '1-2 Small Bags', label: '1-2 Small Bags' },
  { value: 'A Medium Box', label: 'A Medium Box' },
  { value: 'Multiple Large Bags', label: 'Multiple Large Bags' },
  { value: 'Bulky Items', label: 'Bulky Items' },
];

function Step1_WasteDetails({ formData, setFormData, onNext }) {
  const handleWasteTypeToggle = (wasteType) => {
    setFormData((prev) => {
      const isSelected = prev.wasteTypes.includes(wasteType);
      return {
        ...prev,
        wasteTypes: isSelected
          ? prev.wasteTypes.filter((w) => w !== wasteType)
          : [...prev.wasteTypes, wasteType],
      };
    });
  };

  const handleQuantityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      quantity: value,
    }));
  };

  const handleNotesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  const isFormValid = formData.wasteTypes.length > 0 && formData.quantity;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={2} mb="xs" style={{ color: '#344e41' }}>
            Step 1 of 3: What are you recycling?
          </Title>
          <Text color="dimmed">Select one or more waste categories</Text>
        </div>

        {/* Waste Type Selection */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>
            Select Waste Types
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} gap="md">
            {wasteTypes.map((waste) => {
              const Icon = waste.icon;
              const isSelected = formData.wasteTypes.includes(waste.value);
              return (
                <Card
                  key={waste.value}
                  onClick={() => handleWasteTypeToggle(waste.value)}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #588157' : '1px solid #e0e0e0',
                    backgroundColor: isSelected ? '#f0f8f5' : '#fff',
                    transition: 'all 0.2s ease',
                  }}
                  p="md"
                  className={styles.wasteCard}
                >
                  <Stack align="center" gap="sm">
                    <Icon size={40} color={isSelected ? '#588157' : '#999'} />
                    <Text fw={500} size="sm" ta="center">
                      {waste.label}
                    </Text>
                    {isSelected && (
                      <Badge color="teal" size="sm">
                        Selected
                      </Badge>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </div>

        {/* Quantity Selection */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>
            How much waste is there, approximately?
          </Title>
          <Select
            placeholder="Select quantity"
            data={quantityOptions}
            value={formData.quantity}
            onChange={handleQuantityChange}
            searchable
            clearable
            size="md"
            styles={{
              input: {
                borderColor: '#ddd',
              },
            }}
          />
        </div>

        {/* Notes */}
        <div>
          <Title order={4} mb="md" style={{ color: '#344e41' }}>
            Any special instructions? (optional)
          </Title>
          <Textarea
            placeholder="e.g., Pickup from the security gate, Contains fragile glass items..."
            minRows={3}
            value={formData.notes}
            onChange={handleNotesChange}
            styles={{
              input: {
                borderColor: '#ddd',
              },
            }}
          />
        </div>

        {/* Navigation */}
        <Group justify="flex-end" mt="xl">
          <Button
            size="md"
            onClick={onNext}
            disabled={!isFormValid}
            style={{
              backgroundColor: '#588157',
            }}
          >
            Next →
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Step1_WasteDetails;
