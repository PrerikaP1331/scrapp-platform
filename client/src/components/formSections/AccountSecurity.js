import React from 'react';
import { Grid, PasswordInput, Title } from '@mantine/core';

function AccountSecurity({ form, inputClassNames, sectionTitleClass }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" className={sectionTitleClass}>Account Security</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          required
          classNames={inputClassNames}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
          required
          classNames={inputClassNames}
        />
      </Grid.Col>
    </>
  );
}

export default AccountSecurity;