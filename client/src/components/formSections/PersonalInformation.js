import React from 'react';
import { Grid, TextInput } from '@mantine/core';

function PersonalInformation({ form }) {
  return (
    <>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          {...form.getInputProps('name')}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Phone Number"
          placeholder="9876543210"
          {...form.getInputProps('phone')}
          required
        />
      </Grid.Col>
    </>
  );
}

export default PersonalInformation;