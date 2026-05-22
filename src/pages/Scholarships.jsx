import { Container, Title, Grid, Card, Text, Badge, Button, Group } from "@mantine/core";

const scholarships = [
  {
    id: 1,
    title: "Mastercard Foundation Scholarship",
    country: "Canada",
    level: "Undergraduate",
    deadline: "2026-02-15",
    funding: "Full Funding",
  },
  {
    id: 2,
    title: "DAAD Scholarship",
    country: "Germany",
    level: "Masters",
    deadline: "2026-03-01",
    funding: "Fully Funded",
  },
  {
    id: 3,
    title: "Commonwealth Scholarship",
    country: "UK",
    level: "PhD",
    deadline: "2026-01-30",
    funding: "Full Funding",
  },
];

export default function Scholarships() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Scholarships
      </Title>

      <Grid>
        {scholarships.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{item.title}</Text>
                <Badge>{item.funding}</Badge>
              </Group>

              <Text size="sm">Country: {item.country}</Text>
              <Text size="sm">Level: {item.level}</Text>
              <Text size="sm" mb="md">
                Deadline: {item.deadline}
              </Text>

              <Button fullWidth>
                View Details
              </Button>

            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}