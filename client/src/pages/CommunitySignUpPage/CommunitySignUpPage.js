// /client/src/pages/CommunitySignUpPage/CommunitySignUpPage.js (Corrected)

import React, { useContext } from 'react';
import { Button, Title, Checkbox, Grid, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { IconBuildingCommunity } from '@tabler/icons-react';
import apiClient from '../../api/axios';

// Import Layouts and Components
import RegistrationLayout from '../../layouts/RegistrationLayout/RegistrationLayout';
import RoleBenefitCard from '../../components/RoleBenefitCard/RoleBenefitCard';
import PersonalInformation from '../../components/formSections/PersonalInformation';
import AccountSecurity from '../../components/formSections/AccountSecurity';
import CommunityDetails from '../../components/formSections/CommunityDetails';

function CommunitySignUpPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const form = useForm({
    initialValues: {
      // Admin Info
      name: '', email: '', phone: '',
      // Community Details
      communityName: '', communityType: '', householdCount: '',
      addressLine1: '', addressLine2: '', city: '', postalCode: '', state: '',
      // Security
      password: '', confirmPassword: '', terms: false,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Full name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\d{10,}$/.test(value) ? null : 'Phone number must be at least 10 digits'),
      communityName: (value) => (value.trim().length > 0 ? null : 'Community name is required'),
      communityType: (value) => (value ? null : 'Please select a community type'),
      householdCount: (value) => (value ? null : 'Please select a household count'),
      addressLine1: (value) => (value.trim().length > 0 ? null : 'Address Line 1 is required'),
      city: (value) => (value.trim().length > 0 ? null : 'City is required'),
      postalCode: (value) => (value.trim().length > 0 ? null : 'Postal/ZIP code is required'),
      state: (value) => (value.trim().length > 0 ? null : 'State/Province is required'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords do not match'),
      terms: (value) => (value ? null : 'You must agree to the terms'),
    },
  });

  const handleSubmit = async (values) => {
    const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        communityName: values.communityName,
        communityType: values.communityType,
        householdCount: values.householdCount,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postalCode: values.postalCode,
        state: values.state,
    };

    try {
        // THIS LINE IS THE FIX: The URL is now correct.
        const response = await apiClient.post('/communities/register', payload);
        const { token, user } = response.data;

        login(user, token);

        notifications.show({
          title: 'Community Registration Successful',
          message: 'Welcome! Your community is now registered. Redirecting to login...',
          color: 'green',
        });
        
        navigate('/login');

    } catch (error) {
        notifications.show({
          title: 'Registration Failed',
          message: error.response?.data?.msg || 'An unknown error occurred.',
          color: 'red',
        });
        console.error("Community Registration Error:", error.response);
    }
  };

  const benefitCard = (
    <RoleBenefitCard
      icon={<IconBuildingCommunity size={48} color="#a3b18a" />}
      title="Community Account"
      description="Empower your residents and build a greener neighborhood together."
      features={[
        "Organize large-scale recycling drives",
        "Track your community's collective impact",
        "Manage resident participation easily",
        "Access detailed sustainability reports"
      ]}
    />
  );

  const registrationForm = (
    <Box p={30}>
      <Title order={3} style={{ color: '#3a5a40' }}>Register Your Community</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mt="xl" gutter="md">
          <PersonalInformation form={form} />
          <CommunityDetails form={form} />
          <AccountSecurity form={form} />
          <Grid.Col span={12}><Checkbox mt="md" label="I agree to the Scrapp Terms of Service and Privacy Policy." {...form.getInputProps('terms', { type: 'checkbox' })} /></Grid.Col>
          <Grid.Col span={12}><Button fullWidth mt="xl" type="submit" style={{ backgroundColor: '#588157' }}>Register Our Community</Button></Grid.Col>
        </Grid>
      </form>
    </Box>
  );

  return <RegistrationLayout benefitCard={benefitCard} form={registrationForm} />;
}

export default CommunitySignUpPage;