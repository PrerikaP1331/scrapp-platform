import React, { useContext } from 'react';
import { NavLink, Stack, Divider, Box } from '@mantine/core';
import {
  IconHome,
  IconMapPin,
  IconCalendar,
  IconTrendingUp,
  IconUsers,
  IconWorld,
  IconCreditCard,
  IconLogout,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function RecyclerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', icon: IconHome, path: '/recycler-dashboard' },
    { label: "Today's Route", icon: IconMapPin, path: '/recycler-dashboard/route' },
    { label: 'Schedule & History', icon: IconCalendar, path: '/recycler-dashboard/schedule' },
    { label: 'Analytics', icon: IconTrendingUp, path: '/recycler-dashboard/analytics' },
    { label: 'Customers', icon: IconUsers, path: '/recycler-dashboard/customers' },
    { label: 'Public Profile', icon: IconWorld, path: '/recycler-dashboard/profile' },
    { label: 'Billing', icon: IconCreditCard, path: '/recycler-dashboard/billing' },
  ];

  const settingsItems = [];

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
            color="#588157"
            style={{
              color: isActive(item.path) ? '#344e41' : '#3a5a40',
              backgroundColor: isActive(item.path) ? '#dad7cd' : 'transparent',
              borderRadius: '8px',
              marginBottom: '4px',
              paddingLeft: '12px',
            }}
          />
        ))}
      </Stack>

      <Divider my="lg" />

      <Stack gap={0}>
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

export default RecyclerSidebar;
