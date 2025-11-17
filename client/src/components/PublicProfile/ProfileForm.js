// client/src/components/PublicProfile/ProfileForm.js
import React, { useState } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  Group,
  Button,
  FileInput,
  Checkbox,
  Paper,
  Text,
  Box,
  Divider,
  SimpleGrid,
  Badge,
  ActionIcon
} from '@mantine/core';
import { IconUpload, IconX } from '@tabler/icons-react';

const WASTE_MATERIALS = [
  'Paper & Cardboard',
  'Plastics',
  'Glass',
  'E-Waste',
  'Metals',
  'Textiles',
  'Organic Waste',
  'Mixed Waste'
];

const CLIENT_TYPES = [
  { value: 'individual', label: 'Individuals / Households' },
  { value: 'community', label: 'Communities (RWAs)' },
  { value: 'organization', label: 'Commercial Organizations' }
];

const ProfileForm = ({ profile, onChange, onSubmit, isLoading }) => {
  const [logoPreview, setLogoPreview] = useState(profile?.businessLogo || null);
  const [serviceAreaInput, setServiceAreaInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');

  const handleLogoChange = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setLogoPreview(base64);
        onChange('businessLogo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addServiceArea = () => {
    if (serviceAreaInput.trim()) {
      const currentAreas = profile?.serviceAreas || [];
      if (!currentAreas.includes(serviceAreaInput.trim())) {
        onChange('serviceAreas', [...currentAreas, serviceAreaInput.trim()]);
        setServiceAreaInput('');
      }
    }
  };

  const removeServiceArea = (area) => {
    onChange('serviceAreas', (profile?.serviceAreas || []).filter(a => a !== area));
  };

  const addSpecialty = () => {
    if (specialtyInput.trim()) {
      const currentSpecialties = profile?.specialties || [];
      if (!currentSpecialties.includes(specialtyInput.trim())) {
        onChange('specialties', [...currentSpecialties, specialtyInput.trim()]);
        setSpecialtyInput('');
      }
    }
  };

  const removeSpecialty = (specialty) => {
    onChange('specialties', (profile?.specialties || []).filter(s => s !== specialty));
  };

  const toggleWasteMaterial = (material) => {
    const current = profile?.acceptedWasteTypes || [];
    if (current.includes(material)) {
      onChange('acceptedWasteTypes', current.filter(m => m !== material));
    } else {
      onChange('acceptedWasteTypes', [...current, material]);
    }
  };

  const toggleClientType = (type) => {
    const current = profile?.clientTypes || [];
    if (current.includes(type)) {
      onChange('clientTypes', current.filter(t => t !== type));
    } else {
      onChange('clientTypes', [...current, type]);
    }
  };

  return (
    <Paper p="lg" radius="md" withBorder>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <Stack gap="lg">
          {/* Section A: Basic Business Information */}
          <Box>
            <Text fw={600} size="lg" mb="md">
              Basic Business Information
            </Text>

            <Stack gap="md">
              {/* Logo Upload */}
              <Box>
                <FileInput
                  label="Company Logo"
                  placeholder="Upload company logo"
                  icon={<IconUpload size={14} />}
                  accept="image/png,image/jpeg"
                  onChange={handleLogoChange}
                  disabled={isLoading}
                  description="Upload a PNG or JPEG image (recommended: square format)"
                />

                {logoPreview && (
                  <Box mt="md">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </Box>
                )}
              </Box>

              <TextInput
                label="Official Business Name"
                placeholder="e.g., EcoRecycle Solutions"
                value={profile?.businessName || ''}
                onChange={(e) => onChange('businessName', e.currentTarget.value)}
                required
                disabled={isLoading}
                description="This is what customers will see"
              />

              <TextInput
                label="Public Phone Number"
                placeholder="+91 XXXXX XXXXX"
                value={profile?.businessPhone || ''}
                onChange={(e) => onChange('businessPhone', e.currentTarget.value)}
                required
                disabled={isLoading}
                description="Customers will use this to contact you"
              />

              <TextInput
                label="Public Email Address (Optional)"
                placeholder="business@example.com"
                type="email"
                value={profile?.businessEmail || ''}
                onChange={(e) => onChange('businessEmail', e.currentTarget.value)}
                disabled={isLoading}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Section B: Company Description */}
          <Box>
            <Text fw={600} size="lg" mb="md">
              Company Description
            </Text>

            <Stack gap="md">
              <TextInput
                label="Short Tagline"
                placeholder="e.g., Fast, reliable recycling for your home & business"
                value={profile?.tagline || ''}
                onChange={(e) => onChange('tagline', e.currentTarget.value.slice(0, 50))}
                disabled={isLoading}
                maxLength={50}
                description={`${(profile?.tagline || '').length}/50 characters`}
              />

              <Textarea
                label="About Your Company"
                placeholder="Tell customers what makes your business special. E.g., We are a family-owned business serving the city for over 20 years..."
                value={profile?.description || ''}
                onChange={(e) => onChange('description', e.currentTarget.value.slice(0, 300))}
                minRows={4}
                disabled={isLoading}
                maxLength={300}
                description={`${(profile?.description || '').length}/300 characters`}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Section C: Service Details */}
          <Box>
            <Text fw={600} size="lg" mb="md">
              Service Details
            </Text>

            <Stack gap="lg">
              {/* Service Areas */}
              <Box>
                <Text fw={500} size="sm" mb="xs">
                  Service Areas
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  Enter postal codes or neighborhood names. Press Enter after each one.
                </Text>

                <Group gap="xs" mb="md">
                  <TextInput
                    placeholder="e.g., 400050 or Andheri West"
                    value={serviceAreaInput}
                    onChange={(e) => setServiceAreaInput(e.currentTarget.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addServiceArea();
                      }
                    }}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  />
                  <Button
                    onClick={addServiceArea}
                    variant="light"
                    disabled={!serviceAreaInput.trim() || isLoading}
                  >
                    Add
                  </Button>
                </Group>

                {(profile?.serviceAreas || []).length > 0 && (
                  <Group gap="xs">
                    {profile.serviceAreas.map((area, idx) => (
                      <Badge
                        key={idx}
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="blue"
                            radius="xl"
                            variant="transparent"
                            onClick={() => removeServiceArea(area)}
                            disabled={isLoading}
                          >
                            <IconX size={10} />
                          </ActionIcon>
                        }
                        variant="filled"
                      >
                        {area}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Box>

              {/* Accepted Waste Materials */}
              <Box>
                <Text fw={500} size="sm" mb="md">
                  Accepted Waste Materials
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
                  {WASTE_MATERIALS.map((material) => (
                    <Checkbox
                      key={material}
                      label={material}
                      checked={(profile?.acceptedWasteTypes || []).includes(material)}
                      onChange={() => toggleWasteMaterial(material)}
                      disabled={isLoading}
                    />
                  ))}
                </SimpleGrid>
              </Box>

              {/* Client Types */}
              <Box>
                <Text fw={500} size="sm" mb="md">
                  Client Types Served
                </Text>

                <Stack gap="sm">
                  {CLIENT_TYPES.map((type) => (
                    <Checkbox
                      key={type.value}
                      label={type.label}
                      checked={(profile?.clientTypes || []).includes(type.value)}
                      onChange={() => toggleClientType(type.value)}
                      disabled={isLoading}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Specialties */}
              <Box>
                <Text fw={500} size="sm" mb="xs">
                  Specialties (Tags)
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  Add special services you offer. E.g., "Bulk Pickups", "E-Waste Specialist"
                </Text>

                <Group gap="xs" mb="md">
                  <TextInput
                    placeholder="e.g., Bulk Pickups"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.currentTarget.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  />
                  <Button
                    onClick={addSpecialty}
                    variant="light"
                    disabled={!specialtyInput.trim() || isLoading}
                  >
                    Add
                  </Button>
                </Group>

                {(profile?.specialties || []).length > 0 && (
                  <Group gap="xs">
                    {profile.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="green"
                            radius="xl"
                            variant="transparent"
                            onClick={() => removeSpecialty(specialty)}
                            disabled={isLoading}
                          >
                            <IconX size={10} />
                          </ActionIcon>
                        }
                        variant="dot"
                        color="green"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Submit Button */}
          <Group justify="flex-end">
            <Button
              type="submit"
              size="lg"
              color="green"
              disabled={isLoading}
              loading={isLoading}
            >
              Save Profile Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default ProfileForm;
