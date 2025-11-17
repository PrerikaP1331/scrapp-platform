// /client/src/pages/CommunitySignUpPage/CommunitySignUpPage.js (Corrected)

import React, { useContext } from 'react';
import { Button, Title, Checkbox, Grid, Box, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { IconBuildingCommunity, IconCheck, IconSparkles, IconRecycle } from '@tabler/icons-react';
import apiClient from '../../api/axios';
import styles from './CommunitySignUpPage.module.css';

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

  const benefits = [
    "Organize large-scale recycling drives",
    "Track your community's collective impact",
    "Manage resident participation easily",
    "Access detailed sustainability reports"
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
                <IconBuildingCommunity size={48} />
              </div>
              <Title order={2} className={styles.benefitTitle} mt="lg">Community Account</Title>
              <Text className={styles.benefitDescription} mt="md" size="lg">
                Empower your residents and build a greener neighborhood together.
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
                  <span>Join 50+ communities</span>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper className={styles.formCard} p="xl" radius="lg">
              <Title order={2} className={styles.formTitle}>Register Your Community</Title>
              <Text className={styles.formSubtitle} mt="xs">Enable sustainable living for your residents</Text>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className={styles.formSection}>
                  <PersonalInformation form={form} inputClassNames={inputClassNames} />
                </div>
                <div className={styles.formSection}>
                  <CommunityDetails form={form} inputClassNames={inputClassNames} sectionTitleClass={sectionTitleClass} />
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
                  Register Our Community
                </Button>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default CommunitySignUpPage;