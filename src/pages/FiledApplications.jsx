import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
} from "@mantine/core";

const applications = [
  {
    id: 1,
    title: "DAAD Scholarship",
    country: "Germany",
    level: "Masters",
    status: "Pending",
    appliedDate: "2026-04-10",
  },
  {
    id: 2,
    title: "Commonwealth Scholarship",
    country: "UK",
    level: "PhD",
    status: "Accepted",
    appliedDate: "2026-03-22",
  },
  {
    id: 3,
    title: "Mastercard Foundation Scholarship",
    country: "Canada",
    level: "Undergraduate",
    status: "Rejected",
    appliedDate: "2026-02-18",
  },
];

export default function FiledApplications() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Filed Applications
      </Title>

      <Grid>
        {applications.map((app) => (
          <Grid.Col key={app.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>

              <Group justify="space-between" mb="xs">
                <Text fw={600}>{app.title}</Text>

                <Badge
                  color={
                    app.status === "Accepted"
                      ? "green"
                      : app.status === "Rejected"
                      ? "red"
                      : "yellow"
                  }
                >
                  {app.status}
                </Badge>
              </Group>

              <Text size="sm">Country: {app.country}</Text>
              <Text size="sm">Level: {app.level}</Text>
              <Text size="sm" mb="md">
                Applied: {app.appliedDate}
              </Text>

              <Button variant="light" fullWidth>
                View Application
              </Button>

            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}