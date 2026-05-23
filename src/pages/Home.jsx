import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  Card,
  SimpleGrid,
  Badge,
  Button,
  ThemeIcon,
  Stack,
  Title,
  Container,
  ScrollArea,
  Divider,
  Table,
  Avatar,
  Progress,
  Image,
  TextInput,
  Select,
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
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useState("light");

  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  // ✅ FIXED NAV ITEMS (WITH ROUTES)
  const navItems = [
    { label: "Home", icon: IconHome, path: "/user-dashboard" },
    { label: "Scholarships", icon: IconSchool, path: "/scholarships" },
    { label: "Applications", icon: IconFileText, path: "/filed-applications" },
    {label: "Assessments", icon: IconChecklist, path: "/assessments", },
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
                active={item.label === "Home"}
                onClick={() => navigate(item.path)} // ✅ FIXED HERE
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
        <Container fluid>
          {/* WELCOME CARD */}
          <Card
            radius="lg"
            p="xl"
            mb="xl"
            withBorder
            bg={colorScheme === "dark" ? "dark.6" : "blue.0"}
          >
            <Group justify="space-between">
              <div>
                <Title order={2}>Welcome back 👋</Title>
                <Text mt="sm" c="dimmed">
                  Explore scholarships and complete your assessments.
                </Text>
              </div>

              <Button onClick={() => navigate("/scholarships")}>
                Explore Scholarships
              </Button>
            </Group>
          </Card>

          {/* CARDS */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
            <Card withBorder p="lg">
              <Text size="sm" c="dimmed">
                Scholarships
              </Text>
              <Title order={2}>24</Title>
            </Card>

            <Card withBorder p="lg">
              <Text size="sm" c="dimmed">
                Applications
              </Text>
              <Title order={2}>6</Title>
            </Card>

            <Card withBorder p="lg">
              <Text size="sm" c="dimmed">
                Assessments
              </Text>
              <Title order={2}>2</Title>
            </Card>

            <Card withBorder p="lg">
              <Text size="sm" c="dimmed">
                Notifications
              </Text>
              <Title order={2}>5</Title>
            </Card>
          </SimpleGrid>

          {/* SCHOLARSHIPS */}
          <Group justify="space-between" mb="md">
            <Title order={3}>Recommended Scholarships</Title>
            <Group>
              <TextInput placeholder="Search scholarship..." w={220} />
              <Select
                placeholder="Filter field"
                data={["Technology", "Engineering", "Business"]}
                w={180}
              />
            </Group>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
            {scholarships.map((item) => (
              <Card
                key={item.id}
                shadow="sm"
                radius="xl"
                p="0"
                withBorder
                style={{
                  overflow: "hidden",
                  transition: "0.3s",
                }}
              >
                {/* IMAGE */}
                <Image src={item.image} height={180} alt={item.title} />

                {/* CONTENT */}
                <Stack p="lg">
                  <Group justify="space-between">
                    <Badge color="blue">{item.field}</Badge>

                    <Badge color={item.status === "Open" ? "green" : "orange"}>
                      {item.status}
                    </Badge>
                  </Group>

                  <Title order={4}>{item.title}</Title>

                  <Text size="sm" c="dimmed">
                    Deadline: {item.deadline}
                  </Text>

                  <Text fw={700} size="lg">
                    {item.amount}
                  </Text>

                  <Progress value={item.status === "Open" ? 70 : 90} />

                  <Group grow mt="sm">
                    <Button
                      variant="light"
                      onClick={() => navigate(`/scholarship/${item.id}`)}
                    >
                      View Details
                    </Button>

                    <Button onClick={() => navigate("/scholarship-assessment")}>
                      Apply
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
          {/* APPLICATIONS */}
          <Card radius="lg" p="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Application Status</Title>
            </Group>

            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Scholarship</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {applications.map((app, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{app.scholarship}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          app.status === "Approved"
                            ? "green"
                            : app.status === "Pending"
                              ? "yellow"
                              : "blue"
                        }
                      >
                        {app.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          {/* PROGRESS */}
          <Card radius="lg" p="lg" withBorder mt="xl">
            <Group justify="space-between" mb="md">
              <div>
                <Title order={4}>Profile Completion</Title>
                <Text size="sm" c="dimmed">
                  Complete your profile to improve matches.
                </Text>
              </div>

              <Badge>75%</Badge>
            </Group>

            <Progress value={75} size="lg" />
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;
