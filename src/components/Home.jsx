import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
  Badge,
  Stack,
  Image,
} from "@mantine/core";
import { IconBook, IconUsers, IconSchool } from "@tabler/icons-react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <Container size="lg" className="hero">
        <Stack align="center" spacing="md">
          <Badge color="blue" size="lg">
            ScholarLink Platform
          </Badge>

          <Title className="hero-title" ta="center">
            Connect. Learn. Succeed.
          </Title>

          <Text size="lg" c="dimmed" ta="center" maw={600}>
            ScholarLink is a digital hub for students to share knowledge,
            access learning resources, collaborate on projects, and grow
            academically together.
          </Text>

          <Group mt="md">
            <Button size="md" color="blue">
              Get Started
            </Button>
            <Button size="md" variant="outline">
              Explore Resources
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* FEATURES */}
      <Container size="lg" mt={60}>
        <Title order={2} ta="center" mb="lg">
          What You Can Do on ScholarLink
        </Title>

        <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: "md", cols: 1 }]}>
          <Card shadow="md" padding="lg" radius="md" withBorder>
            <IconBook size={40} color="blue" />
            <Title order={4} mt="md">
              Access Study Materials
            </Title>
            <Text size="sm" c="dimmed">
              Find notes, PDFs, tutorials, and exam resources shared by students and lecturers.
            </Text>
          </Card>

          <Card shadow="md" padding="lg" radius="md" withBorder>
            <IconUsers size={40} color="green" />
            <Title order={4} mt="md">
              Collaborate with Peers
            </Title>
            <Text size="sm" c="dimmed">
              Work on group projects, chat with classmates, and share ideas in real time.
            </Text>
          </Card>

          <Card shadow="md" padding="lg" radius="md" withBorder>
            <IconSchool size={40} color="orange" />
            <Title order={4} mt="md">
              Grow Academically
            </Title>
            <Text size="sm" c="dimmed">
              Track your progress, join academic communities, and improve your performance.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* CALL TO ACTION */}
      <Container size="lg" mt={80} className="cta">
        <Card radius="lg" padding="xl" shadow="xl" className="cta-card">
          <Group justify="space-between" align="center">
            <div>
              <Title order={3}>Ready to join ScholarLink?</Title>
              <Text c="dimmed">
                Create an account and start your learning journey today.
              </Text>
            </div>

            <Button size="md" color="dark">
              Sign Up Now
            </Button>
          </Group>
        </Card>
      </Container>

      {/* FOOTER */}
      <Container size="lg" mt={60} mb={30}>
        <Text ta="center" c="dimmed" size="sm">
          © {new Date().getFullYear()} ScholarLink. All rights reserved.
        </Text>
      </Container>
    </div>
  );
}