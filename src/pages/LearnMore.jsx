import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Button,
  Group,
  Stack,
  ThemeIcon,
  SimpleGrid,
  List,
  Timeline,
} from "@mantine/core";
import {
  IconSchool,
  IconBriefcase,
  IconUsers,
  IconRocket,
  IconCheck,
  IconStar,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function LearnMore() {
  return (
    <Container size="lg" py={60}>
      {/* HERO SECTION */}
      <Stack align="center" mb={80}>
        <ThemeIcon size={80} radius={80} variant="light" color="blue">
          <IconRocket size={40} />
        </ThemeIcon>

        <Title ta="center" order={1} mb="md">
          Discover ScholarLink
        </Title>

        <Text ta="center" c="dimmed" maw={700} size="lg">
          Empowering students with access to scholarships, internships, and
          career opportunities. Join a community dedicated to your academic and
          professional success.
        </Text>

        <Group mt="md">
          <Button
            radius="xl"
            size="md"
            component={Link}
            to="/signup"
            rightSection={<IconArrowRight size={18} />}
          >
            Get Started Free
          </Button>

          <Button
            variant="light"
            radius="xl"
            size="md"
            component={Link}
            to="/contact"
          >
            Contact Us
          </Button>
        </Group>
      </Stack>

      {/* WHAT WE OFFER */}
      <Stack align="center" mb={60}>
        <Title ta="center" order={2}>
          What We Offer
        </Title>

        <Text ta="center" c="dimmed" maw={650}>
          A comprehensive platform designed to support your educational journey
          and career development.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={80}>
        <Card shadow="md" radius="xl" p="xl" withBorder>
          <ThemeIcon size={60} radius="xl" color="blue" variant="light" mb="md">
            <IconSchool size={30} />
          </ThemeIcon>

          <Title order={3} mb="sm">
            Scholarships
          </Title>

          <Text c="dimmed" size="md" mb="md">
            Access a curated database of local and international scholarships
            tailored for students at all levels.
          </Text>

          <List
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon color="blue" size={20} radius="xl">
                <IconCheck size={14} />
              </ThemeIcon>
            }
          >
            <List.Item>Local and international opportunities</List.Item>
            <List.Item>Personalized scholarship matching</List.Item>
            <List.Item>Application tracking and management</List.Item>
            <List.Item>Deadline reminders and notifications</List.Item>
          </List>
        </Card>

        <Card shadow="md" radius="xl" p="xl" withBorder>
          <ThemeIcon size={60} radius="xl" color="grape" variant="light" mb="md">
            <IconBriefcase size={30} />
          </ThemeIcon>

          <Title order={3} mb="sm">
            Internships
          </Title>

          <Text c="dimmed" size="md" mb="md">
            Connect with leading companies and organizations offering valuable
            work experience opportunities.
          </Text>

          <List
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon color="grape" size={20} radius="xl">
                <IconCheck size={14} />
              </ThemeIcon>
            }
          >
            <List.Item>Diverse industry placements</List.Item>
            <List.Item>Real-world experience building</List.Item>
            <List.Item>Professional networking</List.Item>
            <List.Item>Career pathway guidance</List.Item>
          </List>
        </Card>

        <Card shadow="md" radius="xl" p="xl" withBorder>
          <ThemeIcon size={60} radius="xl" color="teal" variant="light" mb="md">
            <IconUsers size={30} />
          </ThemeIcon>

          <Title order={3} mb="sm">
            Community
          </Title>

          <Text c="dimmed" size="md" mb="md">
            Join a vibrant community of students, mentors, and professionals
            committed to mutual growth.
          </Text>

          <List
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <IconCheck size={14} />
              </ThemeIcon>
            }
          >
            <List.Item>Peer collaboration and support</List.Item>
            <List.Item>Mentorship programs</List.Item>
            <List.Item>Networking events</List.Item>
            <List.Item>Knowledge sharing</List.Item>
          </List>
        </Card>
      </SimpleGrid>

      {/* HOW IT WORKS */}
      <Stack align="center" mb={60}>
        <Title ta="center" order={2}>
          How It Works
        </Title>

        <Text ta="center" c="dimmed" maw={650}>
          Getting started with ScholarLink is simple and straightforward.
        </Text>
      </Stack>

      <Card shadow="lg" radius="xl" p="xl" withBorder mb={80}>
        <Timeline active={3} bulletSize={24} lineWidth={2}>
          <Timeline.Item
            bullet={
              <ThemeIcon color="blue" size={24} radius="xl" variant="light">
                <IconCheck size={14} />
              </ThemeIcon>
            }
            title="Create Your Account"
          >
            <Text c="dimmed" size="sm" mt={4}>
              Sign up for free and complete your profile to get personalized
              recommendations.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={
              <ThemeIcon color="grape" size={24} radius="xl" variant="light">
                <IconStar size={14} />
              </ThemeIcon>
            }
            title="Explore Opportunities"
          >
            <Text c="dimmed" size="sm" mt={4}>
              Browse through scholarships, internships, and programs that match
              your interests and qualifications.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={
              <ThemeIcon color="teal" size={24} radius="xl" variant="light">
                <IconRocket size={14} />
              </ThemeIcon>
            }
            title="Apply and Connect"
          >
            <Text c="dimmed" size="sm" mt={4}>
              Submit applications, track progress, and connect with mentors and
              peers in your field.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={
              <ThemeIcon color="orange" size={24} radius="xl" variant="light">
                <IconSchool size={14} />
              </ThemeIcon>
            }
            title="Achieve Your Goals"
          >
            <Text c="dimmed" size="sm" mt={4}>
              Secure scholarships, land internships, and build the foundation for
              your successful career.
            </Text>
          </Timeline.Item>
        </Timeline>
      </Card>

      {/* WHY CHOOSE US */}
      <Stack align="center" mb={60}>
        <Title ta="center" order={2}>
          Why Choose ScholarLink?
        </Title>

        <Text ta="center" c="dimmed" maw={650}>
          We're committed to making opportunity accessible to every student.
        </Text>
      </Stack>

      <Grid mb={80}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" radius="xl" p="lg" withBorder h="100%">
            <Group align="flex-start">
              <ThemeIcon color="blue" variant="light" size={50} radius="xl">
                <IconSchool size={25} />
              </ThemeIcon>

              <div style={{ flex: 1 }}>
                <Title order={4} mb="xs">
                  Comprehensive Database
                </Title>

                <Text c="dimmed" size="sm">
                  Access thousands of verified scholarships and internship
                  opportunities from trusted sources worldwide.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" radius="xl" p="lg" withBorder h="100%">
            <Group align="flex-start">
              <ThemeIcon color="grape" variant="light" size={50} radius="xl">
                <IconUsers size={25} />
              </ThemeIcon>

              <div style={{ flex: 1 }}>
                <Title order={4} mb="xs">
                  Student-Centered Design
                </Title>

                <Text c="dimmed" size="sm">
                  Built by students, for students. Our platform is designed with
                  your needs and preferences in mind.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" radius="xl" p="lg" withBorder h="100%">
            <Group align="flex-start">
              <ThemeIcon color="teal" variant="light" size={50} radius="xl">
                <IconBriefcase size={25} />
              </ThemeIcon>

              <div style={{ flex: 1 }}>
                <Title order={4} mb="xs">
                  Career Guidance
                </Title>

                <Text c="dimmed" size="sm">
                  Get expert advice and resources to help you make informed
                  decisions about your academic and career path.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" radius="xl" p="lg" withBorder h="100%">
            <Group align="flex-start">
              <ThemeIcon color="orange" variant="light" size={50} radius="xl">
                <IconRocket size={25} />
              </ThemeIcon>

              <div style={{ flex: 1 }}>
                <Title order={4} mb="xs">
                  Always Free
                </Title>

                <Text c="dimmed" size="sm">
                  ScholarLink is completely free for students. We believe
                  opportunity should be accessible to everyone.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* CTA SECTION */}
      <Card
        shadow="xl"
        radius="2xl"
        p="xl"
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
        }}
      >
        <Stack align="center" gap="md">
          <Title order={2} ta="center" style={{ color: 'white' }}>
            Ready to Start Your Journey?
          </Title>

          <Text ta="center" maw={600} style={{ color: 'rgba(255, 255, 255, 0.9)' }} size="lg">
            Join thousands of students who are already using ScholarLink to
            discover opportunities and build their futures.
          </Text>

          <Group mt="md">
            <Button
              size="lg"
              radius="xl"
              component={Link}
              to="/signup"
              rightSection={<IconArrowRight size={18} />}
              styles={{
                root: {
                  background: 'white',
                  color: 'var(--primary-700)',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'var(--gray-50)',
                    transform: 'translateY(-2px)',
                  }
                }
              }}
            >
              Create Free Account
            </Button>

            <Button
              size="lg"
              radius="xl"
              variant="outline"
              component={Link}
              to="/about"
              styles={{
                root: {
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid white',
                  }
                }
              }}
            >
              Learn About Us
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}