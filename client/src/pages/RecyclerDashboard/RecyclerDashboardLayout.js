import React from 'react';
import { AppShell, Burger, Group, Text, Avatar, Menu } from '@mantine/core';
import styles from './RecyclerDashboardLayout.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecyclerSidebar from './RecyclerSidebar';

function RecyclerDashboardLayout({ children }) {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className={styles.header}>
        <Group justify="space-between" style={{ height: '100%', padding: '0 16px' }}>
          <Group>
            <Burger opened={opened} onClick={() => setOpened(!opened)} hiddenFrom="sm" size="sm" />
            <Text fw={700} size="lg" style={{ color: '#ffffff' }}>Scrapp Recyclers</Text>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar style={{ cursor: 'pointer', backgroundColor: '#588157' }} radius="xl">
                R
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate('/recycler-dashboard/profile')}>My Profile</Menu.Item>
              <Menu.Item onClick={() => navigate('/recycler-dashboard/settings')}>Settings</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={styles.navbar}>
        <RecyclerSidebar />
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default RecyclerDashboardLayout;
