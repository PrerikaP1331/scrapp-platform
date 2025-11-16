import React from 'react';
import { Grid, TextInput, Title } from '@mantine/core';
import { IconHome, IconMapPin, IconHash } from '@tabler/icons-react';

function AddressInformation({ form, title = "Pickup Location" }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>{title}</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Address Line 1"
          placeholder="123 Main St"
          {...form.getInputProps('addressLine1')}
          required
          leftSection={<IconHome size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Address Line 2 (Apartment, suite, etc.)"
          placeholder="Apt 4B"
          {...form.getInputProps('addressLine2')}
          leftSection={<IconHome size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput
          label="City"
          placeholder="Mumbai"
          {...form.getInputProps('city')}
          required
          leftSection={<IconMapPin size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput
          label="Postal / ZIP Code"
          placeholder="400001"
          {...form.getInputProps('postalCode')}
          required
          leftSection={<IconHash size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput
          label="State / Province"
          placeholder="Maharashtra"
          {...form.getInputProps('state')}
          required
          leftSection={<IconMapPin size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
    </>
  );
}

export default AddressInformation;