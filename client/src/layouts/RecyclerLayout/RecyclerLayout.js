import React, { useContext } from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { IconHome, IconMap, IconCalendar, IconChartBar, IconMessageCircle, IconUser, IconReceipt, IconSettings, IconRecycle } from '@tabler/icons-react';
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
      <AppShell.Header style={{ backgroundColor: '#dad7cd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.5rem', paddingLeft: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#344e41' }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap={8} align="center" style={{ padding: '4px 10px', marginLeft: '12px' }}>
            <Text fw={900} style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#344e41' }}>SCR</Text>
            <IconRecycle size={32} style={{ color: '#588157', margin: '0 -3px', strokeWidth: 2.5 }} />
            <Text fw={900} style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#344e41' }}>PP</Text>
          </Group>
        </div>
        {/* User Profile Avatar - Top Right */}
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <Avatar
              src={null}
              alt={user?.name}
              radius="xl"
              size="md"
              style={{ backgroundColor: '#a3b18a', color: '#344e41', cursor: 'pointer' }}
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

      <AppShell.Navbar p="md" style={{ backgroundColor: '#ecebe5' }}>
        {navLinks.map((link) => {
          const active = location.pathname === link.href;
          return (
            <NavLink
              key={link.label}
              component={Link}
              to={link.href}
              label={<Text size="md" fw={600} style={{ color: 'inherit' }}>{link.label}</Text>}
              leftSection={<link.icon size="1rem" stroke={1.5} color={active ? '#344e41' : '#3a5a40'} />}
              active={active}
              style={{
                borderRadius: '8px',
                color: active ? '#344e41' : '#3a5a40',
                backgroundColor: active ? '#dad7cd' : 'transparent',
                marginBottom: '6px',
                paddingLeft: '12px'
              }}
            />
          );
        })}
        <div style={{ flex: 1 }} />
        <NavLink
          component={Link}
          to="/recycler/settings"
          label={<Text size="md" fw={600} style={{ color: 'inherit' }}>Settings</Text>}
          leftSection={<IconSettings size="1rem" stroke={1.5} color={location.pathname === '/recycler/settings' ? '#344e41' : '#3a5a40'} />}
          active={location.pathname === '/recycler/settings'}
          style={{
            borderRadius: '8px',
            color: location.pathname === '/recycler/settings' ? '#344e41' : '#3a5a40',
            backgroundColor: location.pathname === '/recycler/settings' ? '#dad7cd' : 'transparent',
            paddingLeft: '12px'
          }}
        />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: '#f6f7f4', overflowY: 'auto' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default RecyclerLayout;
