import React, { useState } from 'react';
import { AppShell, Group, Button, Menu, Avatar, Text, Burger, Box } from '@mantine/core';
import { IconLogout, IconSettings, IconUser, IconRecycle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import styles from './DashboardLayout.module.css';

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileOpened, setMobileOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user name - fallback if not available
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 250, 
        breakpoint: 'sm', 
        collapsed: { mobile: !mobileOpened, desktop: false } 
      }}
      padding="md"
      styles={{
        main: { backgroundColor: '#f8f9fa' }
      }}
    >
      {/* Header */}
      <AppShell.Header p="md" className={styles.header}>
        <Group justify="space-between" h="100%" style={{ width: '100%' }}>
          <Group gap={0}>
            <Burger
              opened={mobileOpened}
              onClick={() => setMobileOpened(!mobileOpened)}
              size="lg"
              color="#344e41"
              hiddenFrom="sm"
            />
            <Group ml="md" gap={0} style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <Text fw={800} style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.03em', color: '#344e41' }}>SCR</Text>
              <IconRecycle size={30} style={{ color: '#588157', margin: '0 -2px' }} />
              <Text fw={800} style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.03em', color: '#344e41' }}>PP</Text>
            </Group>
          </Group>
          
          {/* User Menu - Top Right */}
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                src={user?.avatar}
                alt={userName}
                radius="xl"
                size="40"
                style={{ cursor: 'pointer' }}
                color="teal"
              >
                {userInitial}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled>
                <Text size="sm" fw={500}>{userName}</Text>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<IconUser size={14} />} onClick={() => navigate('/dashboard/profile')}>
                Profile
              </Menu.Item>
              <Menu.Item icon={<IconSettings size={14} />} onClick={() => navigate('/dashboard/settings')}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<IconLogout size={14} />} color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      {/* Sidebar Navigation */}
      <AppShell.Navbar p="md" className={styles.navbar}>
        <Box onClick={() => setMobileOpened(false)}>
          <DashboardSidebar />
        </Box>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
