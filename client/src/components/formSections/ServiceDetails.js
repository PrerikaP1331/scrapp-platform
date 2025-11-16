// /client/src/components/formSections/ServiceDetails.js
import React from 'react';
import { Grid, Title, Textarea, Checkbox, Group } from '@mantine/core';

const wasteOptions = [
  'Paper & Cardboard', 'Hard Plastics (e.g., Bottles, Containers)', 'Soft Plastics (e.g., Bags, Wrappers)',
  'Glass (Bottles, Jars)', 'Metal (Cans, Aluminum Foil)', 'E-waste (Batteries, small electronics, wires)',
  'Textiles & Fabric', 'Organic/Compostable Waste'
];

function ServiceDetails({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>Service Details</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Service Areas"
          description="Please list the postal codes or city neighborhoods you serve, separated by commas."
          placeholder="e.g., 400050, 400051, Andheri West, Juhu"
          {...form.getInputProps('serviceAreas')}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Checkbox.Group
          label="Types of Waste Accepted"
          description="Select at least one."
          {...form.getInputProps('acceptedWasteTypes')}
          required
        >
          <Group mt="xs">
            {wasteOptions.map(option => <Checkbox key={option} value={option} label={option} />)}
          </Group>
        </Checkbox.Group>
      </Grid.Col>
    </>
  );
}

export default ServiceDetails;