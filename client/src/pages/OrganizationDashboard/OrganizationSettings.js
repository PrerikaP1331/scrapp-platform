import React, { useState } from 'react';
import { Container, Paper, Title, Button, Stack, Group, Tabs, TextInput, PasswordInput, Select, Textarea, Avatar } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

function OrganizationSettings() {
  const [adminData, setAdminData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    phone: '+91 9876543210',
    role: 'Organization Admin',
  });

  const [orgData, setOrgData] = useState({
    companyName: 'Tech Company Ltd',
    registrationNumber: 'REG-2024-001',
    industry: 'Technology',
    website: 'www.techcompany.com',
    address: '123 Business Street',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560001',
    contactEmail: 'contact@company.com',
    contactPhone: '+91 80 XXXX XXXX',
    description: 'Leading technology solutions provider',
  });

  const [activeTab, setActiveTab] = useState('admin');

  const handleAdminChange = (field, value) => {
    setAdminData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (field, value) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} style={{ color: '#344e41' }} mb="xs">Settings</Title>
          <p style={{ color: '#666' }}>Manage your profile and organization details</p>
        </div>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="admin">Admin Profile</Tabs.Tab>
            <Tabs.Tab value="organization">Organization Details</Tabs.Tab>
          </Tabs.List>

          {/* Admin Profile Tab */}
          <Tabs.Panel value="admin" pt="md">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap="lg">
                <Group>
                  <Avatar size={80} radius="lg" />
                  <Button leftSection={<IconUpload size={18} />} variant="default">
                    Change Photo
                  </Button>
                </Group>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Personal Information</Title>
                  <Group grow>
                    <TextInput
                      label="First Name"
                      placeholder="First name"
                      value={adminData.firstName}
                      onChange={(e) => handleAdminChange('firstName', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Last name"
                      value={adminData.lastName}
                      onChange={(e) => handleAdminChange('lastName', e.currentTarget.value)}
                    />
                  </Group>
                </div>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Contact Information</Title>
                  <Stack gap="md">
                    <TextInput
                      label="Email Address"
                      type="email"
                      value={adminData.email}
                      onChange={(e) => handleAdminChange('email', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Phone Number"
                      value={adminData.phone}
                      onChange={(e) => handleAdminChange('phone', e.currentTarget.value)}
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Security</Title>
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    description="Leave blank to keep current password"
                  />
                </div>

                <Group justify="flex-end">
                  <Button variant="default">Cancel</Button>
                  <Button style={{ backgroundColor: '#588157' }}>Save Changes</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* Organization Details Tab */}
          <Tabs.Panel value="organization" pt="md">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap="lg">
                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Company Information</Title>
                  <Stack gap="md">
                    <TextInput
                      label="Company Name"
                      placeholder="Organization name"
                      value={orgData.companyName}
                      onChange={(e) => handleOrgChange('companyName', e.currentTarget.value)}
                    />
                    <Group grow>
                      <TextInput
                        label="Registration Number"
                        value={orgData.registrationNumber}
                        onChange={(e) => handleOrgChange('registrationNumber', e.currentTarget.value)}
                      />
                      <Select
                        label="Industry"
                        placeholder="Select industry"
                        data={[
                          { value: 'technology', label: 'Technology' },
                          { value: 'manufacturing', label: 'Manufacturing' },
                          { value: 'retail', label: 'Retail' },
                          { value: 'healthcare', label: 'Healthcare' },
                          { value: 'finance', label: 'Finance' },
                          { value: 'other', label: 'Other' },
                        ]}
                        value={orgData.industry}
                        onChange={(value) => handleOrgChange('industry', value)}
                      />
                    </Group>
                    <TextInput
                      label="Website"
                      placeholder="https://example.com"
                      value={orgData.website}
                      onChange={(e) => handleOrgChange('website', e.currentTarget.value)}
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Address</Title>
                  <Stack gap="md">
                    <TextInput
                      label="Street Address"
                      placeholder="123 Business Street"
                      value={orgData.address}
                      onChange={(e) => handleOrgChange('address', e.currentTarget.value)}
                    />
                    <Group grow>
                      <TextInput
                        label="City"
                        value={orgData.city}
                        onChange={(e) => handleOrgChange('city', e.currentTarget.value)}
                      />
                      <TextInput
                        label="State/Province"
                        value={orgData.state}
                        onChange={(e) => handleOrgChange('state', e.currentTarget.value)}
                      />
                      <TextInput
                        label="Postal Code"
                        value={orgData.postalCode}
                        onChange={(e) => handleOrgChange('postalCode', e.currentTarget.value)}
                      />
                    </Group>
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Contact</Title>
                  <Stack gap="md">
                    <TextInput
                      label="Contact Email"
                      type="email"
                      value={orgData.contactEmail}
                      onChange={(e) => handleOrgChange('contactEmail', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Contact Phone"
                      value={orgData.contactPhone}
                      onChange={(e) => handleOrgChange('contactPhone', e.currentTarget.value)}
                    />
                  </Stack>
                </div>

                <div>
                  <Title order={5} style={{ color: '#344e41' }} mb="md">Description</Title>
                  <Textarea
                    label="Company Description"
                    placeholder="Tell us about your organization"
                    rows={4}
                    value={orgData.description}
                    onChange={(e) => handleOrgChange('description', e.currentTarget.value)}
                  />
                </div>

                <Group justify="flex-end">
                  <Button variant="default">Cancel</Button>
                  <Button style={{ backgroundColor: '#588157' }}>Save Changes</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}

export default OrganizationSettings;
