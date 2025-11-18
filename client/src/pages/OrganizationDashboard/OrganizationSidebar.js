import React, { useContext } from 'react';
import { NavLink, Stack, Divider, Box, Text } from '@mantine/core';
import {
  IconHome,
  IconTruck,
  IconTarget,
  IconUsers,
  IconTrendingUp,
  IconLeaf,
  IconCreditCard,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function OrganizationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', icon: IconHome, path: '/org-dashboard' },
    { label: 'Schedule Pickup', icon: IconTruck, path: '/org-dashboard/schedule' },
    { label: 'Initiatives', icon: IconTarget, path: '/org-dashboard/initiatives' },
    { label: 'Manage Employees', icon: IconUsers, path: '/org-dashboard/members' },
    { label: 'ESG Report', icon: IconTrendingUp, path: '/org-dashboard/report' },
    { label: 'Zero-Waste Program', icon: IconLeaf, path: '/org-dashboard/zero-waste' },
    { label: 'Billing', icon: IconCreditCard, path: '/org-dashboard/billing' },
  ];

  const settingsItems = [
    { label: 'Settings', icon: IconSettings, path: '/org-dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box>
      <Stack gap={0}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={<Text size="md" fw={600} style={{ color: 'inherit' }}>{item.label}</Text>}
            icon={<item.icon size={20} stroke={1.5} color={isActive(item.path) ? '#344e41' : '#3a5a40'} />}
            onClick={() => navigate(item.path)}
            active={isActive(item.path)}
            style={{
              borderRadius: '8px',
              color: isActive(item.path) ? '#344e41' : '#3a5a40',
              backgroundColor: isActive(item.path) ? '#dad7cd' : 'transparent',
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
            label={<Text size="md" fw={600} style={{ color: 'inherit' }}>{item.label}</Text>}
            icon={<item.icon size={20} stroke={1.5} color={isActive(item.path) ? '#344e41' : '#3a5a40'} />}
            onClick={() => navigate(item.path)}
            active={isActive(item.path)}
            style={{
              borderRadius: '8px',
              color: isActive(item.path) ? '#344e41' : '#3a5a40',
              backgroundColor: isActive(item.path) ? '#dad7cd' : 'transparent',
              paddingLeft: '12px',
            }}
          />
        ))}
        <NavLink
          label="Logout"
          icon={<IconLogout size={20} stroke={1.5} />}
          onClick={() => { logout(); navigate('/login'); }}
          color="red"
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

export default OrganizationSidebar;
