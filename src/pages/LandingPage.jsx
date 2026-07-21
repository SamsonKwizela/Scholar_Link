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

import { Link, useNavigate } from "react-router-dom";

import OpportunitiesCards from "../components/OpportunitiesCards";
import { DarkModeToggle } from "../components/DarkModeToggle";

import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box className="page">

      {/* ================= NAVBAR ================= */}
      <Box 
        className="navbar"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky)',
          transition: 'all 0.3s ease'
        }}
      >

        <Container size="xl">

          <Group justify="space-between" py="sm">

            <Group 
              gap="xs" 
              onClick={() => navigate("/")} 
              style={{ 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s ease'
              }}
              className="animate-fade-in"
            >
              <Title 
                order={3} 
                fw={800} 
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}
              >
                Scholar
              </Title>
              <Title 
                order={3} 
                fw={400} 
                style={{ 
                  color: 'var(--text-secondary)',
                  letterSpacing: '-0.02em'
                }}
              >
                Link
              </Title>
            </Group>

            <Group gap="sm" visibleFrom="md">

              <Button 
                variant="subtle" 
                color="blue" 
                component={Link} 
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'var(--bg-tertiary)',
                    }
                  }
                }}
              >
                Home
              </Button>

              <Button 
                variant="subtle" 
                color="blue" 
                component={Link} 
                to="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/about");
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'var(--bg-tertiary)',
                    }
                  }
                }}
              >
                About
              </Button>

              <Button 
                variant="subtle" 
                color="blue" 
                component={Link} 
                to="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/contact");
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'var(--bg-tertiary)',
                    }
                  }
                }}
              >
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
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                styles={{
                  root: {
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    '&:hover': {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--primary-400)',
                    }
                  }
                }}
              >
                Sign In
              </Button>

              <Button
                radius="md"
                component={Link}
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                styles={{
                  root: {
                    background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: 'var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.3)',
                    }
                  }
                }}
              >
                Sign In
              </Button>

            </Group>

          </Group>

        </Container>

      </Box>

      {/* ================= HERO SECTION ================= */}
      <Container size="xl" className="hero-section" py={{ base: 'xl', md: '6rem' }}>

        <Grid align="center" gutter="xl">

          {/* LEFT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            <Stack gap="lg" className="animate-fade-in">

              <Badge
                size="lg"
                radius="sm"
                variant="light"
                color="blue"
                w="fit-content"
                style={{
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontWeight: 600,
                  padding: '8px 16px'
                }}
              >
                🚀 STUDENT OPPORTUNITY PLATFORM
              </Badge>

              <Title 
                order={1}
                style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em'
                }}
              >
                Find Scholarships &
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-cyan) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Internships
                </span>
                <br />
                Easily 🎓
              </Title>

              <Text 
                size="lg" 
                c="dimmed" 
                style={{ 
                  maxWidth: '500px',
                  lineHeight: 1.7
                }}
              >
                ScholarLink helps students discover scholarships,
                internships, and academic opportunities while
                building stronger learning communities.
              </Text>

              <Group mt="md" gap="md">

                <Button
                  size="lg"
                  radius="lg"
                  leftSection={<IconRocket size={20} />}
                  component={Link}
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  styles={{
                    root: {
                      background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                      padding: '12px 32px',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'var(--shadow-lg), 0 0 30px rgba(59, 130, 246, 0.4)',
                      }
                    }
                  }}
                >
                  Get Started
                </Button>

                <Button
                  size="lg"
                  radius="lg"
                  variant="outline"
                  component={Link}
                  to="/learn-more"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/learn-more");
                  }}
                  styles={{
                    root: {
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '12px 32px',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--primary-400)',
                        transform: 'translateY(-2px)',
                      }
                    }
                  }}
                >
                  Learn More
                </Button>

              </Group>

            </Stack>

          </Grid.Col>

          {/* RIGHT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            <Card
              radius="2xl"
              padding="xl"
              shadow="2xl"
              withBorder
              className="highlight-card animate-scale-in"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
              }}
            >

              <Stack gap="md">

                <Group justify="space-between">

                  <Text fw={700} size="lg">
                    Platform Highlights
                  </Text>

                  <Badge 
                    color="green" 
                    variant="light"
                    style={{
                      background: 'var(--success-light)',
                      color: 'var(--success)',
                      fontWeight: 600
                    }}
                  >
                    ● Live
                  </Badge>

                </Group>

                {/* HIGHLIGHT ITEMS */}
                {[
                  {
                    icon: <IconBook2 size={24} />,
                    title: "Study Resources",
                    text: "Notes, tutorials & learning guides",
                    color: "blue",
                    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  },

                  {
                    icon: <IconUsersGroup size={24} />,
                    title: "Student Community",
                    text: "Collaborate and connect with peers",
                    color: "green",
                    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  },

                  {
                    icon: <IconSchool size={24} />,
                    title: "Career Opportunities",
                    text: "Scholarships & internship programs",
                    color: "orange",
                    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    withBorder
                    radius="xl"
                    p="lg"
                    className="mini-card"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >

                    <Group>

                      <ThemeIcon
                        size={56}
                        radius="lg"
                        variant="light"
                        color={item.color}
                        style={{
                          background: item.gradient,
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {item.icon}
                      </ThemeIcon>

                      <div style={{ flex: 1 }}>

                        <Text fw={700} size="md">
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
      <Box 
        py={{ base: '5rem', md: '7rem' }}
        style={{
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)'
        }}
      >
        <Container size="xl">

          <Stack align="center" mb={{ base: '3rem', md: '5rem' }} gap="md" className="animate-fade-in">

            <Badge
              size="lg"
              variant="light"
              color="blue"
              style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-700)',
                fontWeight: 600,
                padding: '8px 16px'
              }}
            >
              ✨ SCHOLARLINK FEATURES
            </Badge>

            <Title 
              order={2} 
              ta="center" 
              style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800
              }}
            >
              Everything You Need To Excel
            </Title>

            <Text
              ta="center"
              c="dimmed"
              maw={650}
              size="lg"
            >
              Discover modern tools and opportunities designed
              to improve learning, collaboration, and student success.
            </Text>

          </Stack>

          <OpportunitiesCards />

        </Container>
      </Box>

      {/* ================= CTA ================= */}
      <Box 
        pb={{ base: '5rem', md: '7rem' }}
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container size="xl">
          <Card 
            className="cta-card"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-2xl)',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Group
              justify="space-between"
              align="center"
              wrap="wrap"
              gap="xl"
            >

              <div style={{ flex: 1, minWidth: '280px' }}>

                <Title 
                  order={2}
                  style={{ 
                    color: 'white',
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    fontWeight: 800,
                    marginBottom: '1rem'
                  }}
                >
                  Ready to Build Your Future?
                </Title>

                <Text 
                  size="lg" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: '500px'
                  }}
                >
                  Join ScholarLink and unlock scholarships,
                  internships, and educational opportunities.
                </Text>

              </div>

              <Button
                size="xl"
                radius="lg"
                component={Link}
                to="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                styles={{
                  root: {
                    background: 'white',
                    color: 'var(--primary-700)',
                    fontWeight: 700,
                    padding: '16px 40px',
                    minWidth: '180px',
                    '&:hover': {
                      background: 'var(--gray-50)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }
                  }
                }}
              >
                Get Started
              </Button>

            </Group>

          </Card>
        </Container>
      </Box>

    </Box>
  );
}

export default LandingPage;