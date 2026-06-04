import { useState } from "react";
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
  IconBriefcase
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useState("light");

  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  const navItems = [
    { label: "Home", icon: IconHome, path: "/user-dashboard" },
    { label: "Scholarships", icon: IconSchool, path: "/scholarships" },
    { label: "Internship", icon: IconBriefcase, path: "/internships" },
    { label: "Applications", icon: IconFileText, path: "/filed-applications" },
    { label: "Assessments", icon: IconChecklist, path: "/assessments" },
    { label: "Notifications", icon: IconBell, path: "/notifications" },
    { label: "Profile", icon: IconUser, path: "/UserProfile" },
    { label: "Settings", icon: IconSettings, path: "/settings" },
    { label: "Logout", icon: IconLogout, path: "/login" },
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
          backgroundColor: colorScheme === "dark" ? "#1A1B1E" : "#F8F9FA",
        },
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
              onClick={toggleColorScheme}
              leftSection={
                colorScheme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )
              }
            >
              {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>

            <Avatar radius="xl" color="blue">
              R
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        <Group justify="space-between" mb="lg">
          <Text fw={700}>Student Panel</Text>
          <Badge color="green">Online</Badge>
        </Group>

        <ScrollArea style={{ flex: 1 }}>
          <Stack gap="xs">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
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
        <Outlet context={{ colorScheme }} />
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
