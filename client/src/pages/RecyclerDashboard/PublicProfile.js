import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Stack,
  Alert,
  Loader,
  Center,
  Grid,
  Box
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/publicProfileService';
import ProfilePreviewCard from '../../components/PublicProfile/ProfilePreviewCard';
import ProfileForm from '../../components/PublicProfile/ProfileForm';

function PublicProfile() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const recyclerId = user?.recyclerProfileId || user?.id;

  // Fetch profile
  useEffect(() => {
    if (!recyclerId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProfile(recyclerId);
        setProfile(data);
        setOriginalProfile(JSON.parse(JSON.stringify(data)));
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(
          err.response?.data?.msg ||
          'Failed to load profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [recyclerId]);

  const handleFieldChange = (field, value) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);

    // Check if there are changes
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(originalProfile));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await updateProfile(recyclerId, profile);
      setOriginalProfile(JSON.parse(JSON.stringify(profile)));
      setHasChanges(false);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.msg ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Page Title */}
        <Box>
          <h1 style={{ color: '#344e41' }}>Manage Your Public Profile</h1>
          <p style={{ color: '#3a5a40', marginTop: '8px' }}>
            Update your business information that's visible to customers on the Scrapp platform
          </p>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert
            icon={<IconCheck size={16} />}
            color="#588157"
            title="Success"
            withCloseButton
            onClose={() => setSuccess(false)}
          >
            Your public profile has been updated successfully!
          </Alert>
        )}

        {/* Main Content */}
        {profile && (
          <Grid gutter="lg">
            {/* Preview Card - Right side */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Box style={{ position: 'sticky', top: 20 }}>
                <ProfilePreviewCard profile={profile} />
              </Box>
            </Grid.Col>

            {/* Form - Left side */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <ProfileForm
                profile={profile}
                onChange={handleFieldChange}
                onSubmit={handleSubmit}
                isLoading={submitting}
              />
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}

export default PublicProfile;
