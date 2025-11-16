// /client/src/components/formSections/CommunityDetails.js
import React from 'react';
import { Grid, TextInput, Title, Select } from '@mantine/core';
import AddressInformation from './AddressInformation'; // We are composing components!

function CommunityDetails({ form }) {
  return (
    <>
      <Grid.Col span={12}>
        <Title order={4} mt="md" style={{ color: '#3a5a40' }}>Community Details</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Community Name"
          placeholder="e.g., Green Meadows Housing Society"
          {...form.getInputProps('communityName')}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Community Type"
          placeholder="Select a type"
          data={[
            'Residential Society / RWA',
            'Apartment Complex',
            'Neighborhood Association',
            'Other'
          ]}
          {...form.getInputProps('communityType')}
          required
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Approximate Number of Households"
          placeholder="Select a range"
          data={['1-50', '51-100', '101-250', '251-500', '500+']}
          {...form.getInputProps('householdCount')}
          required
        />
      </Grid.Col>
      
      {/* Here we reuse the AddressInformation component for the community's address */}
      <AddressInformation form={form} title="Community's Primary Address" />
    </>
  );
}

export default CommunityDetails;