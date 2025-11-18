// /client/src/pages/RecyclerSignUpPage/RecyclerSignUpPage.js
import React from 'react';
import { Button, Title, Checkbox, Grid, Box, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconRecycle, IconCheck, IconSparkles } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/axios';
import styles from './RecyclerSignUpPage.module.css';

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
        const { token, user } = response.data;

        login(user, token);

        notifications.show({
        title: 'Registration Successful',
        message: 'Welcome, Partner! Your account has been created. Redirecting to login...',
        color: 'green',
        });
        
        navigate('/login');

    } catch (error) {
        notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.msg || 'An unknown error occurred.',
        color: 'red',
        });
    }
    };

  const benefits = [
    "Receive new pickup requests daily",
    "Optimize your collection routes",
    "Access business analytics",
    "Become a verified partner in our ecosystem"
  ];

  const inputClassNames = { input: styles.input, label: styles.label };
  const sectionTitleClass = styles.sectionTitle;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <Link to="/landing" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#344e41', textShadow: '0 2px 8px rgba(88,129,87,0.15)' }}>
              <span>SCR</span>
              <IconRecycle size={32} style={{ color: '#588157', margin: '0 -2px', strokeWidth: 2.5 }} />
              <span>PP</span>
            </div>
          </Link>
        </div>

        <Grid gutter="xl" align="stretch">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper className={styles.benefitCard} p="xl" radius="lg">
              <div className={styles.benefitIconWrapper}>
                <IconRecycle size={48} />
              </div>
              <Title order={2} className={styles.benefitTitle} mt="lg">Recycling Partner</Title>
              <Text className={styles.benefitDescription} mt="md" size="lg">
                Grow your business with a steady stream of customers and optimized logistics.
              </Text>
              <div className={styles.benefitsList} style={{ marginTop: '32px' }}>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className={styles.benefitItem}>
                    <div className={styles.checkIconWrapper}>
                      <IconCheck size={20} stroke={2.5} />
                    </div>
                    <Text className={styles.benefitText}>{benefit}</Text>
                  </div>
                ))}
              </div>
              <div className={styles.badgeWrapper}>
                <div className={styles.badge}>
                  <IconSparkles size={16} />
                  <span>Verified partners network</span>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper className={styles.formCard} p="xl" radius="lg">
              <Title order={2} className={styles.formTitle}>Join Scrapp as a Recycling Partner</Title>
              <Text className={styles.formSubtitle} mt="xs">Connect with customers and scale sustainably</Text>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className={styles.formSection}>
                  <PersonalInformation form={form} inputClassNames={inputClassNames} />
                </div>
                <div className={styles.formSection}>
                  <BusinessDetails form={form} inputClassNames={inputClassNames} sectionTitleClass={sectionTitleClass} />
                </div>
                <div className={styles.formSection}>
                  <ServiceDetails form={form} inputClassNames={inputClassNames} sectionTitleClass={sectionTitleClass} />
                </div>
                <div className={styles.formSection}>
                  <AccountSecurity form={form} inputClassNames={inputClassNames} sectionTitleClass={sectionTitleClass} />
                </div>

                <Checkbox
                  mt="xl"
                  label={<Text size="sm" className={styles.checkboxLabel}>I agree to the Scrapp Terms of Service and Privacy Policy.</Text>}
                  classNames={{ input: styles.checkbox }}
                  {...form.getInputProps('terms', { type: 'checkbox' })}
                />

                <Button fullWidth size="lg" mt="xl" type="submit" className={styles.submitButton}>
                  Become a Partner
                </Button>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default RecyclerSignUpPage;