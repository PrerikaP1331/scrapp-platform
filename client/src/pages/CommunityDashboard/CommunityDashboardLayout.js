import React, { useState } from 'react';
import { AppShell, Group, Button, Menu, Avatar, Text, Burger, Box } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CommunitySidebar from './CommunitySidebar';
import styles from './CommunityDashboardLayout.module.css';

function CommunityDashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileOpened, setMobileOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.name || 'Admin';
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
      <AppShell.Header p="md" className={styles.header}>
        <Group justify="space-between" h="100%">
          <Group gap={0}>
            <Burger
              opened={mobileOpened}
              onClick={() => setMobileOpened(!mobileOpened)}
              size="lg"
              color="#344e41"
              hiddenFrom="sm"
            />
            <Text fw={600} size="lg" ml="md" style={{ color: '#344e41' }}>Scrapp Communities</Text>
          </Group>
          
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
              <Menu.Item icon={<IconUser size={14} />} onClick={() => navigate('/community-dashboard/settings')}>
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

      <AppShell.Navbar p="md" className={styles.navbar}>
        <Box onClick={() => setMobileOpened(false)}>
          <CommunitySidebar />
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default CommunityDashboardLayout;
