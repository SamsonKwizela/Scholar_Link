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
import { getApiCollection, getDashboardStats } from "../utils/api";

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
  const loadStats = useCallback(async () => {
    try {
      const [scholarships, internships, assessments, statsData] = await Promise.all([
        getApiCollection('/scholarships'),
        getApiCollection('/internships'),
        getApiCollection('/assessments'),
        getDashboardStats()
      ]);

      const applications = dataManager.applications.getAll();

      setStats({
        scholarships: statsData.scholarships || scholarships.length,
        applications: statsData.applications || applications.length,
        assessments: statsData.assessments || assessments.length,
        internships: statsData.internships || internships.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
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
      header={{ height: 70 }}
      styles={{
        main: {
          backgroundColor: 'var(--bg-primary)',
          transition: 'background-color 0.3s ease',
        },
        header: {
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        },
        navbar: {
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
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
          <Card withBorder p="md" radius="lg" style={{ 
            background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease' 
          }}>
            <Group gap="sm">
              <Avatar
                size="lg"
                radius="xl"
                src={avatar}
                alt="Profile"
                style={{ 
                  cursor: 'pointer',
                  border: '3px solid var(--primary-200)',
                  transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/UserProfile");
                }}
              />
              <div style={{ flex: 1 }}>
                <Text fw={700} size="sm" lineClamp={1}>{userName}</Text>
                <Text size="xs" c="dimmed" fw={500}>Student</Text>
              </div>
            </Group>
          </Card>

          {/* Statistics Cards */}
          <SimpleGrid cols={2} gap="sm">
            <Card withBorder p="sm" radius="lg" style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <Text size="xs" c="dimmed" fw={500}>Scholarships</Text>
              <Text fw={800} size="xl" c="blue" style={{ 
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stats.scholarships}</Text>
            </Card>
            <Card withBorder p="sm" radius="lg" style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <Text size="xs" c="dimmed" fw={500}>Applications</Text>
              <Text fw={800} size="xl" c="green" style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stats.applications}</Text>
            </Card>
            <Card withBorder p="sm" radius="lg" style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <Text size="xs" c="dimmed" fw={500}>Assessments</Text>
              <Text fw={800} size="xl" c="orange" style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stats.assessments}</Text>
            </Card>
            <Card withBorder p="sm" radius="lg" style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <Text size="xs" c="dimmed" fw={500}>Internships</Text>
              <Text fw={800} size="xl" c="violet" style={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stats.internships}</Text>
            </Card>
          </SimpleGrid>

          <Divider my="sm" />

          {/* Navigation */}
          <Stack gap="xs">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" pl="xs">Menu</Text>
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                rightSection={
                  item.hasBadge && unreadCount > 0 ? (
                    <Badge size="sm" color="red" variant="filled" circle>
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
                style={{ 
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '2px'
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'var(--bg-tertiary)',
                    }
                  }
                }}
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
