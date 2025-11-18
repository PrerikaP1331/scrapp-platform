import React, { useContext } from 'react';
import { Button, Title, Text, Checkbox, Grid, Box, Paper, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { IconUser, IconMail, IconPhone, IconMapPin, IconLock, IconSparkles, IconCheck, IconRecycle } from '@tabler/icons-react';
import apiClient from '../../api/axios';
import styles from './IndividualSignUpPage.module.css';

const palette = {
  linen: '#dad7cd',
  sage: '#a3b18a',
  fern: '#588157',
  pine: '#3a5a40',
  forest: '#344e41',
};

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
      role: 'individual',
      address: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        postalCode: values.postalCode,
        state: values.state,
      }
    };

    console.log('Signup payload being sent:', payload);
    console.log('Address in payload:', payload.address);

    try {
      const response = await apiClient.post('/auth/register', payload);
      console.log('Signup response:', response.data);
      const { token, user } = response.data;
      
      login(user, token);

      notifications.show({
        title: 'Registration Successful',
        message: 'Welcome to Scrapp! Your account has been created. Redirecting to login...',
        color: 'green',
      });
      
      navigate('/login');

    } catch (error) {
      notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.msg || 'An unknown error occurred. Please try again.',
        color: 'red',
      });
      console.error("Registration Error:", error.response);
    }
  };

  const benefits = [
    "Schedule pickups at your convenience",
    "Track your environmental impact in real-time",
    "Earn rewards and coupons for recycling",
    "Join your local community hub"
  ];

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
          {/* Left Side - Benefits Card */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper className={styles.benefitCard} p="xl" radius="lg">
              <div className={styles.benefitIconWrapper}>
                <IconUser size={48} stroke={1.5} />
              </div>
              
              <Title order={2} className={styles.benefitTitle} mt="lg">
                Individual Account
              </Title>
              
              <Text className={styles.benefitDescription} mt="md" size="lg">
                For personal and household recycling, right from your doorstep.
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
                  <span>Join 415+ households</span>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          {/* Right Side - Registration Form */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper className={styles.formCard} p="xl" radius="lg">
              <Title order={2} className={styles.formTitle}>
                Create Your Account
              </Title>
              <Text className={styles.formSubtitle} mt="xs">
                Start your sustainable journey today
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className={styles.formSection}>
                  <Title order={4} className={styles.sectionTitle}>
                    Personal Information
                  </Title>
                  
                  <TextInput
                    label="Full Name"
                    placeholder="John Doe"
                    leftSection={<IconUser size={18} />}
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('name')}
                  />

                  <Grid gutter="md" mt="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Email Address"
                        placeholder="john@example.com"
                        leftSection={<IconMail size={18} />}
                        classNames={{
                          input: styles.input,
                          label: styles.label
                        }}
                        {...form.getInputProps('email')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Phone Number"
                        placeholder="9876543210"
                        leftSection={<IconPhone size={18} />}
                        classNames={{
                          input: styles.input,
                          label: styles.label
                        }}
                        {...form.getInputProps('phone')}
                      />
                    </Grid.Col>
                  </Grid>
                </div>

                <div className={styles.formSection}>
                  <Title order={4} className={styles.sectionTitle}>
                    Default Pickup Address
                  </Title>
                  
                  <TextInput
                    label="Address Line 1"
                    placeholder="123 Main Street"
                    leftSection={<IconMapPin size={18} />}
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('addressLine1')}
                  />

                  <TextInput
                    label="Address Line 2 (Optional)"
                    placeholder="Apt 4B"
                    leftSection={<IconMapPin size={18} />}
                    mt="md"
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('addressLine2')}
                  />

                  <Grid gutter="md" mt="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="City"
                        placeholder="Bangalore"
                        classNames={{
                          input: styles.input,
                          label: styles.label
                        }}
                        {...form.getInputProps('city')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="State/Province"
                        placeholder="Karnataka"
                        classNames={{
                          input: styles.input,
                          label: styles.label
                        }}
                        {...form.getInputProps('state')}
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Postal/ZIP Code"
                    placeholder="560001"
                    mt="md"
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('postalCode')}
                  />
                </div>

                <div className={styles.formSection}>
                  <Title order={4} className={styles.sectionTitle}>
                    Account Security
                  </Title>
                  
                  <PasswordInput
                    label="Password"
                    placeholder="At least 8 characters"
                    leftSection={<IconLock size={18} />}
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('password')}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    leftSection={<IconLock size={18} />}
                    mt="md"
                    classNames={{
                      input: styles.input,
                      label: styles.label
                    }}
                    {...form.getInputProps('confirmPassword')}
                  />
                </div>

                <Checkbox
                  mt="xl"
                  label={
                    <Text size="sm" className={styles.checkboxLabel}>
                      I agree to the <Link to="/terms" className={styles.link}>Terms of Service</Link> and <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
                    </Text>
                  }
                  classNames={{
                    input: styles.checkbox
                  }}
                  {...form.getInputProps('terms', { type: 'checkbox' })}
                />

                <Button 
                  fullWidth 
                  size="lg" 
                  mt="xl" 
                  type="submit" 
                  className={styles.submitButton}
                >
                  Create Account
                </Button>

                <Text ta="center" mt="lg" size="sm" className={styles.loginText}>
                  Already have an account? <Link to="/login" className={styles.link}>Login here</Link>
                </Text>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default IndividualSignUpPage;