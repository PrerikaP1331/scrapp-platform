import React from 'react';
import { Grid, TextInput } from '@mantine/core';
import { IconUser, IconAt, IconPhone } from '@tabler/icons-react';

function PersonalInformation({ form }) {
  return (
    <>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          {...form.getInputProps('name')}
          required
          leftSection={<IconUser size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
          required
          leftSection={<IconAt size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Phone Number"
          placeholder="9876543210"
          {...form.getInputProps('phone')}
          required
          leftSection={<IconPhone size={16} />}
          leftSectionWidth={36}
        />
      </Grid.Col>
    </>
  );
}

export default PersonalInformation;