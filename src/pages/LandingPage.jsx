import {
  Container,
  Group,
  Button,
  Title,
  Text,
  Box,
  Stack,
  Badge,
  Card,
  ThemeIcon,
  Grid,
} from "@mantine/core";

import {
  IconRocket,
  IconSchool,
  IconUsersGroup,
  IconBook2,
} from "@tabler/icons-react";

import { Link } from "react-router-dom";

import OpportunitiesCards from "../components/OpportunitiesCards";
import { DarkModeToggle } from "../components/DarkModeToggle";

import "./LandingPage.css";

function LandingPage() {
  return (
    <Box className="page">

      {/* ================= NAVBAR ================= */}
      <Box className="navbar">

        <Container size="xl">

          <Group justify="space-between">

            <Title order={3} className="logo">
              ScholarLink
            </Title>

            <Group gap="sm" visibleFrom="md">

              <Button variant="subtle" color="gray" component={Link} to="/user-dashboard">
                Home
              </Button>

              <Button variant="subtle" color="gray" component={Link} to="/about">
                About
              </Button>

              <Button variant="subtle" color="gray" component={Link} to="/contact">
                Contact
              </Button>

            </Group>

            <Group gap="sm">

              <DarkModeToggle />

              <Button
                variant="outline"
                radius="md"
                component={Link}
                to="/login"
              >
                Sign In
              </Button>

              <Button
                radius="md"
                component={Link}
                to="/signup"
              >
                Sign Up
              </Button>

            </Group>

          </Group>

        </Container>

      </Box>

      {/* ================= HERO SECTION ================= */}
      <Container size="xl" className="hero-section">

        <Grid align="center">

          {/* LEFT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            <Stack gap="lg">

              <Badge
                size="lg"
                radius="sm"
                variant="light"
                color="blue"
                w="fit-content"
              >
                STUDENT OPPORTUNITY PLATFORM
              </Badge>

              <Title className="hero-title">
                Find Scholarships & Internships Easily 🎓
              </Title>

              <Text className="hero-text">
                ScholarLink helps students discover scholarships,
                internships, and academic opportunities while
                building stronger learning communities.
              </Text>

              <Group mt="md">

                <Button
                  size="md"
                  radius="md"
                  leftSection={<IconRocket size={18} />}
                  component={Link}
                  to="/login"
                >
                  Get Started
                </Button>

                <Button
                  size="md"
                  radius="md"
                  variant="outline"
                  component={Link}
                  to="/about"
                >
                  Learn More
                </Button>

              </Group>

            </Stack>

          </Grid.Col>

          {/* RIGHT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            <Card
              radius="xl"
              padding="xl"
              shadow="xl"
              withBorder
              className="highlight-card"
            >

              <Stack gap="md">

                <Group justify="space-between">

                  <Text fw={700} size="lg">
                    Platform Highlights
                  </Text>

                  <Badge color="green" variant="light">
                    Live
                  </Badge>

                </Group>

                {/* HIGHLIGHT ITEMS */}
                {[
                  {
                    icon: <IconBook2 size={22} />,
                    title: "Study Resources",
                    text: "Notes, tutorials & learning guides",
                    color: "blue",
                  },

                  {
                    icon: <IconUsersGroup size={22} />,
                    title: "Student Community",
                    text: "Collaborate and connect with peers",
                    color: "green",
                  },

                  {
                    icon: <IconSchool size={22} />,
                    title: "Career Opportunities",
                    text: "Scholarships & internship programs",
                    color: "orange",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    withBorder
                    radius="lg"
                    p="md"
                    className="mini-card"
                  >

                    <Group>

                      <ThemeIcon
                        size={50}
                        radius="md"
                        variant="light"
                        color={item.color}
                      >
                        {item.icon}
                      </ThemeIcon>

                      <div>

                        <Text fw={600}>
                          {item.title}
                        </Text>

                        <Text size="sm" c="dimmed">
                          {item.text}
                        </Text>

                      </div>

                    </Group>

                  </Card>
                ))}

              </Stack>

            </Card>

          </Grid.Col>

        </Grid>

      </Container>

      {/* ================= FEATURES ================= */}
      <Container size="xl" py={80}>

        <Stack align="center" mb={50} gap="xs">

          <Badge
            size="lg"
            variant="light"
            color="blue"
          >
            SCHOLARLINK FEATURES
          </Badge>

          <Title ta="center">
            Everything You Need To Excel
          </Title>

          <Text
            ta="center"
            c="dimmed"
            maw={650}
          >
            Discover modern tools and opportunities designed
            to improve learning, collaboration, and student success.
          </Text>

        </Stack>

        <OpportunitiesCards />

      </Container>

      {/* ================= CTA ================= */}
      <Container size="xl" pb={90}>

        <Card className="cta-card">

          <Group
            justify="space-between"
            align="center"
          >

            <div>

              <Title className="cta-title">
                Ready to Build Your Future?
              </Title>

              <Text className="cta-text">
                Join ScholarLink and unlock scholarships,
                internships, and educational opportunities.
              </Text>

            </div>

            <Button
              size="lg"
              radius="md"
              color="dark"
              component={Link}
              to="/signup"
            >
              Create Account
            </Button>

          </Group>

        </Card>

      </Container>

    </Box>
  );
}

export default LandingPage;