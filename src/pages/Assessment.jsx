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

const assessments = [
  {
    id: 1,
    title: "Scholarship Eligibility Test",
    type: "Aptitude",
    status: "Not Started",
    duration: "30 mins",
  },
  {
    id: 2,
    title: "English Proficiency Assessment",
    type: "Language",
    status: "In Progress",
    duration: "45 mins",
  },
  {
    id: 3,
    title: "General Knowledge Test",
    type: "Quiz",
    status: "Completed",
    score: "78%",
    duration: "20 mins",
  },
];

export default function Assessments() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Assessments
      </Title>

      <Grid>
        {assessments.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>

              <Group justify="space-between" mb="xs">
                <Text fw={600}>{item.title}</Text>

                <Badge
                  color={
                    item.status === "Completed"
                      ? "green"
                      : item.status === "In Progress"
                      ? "blue"
                      : "gray"
                  }
                >
                  {item.status}
                </Badge>
              </Group>

              <Text size="sm">Type: {item.type}</Text>
              <Text size="sm">Duration: {item.duration}</Text>

              {item.score && (
                <Text size="sm" mt="xs">
                  Score: <b>{item.score}</b>
                </Text>
              )}

              <Button
                fullWidth
                mt="md"
                variant={
                  item.status === "Completed" ? "light" : "filled"
                }
              >
                {item.status === "Completed"
                  ? "View Result"
                  : item.status === "In Progress"
                  ? "Continue"
                  : "Start Assessment"}
              </Button>

            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}