import React, { useContext } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Anchor,
  Divider,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import { IconMail, IconLock, IconRecycle, IconArrowRight } from '@tabler/icons-react';
import apiClient from '../../api/axios';
import styles from './LoginPage.module.css';

const palette = {
  linen: '#dad7cd',
  sage: '#a3b18a',
  fern: '#588157',
  pine: '#3a5a40',
  forest: '#344e41',
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password cannot be empty' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await apiClient.post('/auth/login', values);
      const { token } = response.data;

      login(null, token);

      notifications.show({
        title: 'Login Successful',
        message: 'Welcome back!',
        color: 'green',
      });

      navigate('/dashboard');

    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: error.response?.data?.msg || 'An unknown error occurred.',
        color: 'red',
      });
      console.error('Login error:', error.response);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} />
      
      <Container size={480} className={styles.formContainer}>
        {/* Logo */}
        <Box className={styles.logoWrapper}>
          <Link to="/landing" className={styles.logoLink}>
            <div className={styles.logo}>
              <span>SCR</span>
              <IconRecycle 
                size={32} 
                style={{ 
                  color: palette.fern,
                  margin: '0 -2px',
                  strokeWidth: 2.5
                }} 
              />
              <span>PP</span>
            </div>
          </Link>
        </Box>

        <Paper className={styles.formCard} p={40} radius="lg">
          <Title order={2} className={styles.title}>
            Login
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Box mt="xl">
              <TextInput
                label="Email Address"
                placeholder="your@email.com"
                leftSection={<IconMail size={18} />}
                required
                classNames={{
                  input: styles.input,
                  label: styles.label
                }}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<IconLock size={18} />}
                required
                mt="md"
                classNames={{
                  input: styles.input,
                  label: styles.label
                }}
                {...form.getInputProps('password')}
              />

              <Text size="sm" ta="right" mt="xs">
                <Anchor href="#" size="sm" className={styles.forgotLink}>
                  Forgot password?
                </Anchor>
              </Text>

              <Button 
                fullWidth 
                size="lg" 
                mt="xl" 
                type="submit" 
                className={styles.submitButton}
                rightSection={<IconArrowRight size={18} />}
              >
                Login
              </Button>
            </Box>
          </form>

          <Divider 
            label="or" 
            labelPosition="center" 
            my="xl" 
            classNames={{ label: styles.dividerLabel }}
          />

          <Text className={styles.signupText} ta="center">
            Don't have an account?{' '}
            <Anchor component={Link} to="/signup/select-role" className={styles.signupLink}>
              Sign Up
            </Anchor>
          </Text>

          <Box mt="lg" className={styles.benefitsBox}>
            <Text size="xs" className={styles.benefitsText}>
              🌱 Track your impact • 🎁 Earn rewards • ♻️ Save the planet
            </Text>
          </Box>
        </Paper>

        <Text ta="center" mt="md" size="sm" className={styles.backLink}>
          <Anchor component={Link} to="/" className={styles.backToHome}>
            ← Back to home
          </Anchor>
        </Text>
      </Container>
    </div>
  );
}

export default LoginPage;