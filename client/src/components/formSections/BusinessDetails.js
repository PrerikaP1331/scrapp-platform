// /client/src/components/formSections/BusinessDetails.js
import React from 'react';
import { Grid, TextInput, Title } from '@mantine/core';
import AddressInformation from './AddressInformation';

function BusinessDetails({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>Business Details</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Official Business Name"
          placeholder="e.g., Green Planet Recyclers Pvt. Ltd."
          {...form.getInputProps('businessName')}
          required
        />
      </Grid.Col>
      <>
        <AddressInformation form={form} title="Business Address (Depot/Office Location)" />
      </>
    </>
  );
}

export default BusinessDetails;