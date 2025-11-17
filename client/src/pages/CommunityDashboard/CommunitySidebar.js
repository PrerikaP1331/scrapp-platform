import React from 'react';
import { NavLink, Stack, Divider, Box } from '@mantine/core';
import {
  IconHome,
  IconTruck,
  IconRecycle,
  IconUsers,
  IconTrendingUp,
  IconCreditCard,
  IconSettings,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

function CommunitySidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: IconHome, path: '/community-dashboard' },
    { label: 'Schedule Pickup', icon: IconTruck, path: '/community-dashboard/schedule' },
    { label: 'Drive Management', icon: IconRecycle, path: '/community-dashboard/drives' },
    { label: 'Manage Residents', icon: IconUsers, path: '/community-dashboard/members' },
    { label: 'Impact Report', icon: IconTrendingUp, path: '/community-dashboard/report' },
    { label: 'Billing', icon: IconCreditCard, path: '/community-dashboard/billing' },
  ];

  const settingsItems = [
    { label: 'Settings', icon: IconSettings, path: '/community-dashboard/settings' },
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
            style={{
              color: isActive(item.path) ? '#588157' : '#666',
              backgroundColor: isActive(item.path) ? '#e8f5e9' : 'transparent',
              borderRadius: '8px',
              marginBottom: '4px',
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
            style={{
              color: isActive(item.path) ? '#588157' : '#666',
              backgroundColor: isActive(item.path) ? '#e8f5e9' : 'transparent',
              borderRadius: '8px',
              marginBottom: '4px',
              paddingLeft: '12px',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default CommunitySidebar;
