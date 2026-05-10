import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Avatar,
  Button,
  Group,
  Stack,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import {
  IconSchool,
  IconBriefcase,
  IconUsers,
  IconRocket,
} from "@tabler/icons-react";

export default function AboutUs() {
  return (
    <Container size="lg" py={60}>
      {/* HERO SECTION */}
      <Stack align="center" mb={60}>
        <ThemeIcon size={80} radius={80} variant="light" color="blue">
          <IconRocket size={40} />
        </ThemeIcon>

        <Title ta="center" order={1}>
          About ScholarLink
        </Title>

        <Text ta="center" c="dimmed" maw={700} size="lg">
          ScholarLink is a modern platform dedicated to connecting students
          with scholarships, internships, mentorship programs, and career
          opportunities that help shape a brighter future.
        </Text>

        <Group mt="md">
          <Button radius="xl" size="md">
            Explore Opportunities
          </Button>

          <Button variant="light" radius="xl" size="md">
            Learn More
          </Button>
        </Group>
      </Stack>

      {/* MISSION & VISION */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb={70}>
        <Card shadow="md" radius="xl" p="xl" withBorder>
          <ThemeIcon size={55} radius="xl" color="blue" variant="light" mb="md">
            <IconSchool size={28} />
          </ThemeIcon>

          <Title order={3} mb="sm">
            Our Mission
          </Title>

          <Text c="dimmed" size="md">
            Our mission is to bridge the gap between students and real-world
            opportunities by providing a platform where scholarships,
            internships, mentorship, and career growth meet.
          </Text>
        </Card>

        <Card shadow="md" radius="xl" p="xl" withBorder>
          <ThemeIcon
            size={55}
            radius="xl"
            color="grape"
            variant="light"
            mb="md"
          >
            <IconBriefcase size={28} />
          </ThemeIcon>

          <Title order={3} mb="sm">
            Our Vision
          </Title>

          <Text c="dimmed" size="md">
            To become Africa’s leading student opportunity platform, empowering
            young people with access to meaningful scholarships, internships,
            and professional career pathways.
          </Text>
        </Card>
      </SimpleGrid>

      {/* WHY CHOOSE US */}
      <Stack align="center" mb={50}>
        <Title ta="center" order={2}>
          Why ScholarLink?
        </Title>

        <Text ta="center" c="dimmed" maw={650}>
          We help students discover opportunities that accelerate academic,
          professional, and personal growth.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mb={80}>
        <Card shadow="sm" radius="xl" p="lg" withBorder>
          <ThemeIcon color="blue" variant="light" size={50} radius="xl" mb="md">
            <IconSchool size={25} />
          </ThemeIcon>

          <Title order={4} mb="xs">
            Scholarships
          </Title>

          <Text c="dimmed" size="sm">
            Discover local and international scholarship opportunities tailored
            for students.
          </Text>
        </Card>

        <Card shadow="sm" radius="xl" p="lg" withBorder>
          <ThemeIcon
            color="grape"
            variant="light"
            size={50}
            radius="xl"
            mb="md"
          >
            <IconBriefcase size={25} />
          </ThemeIcon>

          <Title order={4} mb="xs">
            Internships
          </Title>

          <Text c="dimmed" size="sm">
            Connect with companies and organizations offering valuable work
            experience.
          </Text>
        </Card>

        <Card shadow="sm" radius="xl" p="lg" withBorder>
          <ThemeIcon
            color="teal"
            variant="light"
            size={50}
            radius="xl"
            mb="md"
          >
            <IconUsers size={25} />
          </ThemeIcon>

          <Title order={4} mb="xs">
            Student Network
          </Title>

          <Text c="dimmed" size="sm">
            Build meaningful connections with mentors, students, and career
            professionals.
          </Text>
        </Card>
      </SimpleGrid>

      {/* FOUNDERS SECTION */}
      <Stack align="center" mb={40}>
        <Title ta="center" order={2}>
          Meet The Founders
        </Title>

        <Text ta="center" c="dimmed">
          Passionate about empowering students through technology and
          opportunity.
        </Text>
      </Stack>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="lg" radius="xl" p="xl" withBorder>
            <Group align="flex-start">
              <Avatar size={90} radius={90} color="blue">
                SK
              </Avatar>

              <div>
                <Title order={3}>Samson Kwizela</Title>

                <Text c="blue" fw={600} mb="sm">
                  Founder & Lead Developer
                </Text>

                <Text c="dimmed">
                  Samson is passionate about technology, innovation, and helping
                  students access life-changing educational and career
                  opportunities through digital solutions.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="lg" radius="xl" p="xl" withBorder>
            <Group align="flex-start">
              <Avatar size={90} radius={90} color="grape">
                RM
              </Avatar>

              <div>
                <Title order={3}>Racheal Milele</Title>

                <Text c="grape" fw={600} mb="sm">
                  Co-Founder & Community Lead
                </Text>

                <Text c="dimmed">
                  Racheal focuses on community engagement and student outreach,
                  ensuring ScholarLink remains impactful, accessible, and
                  student-centered.
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}