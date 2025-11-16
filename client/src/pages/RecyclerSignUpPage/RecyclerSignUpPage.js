// /client/src/pages/RecyclerSignUpPage/RecyclerSignUpPage.js
import React from 'react';
import { Button, Title, Checkbox, Grid, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconRecycle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/axios';
//Import Layouts and Components

import RegistrationLayout from '../../layouts/RegistrationLayout/RegistrationLayout';
import RoleBenefitCard from '../../components/RoleBenefitCard/RoleBenefitCard';
import PersonalInformation from '../../components/formSections/PersonalInformation';
import AccountSecurity from '../../components/formSections/AccountSecurity';
import BusinessDetails from '../../components/formSections/BusinessDetails';
import ServiceDetails from '../../components/formSections/ServiceDetails';

function RecyclerSignUpPage() {
  const form = useForm({
    initialValues: {
      name: '', email: '', phone: '',
      businessName: '',
      addressLine1: '', addressLine2: '', city: '', postalCode: '', state: '',
      serviceAreas: '',
      acceptedWasteTypes: [],
      password: '', confirmPassword: '', terms: false,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Contact person\'s name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid business email'),
      businessName: (value) => (value.trim().length > 0 ? null : 'Business name is required'),
      serviceAreas: (value) => (value.trim().length > 0 ? null : 'Service areas are required'),
      acceptedWasteTypes: (value) => (value.length > 0 ? null : 'Must select at least one waste type'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords do not match'),
      terms: (value) => (value ? null : 'You must agree to the terms'),
    },
  });

const navigate = useNavigate();
const { login } = useContext(AuthContext);

const handleSubmit = async (values) => {
  // The payload structure must match what the backend controller expects
    const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        businessName: values.businessName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postalCode: values.postalCode,
        state: values.state,
        serviceAreas: values.serviceAreas,
        acceptedWasteTypes: values.acceptedWasteTypes,
    };

    try {
        const response = await apiClient.post('/recyclers/register', payload);
        const { token } = response.data;

        login(null, token);

        notifications.show({
        title: 'Registration Successful',
        message: 'Welcome, Partner! Your account has been created.',
        color: 'green',
        });
        
        navigate('/dashboard');

    } catch (error) {
        notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.msg || 'An unknown error occurred.',
        color: 'red',
        });
    }
    };

  const benefitCard = (
    <RoleBenefitCard
      icon={<IconRecycle size={48} color="#a3b18a" />}
      title="Recycling Partner"
      description="Grow your business with a steady stream of customers and optimized logistics."
      features={[
        "Receive new pickup requests daily",
        "Optimize your collection routes",
        "Access business analytics",
        "Become a verified partner in our ecosystem"
      ]}
    />
  );

  const registrationForm = (
    <Box p={30}>
      <Title order={3} style={{ color: '#3a5a40' }}>Join Scrapp as a Recycling Partner</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mt="xl" gutter="md">
          <PersonalInformation form={form} />
          <BusinessDetails form={form} />
          <ServiceDetails form={form} />
          <AccountSecurity form={form} />
          <Grid.Col span={12}><Checkbox mt="md" label="I agree to the Scrapp Terms of Service and Privacy Policy." {...form.getInputProps('terms', { type: 'checkbox' })} /></Grid.Col>
          <Grid.Col span={12}><Button fullWidth mt="xl" type="submit" style={{ backgroundColor: '#588157' }}>Become a Partner</Button></Grid.Col>
        </Grid>
      </form>
    </Box>
  );

  return <RegistrationLayout benefitCard={benefitCard} form={registrationForm} />;
}

export default RecyclerSignUpPage;