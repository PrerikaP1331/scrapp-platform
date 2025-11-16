// /client/src/pages/CorporateSignUpPage/CorporateSignUpPage.js
import React from 'react';
import { Button, Title, Checkbox, Grid, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconBuildingFactory2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/axios';

import RegistrationLayout from '../../layouts/RegistrationLayout/RegistrationLayout';
import RoleBenefitCard from '../../components/RoleBenefitCard/RoleBenefitCard';
import AccountSecurity from '../../components/formSections/AccountSecurity';
import ContactPersonInformation from '../../components/formSections/ContactPersonInformation';
import OrganisationalDetails from '../../components/formSections/OrganisationalDetails';

function CorporateSignUpPage() {
  const form = useForm({
    initialValues: {
      name: '', email: '', phone: '', roleTitle: '',
      orgName: '', orgType: '', employeeCount: '',
      addressLine1: '', addressLine2: '', city: '', postalCode: '', state: '',
      password: '', confirmPassword: '', terms: false,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Full name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      orgName: (value) => (value.trim().length > 0 ? null : 'Organization name is required'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords do not match'),
      terms: (value) => (value ? null : 'You must agree to the terms'),
    },
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (values) => {
        const payload = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            roleTitle: values.roleTitle,
            password: values.password,
            orgName: values.orgName,
            orgType: values.orgType,
            employeeCount: values.employeeCount,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            postalCode: values.postalCode,
            state: values.state,
        };

        try {
            const response = await apiClient.post('/organisations/register', payload);
            const { token } = response.data;

            login(null, token);

            notifications.show({
            title: 'Organization Registration Successful',
            message: 'Welcome! Your organization is now registered on Scrapp.',
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
      icon={<IconBuildingFactory2 size={48} color="#a3b18a" />}
      title="Corporate Account"
      description="Streamline waste management and meet your sustainability goals."
      features={[
        "Schedule bulk and recurring pickups",
        "Manage employee participation",
        "Generate data for ESG reports",
        "Access specialized recycling partners"
      ]}
    />
  );

  const registrationForm = (
    <Box p={30}>
      <Title order={3} style={{ color: '#3a5a40' }}>Register Your Organization</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mt="xl" gutter="md">
          <ContactPersonInformation form={form} />
          <OrganisationalDetails form={form} />
          <AccountSecurity form={form} />
          <Grid.Col span={12}><Checkbox mt="md" label="I agree to the Scrapp Terms of Service and Privacy Policy." {...form.getInputProps('terms', { type: 'checkbox' })} /></Grid.Col>
          <Grid.Col span={12}><Button fullWidth mt="xl" type="submit" style={{ backgroundColor: '#588157' }}>Register My Organization</Button></Grid.Col>
        </Grid>
      </form>
    </Box>
  );

  return <RegistrationLayout benefitCard={benefitCard} form={registrationForm} />;
}

export default CorporateSignUpPage;