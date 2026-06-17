import { useState, useEffect, useCallback } from "react";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Badge,
  Button,
  Stack,
  Title,
  Divider,
  Avatar,
  SimpleGrid,
  Card,
} from "@mantine/core";
import {
  IconHome,
  IconSchool,
  IconFileText,
  IconChecklist,
  IconBell,
  IconSettings,
  IconLogout,
  IconUser,
  IconSun,
  IconMoon,
  IconBriefcase,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { useDataManager } from "../utils/dataManager";
import { UniversalHeader } from "../components/UniversalHeader";
import { UniversalFooter } from "../components/UniversalFooter";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [opened, setOpened] = useState(false);
  const { isDark, toggleDark } = useTheme();
  const { unreadCount, markAllAsRead } = useNotifications();
  const dataManager = useDataManager();

  // Load profile data from localStorage
  const [avatar, setAvatar] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile).avatar : "";
  });

  const [userName, setUserName] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile).name : "Student";
  });

  // Load statistics from real data
  const [stats, setStats] = useState({
    scholarships: 0,
    applications: 0,
    assessments: 0,
    internships: 0,
  });

  // Load statistics from real data
  const loadStats = useCallback(() => {
    setStats({
      scholarships: dataManager.scholarships.getCount(),
      applications: dataManager.applications.getCount(),
      assessments: dataManager.assessments.getCount(),
      internships: dataManager.internships.getCount(),
    });
  }, [dataManager]);

  // Update avatar and user data when localStorage changes or profile is updated
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setAvatar(profile.avatar);
        setUserName(profile.name || "Student");
      }
    };

    const handleProfileChange = (event) => {
      if (event.detail && event.detail.avatar) {
        setAvatar(event.detail.avatar);
      }
      if (event.detail && event.detail.name) {
        setUserName(event.detail.name);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileChange', handleProfileChange);
    window.addEventListener('dataChange', loadStats);

    // Initial load
    loadStats();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileChange', handleProfileChange);
      window.removeEventListener('dataChange', loadStats);
    };
  }, [loadStats]);

  const navItems = [
    { label: "Dashboard", icon: IconHome, path: "/user-dashboard" },
    { label: "Scholarships", icon: IconSchool, path: "/scholarships" },
    { label: "Internships", icon: IconBriefcase, path: "/internships" },
    { label: "Applications", icon: IconFileText, path: "/filed-applications" },
    { label: "Assessments", icon: IconChecklist, path: "/assessments" },
    { label: "Notifications", icon: IconBell, path: "/notifications", hasBadge: true },
    { label: "Profile", icon: IconUser, path: "/UserProfile" },
    { label: "Settings", icon: IconSettings, path: "/settings" },
    { label: "Logout", icon: IconLogout, path: "/login", isLogout: true },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 64 }}
      styles={{
        main: {
          backgroundColor: 'var(--mantine-color-body)',
          transition: 'background-color 0.3s ease',
        },
        header: {
          background: 'var(--mantine-color-body)',
          borderBottom: '1px solid var(--mantine-color-default-border)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        },
        navbar: {
          background: 'var(--mantine-color-body)',
          borderRight: '1px solid var(--mantine-color-default-border)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }
      }}
    >
      {/* HEADER */}
      <AppShell.Header px="md">
        <UniversalHeader opened={opened} setOpened={setOpened} showBurger={true} />
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        <Stack gap="md">
          {/* User Info Card */}
          <Card withBorder p="sm" radius="md" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
            <Group gap="sm">
              <Avatar
                size="md"
                radius="xl"
                src={avatar}
                alt="Profile"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/UserProfile");
                }}
              />
              <div style={{ flex: 1 }}>
                <Text fw={600} size="sm" lineClamp={1}>{userName}</Text>
                <Text size="xs" c="dimmed">Student</Text>
              </div>
            </Group>
          </Card>

          {/* Statistics Cards */}
          <SimpleGrid cols={2} gap="xs">
            <Card withBorder p="xs" radius="sm" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
              <Text size="xs" c="dimmed">Scholarships</Text>
              <Text fw={700} size="lg" c="blue">{stats.scholarships}</Text>
            </Card>
            <Card withBorder p="xs" radius="sm" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
              <Text size="xs" c="dimmed">Applications</Text>
              <Text fw={700} size="lg" c="green">{stats.applications}</Text>
            </Card>
            <Card withBorder p="xs" radius="sm" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
              <Text size="xs" c="dimmed">Assessments</Text>
              <Text fw={700} size="lg" c="orange">{stats.assessments}</Text>
            </Card>
            <Card withBorder p="xs" radius="sm" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
              <Text size="xs" c="dimmed">Internships</Text>
              <Text fw={700} size="lg" c="violet">{stats.internships}</Text>
            </Card>
          </SimpleGrid>

          <Divider />

          {/* Navigation */}
          <Stack gap="xs">
            <Text size="sm" fw={600} c="dimmed">MENU</Text>
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                label={item.label}
                leftSection={<item.icon size={18} />}
                rightSection={
                  item.hasBadge && unreadCount > 0 ? (
                    <Badge size="xs" color="red" variant="filled">
                      {unreadCount}
                    </Badge>
                  ) : null
                }
                active={location.pathname === item.path}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.isLogout) {
                    // Clear authentication token
                    localStorage.removeItem('token');
                    // Navigate to login
                    navigate('/login');
                  } else {
                    if (item.path === "/notifications") {
                      markAllAsRead();
                    }
                    navigate(item.path);
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Stack>
      </AppShell.Navbar>

      {/* MAIN */}
      <AppShell.Main>
        <Stack style={{ minHeight: '100vh' }}>
          <Outlet />
          <UniversalFooter />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
