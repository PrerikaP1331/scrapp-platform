// /client/src/components/formSections/ContactPersonInformation.js
import React from 'react';
import { Grid, TextInput, Title } from '@mantine/core';

function ContactPersonInformation({ form, inputClassNames, sectionTitleClass }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} className={sectionTitleClass}>Primary Contact Information</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput label="Full Name" placeholder="e.g., Priya Sharma" {...form.getInputProps('name')} required classNames={inputClassNames} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Work Email Address" placeholder="your@company.com" {...form.getInputProps('email')} required classNames={inputClassNames} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Work Phone Number" placeholder="9876543210" {...form.getInputProps('phone')} required classNames={inputClassNames} />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput label="Your Role / Title (Optional)" placeholder="e.g., Facilities Manager" {...form.getInputProps('roleTitle')} classNames={inputClassNames} />
      </Grid.Col>
    </>
  );
}

export default ContactPersonInformation;