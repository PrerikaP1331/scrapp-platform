import React, { useContext } from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { IconHome, IconMap, IconCalendar, IconChartBar, IconMessageCircle, IconUser, IconReceipt, IconSettings } from '@tabler/icons-react';
import { AuthContext } from '../../context/AuthContext';

const navLinks = [
  { icon: IconHome, label: 'Dashboard', href: '/recycler/dashboard' },
  { icon: IconMap, label: "Today's Route", href: '/recycler/route' },
  { icon: IconCalendar, label: 'Schedule & History', href: '/recycler/schedule' },
  { icon: IconChartBar, label: 'Business Analytics', href: '/recycler/analytics' },
  { icon: IconMessageCircle, label: 'Customer Communication', href: '/recycler/messages' },
  { icon: IconUser, label: 'Public Profile', href: '/recycler/profile' },
  { icon: IconReceipt, label: 'Billing & Subscription', href: '/recycler/billing' },
];

function RecyclerLayout({ children }) {
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
      <AppShell.Header style={{ backgroundColor: '#1a535c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Scrapp Recycler</span>
        </div>
        {/* User Profile Avatar - Top Right */}
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <Avatar
              src={null}
              alt={user?.name}
              color="cyan"
              radius="xl"
              size="md"
              style={{ cursor: 'pointer' }}
            >
              {getInitials()}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={Link} to="/recycler/profile">
              Profile
            </Menu.Item>
            <Menu.Item component={Link} to="/recycler/settings">
              Settings
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: '#0d2b34' }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            component={Link}
            to={link.href}
            label={link.label}
            leftSection={<link.icon size="1rem" stroke={1.5} color="white" />}
            active={location.pathname === link.href}
            style={{ borderRadius: '4px', color: 'white' }}
            variant="filled"
            color="#4ecdc4"
          />
        ))}
        <div style={{ flex: 1 }} />
        <NavLink
          component={Link}
          to="/recycler/settings"
          label="Settings"
          leftSection={<IconSettings size="1rem" stroke={1.5} color="white" />}
          active={location.pathname === '/recycler/settings'}
          style={{ borderRadius: '4px', color: 'white' }}
          variant="filled"
          color="#4ecdc4"
        />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: '#f5f5f5' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default RecyclerLayout;
