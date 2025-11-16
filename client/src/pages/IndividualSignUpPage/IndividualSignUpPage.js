// /client/src/pages/IndividualSignUpPage/IndividualSignUpPage.js (Complete Code)

import React, { useContext } from 'react';
import { Button, Title, Checkbox, Grid, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { IconUser } from '@tabler/icons-react';
import apiClient from '../../api/axios';
//import styles from './IndividualSignUpPage.module.css';

// Import our new layout and reusable components
import RegistrationLayout from '../../layouts/RegistrationLayout/RegistrationLayout';
import RoleBenefitCard from '../../components/RoleBenefitCard/RoleBenefitCard';
import PersonalInformation from '../../components/formSections/PersonalInformation';
import AddressInformation from '../../components/formSections/AddressInformation';
import AccountSecurity from '../../components/formSections/AccountSecurity';

function IndividualSignUpPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      state: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Full name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\d{10,}$/.test(value) ? null : 'Phone number must be at least 10 digits'),
      addressLine1: (value) => (value.trim().length > 0 ? null : 'Address Line 1 is required'),
      city: (value) => (value.trim().length > 0 ? null : 'City is required'),
      postalCode: (value) => (value.trim().length > 0 ? null : 'Postal/ZIP code is required'),
      state: (value) => (value.trim().length > 0 ? null : 'State/Province is required'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords do not match'),
      terms: (value) => (value ? null : 'You must agree to the terms and services'),
    },
  });

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: 'individual', // Set role automatically for this form
      address: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postalCode: values.postalCode,
        state: values.state,
      }
    };

    try {
      const response = await apiClient.post('/auth/register', payload);
      const { token } = response.data;
      
      // Use login function from context to set token and navigate
      login(null, token);

      notifications.show({
        title: 'Registration Successful',
        message: 'Welcome to Scrapp! Your account has been created.',
        color: 'green',
      });
      
      navigate('/dashboard');

    } catch (error) {
      notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.msg || 'An unknown error occurred. Please try again.',
        color: 'red',
      });
      console.error("Registration Error:", error.response);
    }
  };

  // Define the content for the left-side benefit card
  const benefitCard = (
    <RoleBenefitCard
      icon={<IconUser size={48} color="#a3b18a" />}
      title="Individual Account"
      description="For personal and household recycling, right from your doorstep."
      features={[
        "Schedule pickups at your convenience",
        "Track your environmental impact in real-time",
        "Earn rewards and coupons for recycling",
        "Join your local community hub to share and connect"
      ]}
    />
  );

  // Define the content for the right-side form
  const registrationForm = (
    <Box p={30}>
      <Title order={3} style={{ color: '#3a5a40' }}>Signup</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mt="xl" gutter="md">
          {/* Use the reusable components */}
          <PersonalInformation form={form} />
          <AddressInformation form={form} title="Default Pickup Address" />
          <AccountSecurity form={form} />

          {/* Final Step */}
          <Grid.Col span={12}>
            <Checkbox
              mt="md"
              label="I agree to the Scrapp Terms of Service and Privacy Policy."
              {...form.getInputProps('terms', { type: 'checkbox' })}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button fullWidth mt="xl" type="submit" style={{ backgroundColor: '#588157' }}>
              Create Account
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );

  return (
    <RegistrationLayout
      benefitCard={benefitCard}
      form={registrationForm}
    />
  );
}

export default IndividualSignUpPage;
