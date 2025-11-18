import React, { useContext } from 'react';
import { NavLink, Stack, Divider, Text, Box } from '@mantine/core';
import {
  IconHome,
  IconTruck,
  IconHistory,
  IconLeaf,
  IconUsers,
  IconTicket,
  IconUser,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', icon: IconHome, path: '/dashboard' },
    { label: 'Schedule Pickup', icon: IconTruck, path: '/dashboard/schedule-pickup' },
    { label: 'History', icon: IconHistory, path: '/dashboard/history' },
    { label: 'Impact Created', icon: IconLeaf, path: '/dashboard/impact' },
    { label: 'Communities', icon: IconUsers, path: '/dashboard/communities' },
    { label: 'Coupons', icon: IconTicket, path: '/dashboard/coupons' },
  ];

  const settingsItems = [
    { label: 'Profile', icon: IconUser, path: '/dashboard/profile' },
    { label: 'Settings', icon: IconSettings, path: '/dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box>
      <Stack gap={0}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            icon={<item.icon size={20} stroke={1.5} />}
            onClick={() => navigate(item.path)}
            active={isActive(item.path)}
            color="teal"
            styles={{ label: { fontWeight: 600, fontSize: '1rem' } }}
            style={{
              color: isActive(item.path) ? '#588157' : '#333',
              backgroundColor: isActive(item.path) ? '#e8f5e9' : 'transparent',
              borderRadius: '8px',
              marginBottom: '6px',
              paddingLeft: '12px',
            }}
          />
        ))}
      </Stack>

      <Divider my="lg" />

      <Stack gap={0}>
        {settingsItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            icon={<item.icon size={20} stroke={1.5} />}
            onClick={() => navigate(item.path)}
            active={isActive(item.path)}
            color="teal"
            styles={{ label: { fontWeight: 600, fontSize: '1rem' } }}
            style={{
              color: isActive(item.path) ? '#588157' : '#333',
              backgroundColor: isActive(item.path) ? '#e8f5e9' : 'transparent',
              borderRadius: '8px',
              marginBottom: '6px',
              paddingLeft: '12px',
            }}
          />
        ))}
        <NavLink
          label="Logout"
          icon={<IconLogout size={20} stroke={1.5} />}
          onClick={() => { logout(); navigate('/login'); }}
          color="red"
          styles={{ label: { fontWeight: 600, fontSize: '1rem' } }}
          style={{
            color: '#b00020',
            borderRadius: '8px',
            marginTop: '8px',
            paddingLeft: '12px',
          }}
        />
      </Stack>
    </Box>
  );
}

export default DashboardSidebar;
