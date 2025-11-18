// /client/src/layouts/DashboardLayout/DashboardLayout.js
import React, { useContext } from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { IconHome, IconSend, IconHistory, IconChartPie, IconUsers, IconSettings } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';

const navLinks = [
  { icon: IconHome, label: 'Dashboard', href: '/dashboard' },
  { icon: IconSend, label: 'Schedule Pickup', href: '/dashboard/schedule-pickup' },
  { icon: IconHistory, label: 'History', href: '/dashboard/history' },
  { icon: IconChartPie, label: 'Impact Created', href: '/dashboard/impact' },
  { icon: IconUsers, label: 'Communities', href: '/dashboard/community' },
];

function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header style={{ backgroundColor: '#dad7cd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </div>
        {/* User Profile Avatar with Dropdown Menu - Top Right */}
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <Avatar
              src={null}
              alt={user?.name}
              color="green"
              radius="xl"
              size="md"
              style={{ cursor: 'pointer' }}
            >
              {getInitials()}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={Link} to="/dashboard/profile">
              Profile
            </Menu.Item>
            <Menu.Item component={Link} to="/dashboard/settings">
              Settings
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: '#344e41' }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            component={Link}
            to={link.href}
            label={link.label}
            leftSection={<link.icon size="1rem" stroke={1.5} />}
            active={location.pathname === link.href}
            style={{ borderRadius: '4px' }}
            variant="filled"
            color="#588157" // This is our accent green
          />
        ))}
        <div style={{ flex: 1 }} />
        <NavLink
          component={Link}
          to="/dashboard/settings"
          label="Settings"
          leftSection={<IconSettings size="1rem" stroke={1.5} />}
          active={location.pathname === '/dashboard/settings'}
          style={{ borderRadius: '4px' }}
          variant="filled"
          color="#588157"
        />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: '#f0ede6' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;