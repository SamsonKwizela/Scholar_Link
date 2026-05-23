import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Button,
} from "@mantine/core";

const notifications = [
  {
    id: 1,
    title: "Application Submitted",
    message: "Your DAAD Scholarship application was submitted successfully.",
    type: "success",
    status: "unread",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Assessment Reminder",
    message: "You have an ongoing English Proficiency Assessment.",
    type: "warning",
    status: "unread",
    time: "1 day ago",
  },
  {
    id: 3,
    title: "Result Available",
    message: "Your General Knowledge Test result is now available.",
    type: "info",
    status: "read",
    time: "3 days ago",
  },
];

export default function Notifications() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Notifications
      </Title>

      <Stack gap="md">
        {notifications.map((note) => (
          <Card
            key={note.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600}>{note.title}</Text>

              <Group>
                <Badge
                  color={
                    note.type === "success"
                      ? "green"
                      : note.type === "warning"
                      ? "yellow"
                      : "blue"
                  }
                >
                  {note.type}
                </Badge>

                {note.status === "unread" && (
                  <Badge color="red">New</Badge>
                )}
              </Group>
            </Group>

            <Text size="sm" c="dimmed">
              {note.message}
            </Text>

            <Group justify="space-between" mt="md">
              <Text size="xs" c="gray">
                {note.time}
              </Text>

              {note.status === "unread" && (
                <Button size="xs" variant="light">
                  Mark as read
                </Button>
              )}
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}