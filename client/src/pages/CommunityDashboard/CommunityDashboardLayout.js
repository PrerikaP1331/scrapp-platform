import React, { useState } from 'react';
import { AppShell, Group, Button, Menu, Avatar, Text, Burger, Box } from '@mantine/core';
import { IconLogout, IconSettings, IconUser, IconRecycle } from '@tabler/icons-react';
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
            <Group gap={8} align="center" style={{ padding: '4px 10px', marginLeft: '12px' }}>
              <Text fw={900} style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#344e41' }}>SCR</Text>
              <IconRecycle size={32} style={{ color: '#588157', margin: '0 -3px' }} />
              <Text fw={900} style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#344e41' }}>PP</Text>
            </Group>
          </Group>
          
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                src={user?.avatar}
                alt={userName}
                radius="xl"
                size="40"
                style={{ cursor: 'pointer', backgroundColor: '#588157' }}
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

      <AppShell.Main className={styles.main}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default CommunityDashboardLayout;
