// /client/src/pages/LoginPage/LoginPage.js (Updated with logic)
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/axios';
import styles from './LoginPage.module.css';

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
      // Send data to the backend
      const response = await apiClient.post('/auth/login', values);

      // Assuming the backend sends back a token
      const { token } = response.data;

      // Use the login function from our context
      // For now, we pass null for user data and just the token
      login(null, token);

      // Show success notification
      notifications.show({
        title: 'Login Successful',
        message: 'Welcome back!',
        color: 'green',
      });

      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (error) {
      // Show error notification
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
      <Container size={420} className={styles.formContainer}>
        <Paper withBorder shadow="md" p={30} radius="md" style={{ backgroundColor: 'rgba(218, 215, 205, 0.9)' }}>
          <Title ta="center" style={{ color: '#3a5a40' }}>
            Login
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps('email')}
              mt="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
              mt="md"
            />
            <Text size="sm" ta="right" mt={5}>
                <Anchor href="#" size="sm" style={{ color: '#3a5a40' }}>
                    Forgot password?
                </Anchor>
            </Text>
            <Button fullWidth mt="xl" type="submit" style={{ backgroundColor: '#588157' }}>
              Let's recycle!
            </Button>
          </form>
          <Text c="dimmed" size="sm" ta="center" mt={20}>
            Do not have an account?{' '}
            <Anchor component={Link} to="/signup/select-role" size="sm" style={{ color: '#588157' }}>
              Sign Up
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </div>
  );
}

export default LoginPage;