import React from 'react';
import { Grid, PasswordInput, Title } from '@mantine/core';

function AccountSecurity({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>Account Security</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
          required
        />
      </Grid.Col>
    </>
  );
}

export default AccountSecurity;