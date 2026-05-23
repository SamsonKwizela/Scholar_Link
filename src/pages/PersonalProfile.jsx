import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";

import {
  IconBook2,
  IconMail,
  IconMapPin,
  IconSchool,
  IconStarFilled,
  IconTrophy,
  IconUsersGroup,
} from "@tabler/icons-react";

export default function PersonalProfile() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 0",
      }}
    >
      <Container size="lg">

        {/* PROFILE HEADER */}
        <Card
          radius="xl"
          p="xl"
          shadow="md"
          withBorder
          style={{
            background: "white",
            marginBottom: "30px",
          }}
        >

          <Grid align="center">

            {/* LEFT */}
            <Grid.Col span={{ base: 12, md: 4 }}>

              <Stack align="center">

                <Avatar
                  src="https://i.pravatar.cc/300"
                  size={140}
                  radius={140}
                />

                <Badge
                  color="blue"
                  variant="light"
                  size="lg"
                >
                  Computer Science Student
                </Badge>

              </Stack>

            </Grid.Col>

            {/* RIGHT */}
            <Grid.Col span={{ base: 12, md: 8 }}>

              <Stack gap="sm">

                <div>
                  <Title order={2}>
                    Samson Kwizela
                  </Title>

                  <Text c="dimmed" size="lg">
                    Passionate about software engineering,
                    networking, and academic innovation.
                  </Text>
                </div>

                <Group mt="md">

                  <Group gap={6}>
                    <IconMail size={18} />
                    <Text size="sm">
                      samson@example.com
                    </Text>
                  </Group>

                  <Group gap={6}>
                    <IconMapPin size={18} />
                    <Text size="sm">
                      Lusaka, Zambia
                    </Text>
                  </Group>

                </Group>

                <Group mt="md">

                  <Button radius="md">
                    Edit Profile
                  </Button>

                  <Button
                    radius="md"
                    variant="outline"
                  >
                    Message
                  </Button>

                </Group>

              </Stack>

            </Grid.Col>

          </Grid>

        </Card>

        {/* PROFILE CONTENT */}
        <Grid>

          {/* LEFT SIDE */}
          <Grid.Col span={{ base: 12, md: 4 }}>

            {/* ABOUT */}
            <Card
              radius="xl"
              p="lg"
              shadow="sm"
              withBorder
              mb="lg"
            >

              <Title order={4} mb="md">
                About Me
              </Title>

              <Text
                size="sm"
                c="dimmed"
                style={{
                  lineHeight: 1.8,
                }}
              >
                I am a computing student passionate about
                web development, networking, and building
                digital solutions that improve education
                and collaboration.
              </Text>

            </Card>

            {/* SKILLS */}
            <Card
              radius="xl"
              p="lg"
              shadow="sm"
              withBorder
            >

              <Title order={4} mb="lg">
                Skills
              </Title>

              <Stack gap="md">

                <div>
                  <Group justify="space-between">
                    <Text size="sm">React.js</Text>
                    <Text size="sm">85%</Text>
                  </Group>

                  <Progress value={85} radius="xl" />
                </div>

                <div>
                  <Group justify="space-between">
                    <Text size="sm">Node.js</Text>
                    <Text size="sm">75%</Text>
                  </Group>

                  <Progress value={75} radius="xl" color="green" />
                </div>

                <div>
                  <Group justify="space-between">
                    <Text size="sm">MongoDB</Text>
                    <Text size="sm">70%</Text>
                  </Group>

                  <Progress value={70} radius="xl" color="orange" />
                </div>

              </Stack>

            </Card>

          </Grid.Col>

          {/* RIGHT SIDE */}
          <Grid.Col span={{ base: 12, md: 8 }}>

            {/* STATS */}
            <SimpleStats />

            {/* EDUCATION */}
            <Card
              radius="xl"
              p="lg"
              shadow="sm"
              withBorder
              mt="lg"
            >

              <Title order={4} mb="lg">
                Education
              </Title>

              <Stack gap="lg">

                <Group align="flex-start">

                  <ThemeIcon
                    size={50}
                    radius="md"
                    variant="light"
                    color="blue"
                  >
                    <IconSchool size={24} />
                  </ThemeIcon>

                  <div>
                    <Text fw={600}>
                      Cavendish University Zambia
                    </Text>

                    <Text size="sm" c="dimmed">
                      Bachelor of Science in Computing
                    </Text>

                    <Text size="xs" c="dimmed" mt={4}>
                      2022 - Present
                    </Text>
                  </div>

                </Group>

              </Stack>

            </Card>

            {/* ACTIVITIES */}
            <Card
              radius="xl"
              p="lg"
              shadow="sm"
              withBorder
              mt="lg"
            >

              <Title order={4} mb="lg">
                Activities & Interests
              </Title>

              <Group>

                <Badge size="lg" variant="light">
                  Web Development
                </Badge>

                <Badge size="lg" variant="light" color="green">
                  Networking
                </Badge>

                <Badge size="lg" variant="light" color="orange">
                  Chess
                </Badge>

                <Badge size="lg" variant="light" color="red">
                  Forex Trading
                </Badge>

                <Badge size="lg" variant="light" color="violet">
                  Reading
                </Badge>

              </Group>

            </Card>

          </Grid.Col>

        </Grid>

      </Container>
    </Box>
  );
}

/* ================= STATS COMPONENT ================= */

function SimpleStats() {
  const stats = [
    {
      icon: <IconBook2 size={22} />,
      label: "Resources Shared",
      value: "120+",
      color: "blue",
    },

    {
      icon: <IconUsersGroup size={22} />,
      label: "Collaborations",
      value: "35",
      color: "green",
    },

    {
      icon: <IconTrophy size={22} />,
      label: "Achievements",
      value: "14",
      color: "orange",
    },

    {
      icon: <IconStarFilled size={22} />,
      label: "Profile Rating",
      value: "4.9",
      color: "yellow",
    },
  ];

  return (
    <Grid>

      {stats.map((stat, index) => (
        <Grid.Col
          key={index}
          span={{ base: 12, sm: 6 }}
        >

          <Card
            radius="xl"
            p="lg"
            shadow="sm"
            withBorder
          >

            <Group justify="space-between">

              <div>

                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>

                <Title order={2}>
                  {stat.value}
                </Title>

              </div>

              <ThemeIcon
                size={54}
                radius="xl"
                variant="light"
                color={stat.color}
              >
                {stat.icon}
              </ThemeIcon>

            </Group>

          </Card>

        </Grid.Col>
      ))}

    </Grid>
  );
}