// /client/src/components/formSections/ContactPersonInformation.js
import React from 'react';
import { Grid, TextInput, Title } from '@mantine/core';

function ContactPersonInformation({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} style={{ color: '#3a5a40' }}>Primary Contact Information</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput label="Full Name" placeholder="e.g., Priya Sharma" {...form.getInputProps('name')} required />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Work Email Address" placeholder="your@company.com" {...form.getInputProps('email')} required />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Work Phone Number" placeholder="9876543210" {...form.getInputProps('phone')} required />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput label="Your Role / Title (Optional)" placeholder="e.g., Facilities Manager" {...form.getInputProps('roleTitle')} />
      </Grid.Col>
    </>
  );
}

export default ContactPersonInformation;