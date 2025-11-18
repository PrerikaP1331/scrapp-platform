import React, { useState } from "react";
import {
  AppShell,
  Group,
  Button,
  Menu,
  Avatar,
  Text,
  Burger,
  Box,
} from "@mantine/core";
import { IconLogout, IconSettings, IconUser, IconRecycle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import OrganizationSidebar from "./OrganizationSidebar";
import styles from "./OrganizationDashboardLayout.module.css";

function OrganizationDashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileOpened, setMobileOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header p="md" className={styles.header}>
        <Group h="100%" style={{ width: '100%' }}>
          <Group gap="md">
            <Burger
              opened={mobileOpened}
              onClick={() => setMobileOpened(!mobileOpened)}
              size="lg"
              color="#ffffff"
              hiddenFrom="sm"
            />
            <Group gap={0} align="center" style={{ lineHeight: 1 }}>
              <Text fw={800} style={{ color: "#344e41", letterSpacing: 0.6, fontSize: '1.8rem' }}>
                SCR
              </Text>
              <IconRecycle size={26} color="#3a5a40" style={{ margin: 0 }} />
              <Text fw={800} style={{ color: "#344e41", letterSpacing: 0.6, fontSize: '1.8rem' }}>
                PP
              </Text>
            </Group>
          </Group>

          <div style={{ flex: 1 }} />

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                src={user?.avatar}
                alt={userName}
                radius="xl"
                size="40"
                style={{ cursor: "pointer", backgroundColor: "#588157", color: "#ffffff" }}
              >
                {userInitial}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled>
                <Text size="sm" fw={500}>
                  {userName}
                </Text>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                icon={<IconUser size={14} />}
                onClick={() => navigate("/org-dashboard/settings")}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                icon={<IconLogout size={14} />}
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={styles.navbar}>
        <Box onClick={() => setMobileOpened(false)}>
          <OrganizationSidebar />
        </Box>
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>{children}</AppShell.Main>
    </AppShell>
  );
}

export default OrganizationDashboardLayout;
