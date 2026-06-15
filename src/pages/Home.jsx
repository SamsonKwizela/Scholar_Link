import { useState, useEffect } from "react";
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
  ScrollArea,
  Divider,
  Avatar,
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

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [opened, setOpened] = useState(false);
  const { isDark, toggleDark } = useTheme();
  const { unreadCount, markAllAsRead } = useNotifications();

  // Load profile avatar from localStorage
  const [avatar, setAvatar] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile).avatar : "https://i.pravatar.cc/300?img=12";
  });

  // Update avatar when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setAvatar(JSON.parse(savedProfile).avatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navItems = [
    { label: "Home", icon: IconHome, path: "/user-dashboard" },
    { label: "Scholarships", icon: IconSchool, path: "/scholarships" },
    { label: "Internship", icon: IconBriefcase, path: "/internships" },
    { label: "Applications", icon: IconFileText, path: "/filed-applications" },
    { label: "Assessments", icon: IconChecklist, path: "/assessments" },
    { label: "Notifications", icon: IconBell, path: "/notifications", hasBadge: true },
    { label: "Profile", icon: IconUser, path: "/UserProfile" },
    { label: "Settings", icon: IconSettings, path: "/settings" },
    { label: "Logout", icon: IconLogout, path: "/login", isLogout: true },
  ];

  const scholarships = [
    {
      id: 1,
      title: "Women in Tech Scholarship",
      field: "Technology",
      deadline: "12 June 2026",
      status: "Open",
      amount: "$5,000",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },

    {
      id: 2,
      title: "STEM Excellence Grant",
      field: "Engineering",
      deadline: "25 June 2026",
      status: "Closing Soon",
      amount: "$8,000",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },

    {
      id: 3,
      title: "Global Leaders Program",
      field: "Business",
      deadline: "5 July 2026",
      status: "Open",
      amount: "$10,000",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    },
  ];

  const applications = [
    { scholarship: "Women in Tech Scholarship", status: "Pending" },
    { scholarship: "STEM Excellence Grant", status: "Assessment Required" },
    { scholarship: "Africa Education Fund", status: "Approved" },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 70 }}
      styles={{
        main: {
          backgroundColor: 'var(--bg)',
        },
        header: {
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)'
        },
        navbar: {
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)'
        }
      }}
    >
      {/* HEADER */}
      <AppShell.Header px="md">
        <Group justify="space-between" h="100%">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />

            <Title order={3} c="blue">
              ScholarLink
            </Title>
          </Group>

          <Group>
            <Button
              variant="light"
              onClick={toggleDark}
              leftSection={
                isDark ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )
              }
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </Button>

            <Avatar 
              radius="xl" 
              src={avatar}
              alt="Profile"
            />
          </Group>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        <Group justify="space-between" mb="lg">
          <Text fw={700}>Student Panel</Text>
          <Badge color="green">Online</Badge>
        </Group>

        <ScrollArea className="sidebar-scroll">
          <Stack gap="xs">
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
                onClick={() => {
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
              />
            ))}
          </Stack>
        </ScrollArea>

        <Divider my="md" />

        <Text size="sm" c="dimmed">
          Logged in as
        </Text>
        <Text fw={600}>Student User</Text>
      </AppShell.Navbar>

      {/* MAIN */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
