// /client/src/components/formSections/OrganisationalDetails.js
import React from 'react';
import { Grid, TextInput, Title, Select } from '@mantine/core';
import AddressInformation from './AddressInformation';

function OrganisationalDetails({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>Organisation Details</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput label="Organisation Name" placeholder="e.g., Innovatech Solutions Inc." {...form.getInputProps('orgName')} required />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Type of Organisation"
          placeholder="Select a type"
          data={['Corporate Office', 'Retail Store / Business', 'School / University', 'Restaurant / Hotel', 'Factory / Industrial Unit', 'Non-Profit / NGO', 'Other']}
          {...form.getInputProps('orgType')}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Approximate Number of Employees / Members"
          placeholder="Select a range"
          data={['1-25', '26-100', '101-500', '501-1000', '1000+']}
          {...form.getInputProps('employeeCount')}
          required
        />
      </Grid.Col>
      <AddressInformation form={form} title="Organisation's Primary Address" />
    </>
  );
}

export default OrganisationalDetails;