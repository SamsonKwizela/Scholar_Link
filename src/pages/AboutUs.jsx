import { Container, Title, Text, Grid, Card, Avatar } from "@mantine/core";

export default function AboutUs() {
  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Title align="center" mb="md">
        About ScholarLink
      </Title>

      <Text align="center" color="dimmed" mb="xl">
        Connecting students with opportunities that shape their future.
      </Text>

      {/* Mission Section */}
      <Title order={3} mb="sm">
        Our Mission
      </Title>
      <Text mb="lg">
        Our mission is to bridge the gap between students and real-world
        opportunities by providing a platform where internships, mentorship,
        and career growth meet.
      </Text>

      {/* Vision Section */}
      <Title order={3} mb="sm">
        Our Vision
      </Title>
      <Text mb="xl">
        To become Africa’s leading student opportunity platform, empowering
        young people with access to meaningful career paths.
      </Text>

      {/* Team Section */}
      <Title order={2} align="center" mb="lg">
        Our Team
      </Title>

      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md">
            <Avatar radius="xl" size="lg" mb="sm" />
            <Title order={4}>Samson</Title>
            <Text size="sm" color="dimmed">
              Founder & Developer
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md">
            <Avatar radius="xl" size="lg" mb="sm" />
            <Title order={4}>Team Member</Title>
            <Text size="sm" color="dimmed">
              Designer
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md">
            <Avatar radius="xl" size="lg" mb="sm" />
            <Title order={4}>Team Member</Title>
            <Text size="sm" color="dimmed">
              Marketing
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}