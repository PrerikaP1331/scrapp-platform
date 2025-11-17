// client/src/components/PublicProfile/ProfilePreviewCard.js
import React from 'react';
import { Paper, Group, Stack, Text, Avatar, Badge, Box, Rating } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';

const ProfilePreviewCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <Paper p="lg" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
      <Stack gap="md">
        <Text fw={600} size="md" c="dimmed">
          PREVIEW: How customers will see your profile
        </Text>

        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'white' }}>
          <Stack gap="md">
            {/* Logo and Name */}
            <Group align="flex-start">
              {profile.businessLogo ? (
                <Avatar
                  src={profile.businessLogo}
                  size={80}
                  radius="md"
                  alt={profile.businessName}
                />
              ) : (
                <Avatar
                  size={80}
                  radius="md"
                  style={{ backgroundColor: '#4ecdc4', color: 'white' }}
                >
                  {profile.businessName?.charAt(0).toUpperCase()}
                </Avatar>
              )}

              <Stack gap={0} style={{ flex: 1 }}>
                <Text fw={600} size="lg">
                  {profile.businessName || 'Business Name'}
                </Text>

                {profile.tagline && (
                  <Text size="sm" c="dimmed" italic>
                    {profile.tagline}
                  </Text>
                )}

                {profile.rating && (
                  <Group gap="xs" mt="xs">
                    <Rating value={profile.rating.averageScore} readOnly size="sm" />
                    <Text size="sm" c="dimmed">
                      {profile.rating.averageScore?.toFixed(1)} ({profile.rating.totalReviews} reviews)
                    </Text>
                  </Group>
                )}
              </Stack>
            </Group>

            {/* Description */}
            {profile.description && (
              <Text size="sm" c="dim" style={{ lineHeight: 1.5 }}>
                {profile.description}
              </Text>
            )}

            {/* Contact Info */}
            <Group gap="md">
              {profile.businessPhone && (
                <Text size="sm">
                  <Text component="span" fw={600}>
                    Phone:
                  </Text>{' '}
                  {profile.businessPhone}
                </Text>
              )}
              {profile.businessEmail && (
                <Text size="sm">
                  <Text component="span" fw={600}>
                    Email:
                  </Text>{' '}
                  {profile.businessEmail}
                </Text>
              )}
            </Group>

            {/* Service Areas */}
            {profile.serviceAreas && profile.serviceAreas.length > 0 && (
              <Box>
                <Group gap="xs" align="flex-start">
                  <IconMapPin size={16} style={{ marginTop: '4px' }} />
                  <Text size="sm">
                    <Text component="span" fw={600}>
                      Service Areas:
                    </Text>{' '}
                    {profile.serviceAreas.join(', ')}
                  </Text>
                </Group>
              </Box>
            )}

            {/* Accepted Materials */}
            {profile.acceptedWasteTypes && profile.acceptedWasteTypes.length > 0 && (
              <Box>
                <Text size="sm" fw={600} mb="xs">
                  Accepted Materials:
                </Text>
                <Group gap="xs">
                  {profile.acceptedWasteTypes.map((material, idx) => (
                    <Badge key={idx} variant="light" size="sm">
                      {material}
                    </Badge>
                  ))}
                </Group>
              </Box>
            )}

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <Box>
                <Text size="sm" fw={600} mb="xs">
                  Specialties:
                </Text>
                <Group gap="xs">
                  {profile.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="dot" size="sm" color="green">
                      {specialty}
                    </Badge>
                  ))}
                </Group>
              </Box>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default ProfilePreviewCard;
