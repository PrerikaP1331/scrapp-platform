import React from 'react';
import { NavLink, Stack, Divider, Box } from '@mantine/core';
import {
  IconHome,
  IconTruck,
  IconTarget,
  IconUsers,
  IconTrendingUp,
  IconLeaf,
  IconCreditCard,
  IconSettings,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

function OrganizationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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

export default OrganizationSidebar;
