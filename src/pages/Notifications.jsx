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
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Notifications</Title>
        
        <Group>
          {notifications.length > 0 && (
            <>
              <Button size="xs" variant="light" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
              <Button size="xs" variant="outline" color="red" onClick={clearNotifications}>
                Clear All
              </Button>
            </>
          )}
        </Group>
      </Group>

      {notifications.length === 0 ? (
        <Card withBorder padding="lg" radius="md">
          <Text c="dimmed" ta="center">
            No notifications yet
          </Text>
        </Card>
      ) : (
        <Stack gap="md">
          {notifications.map((note) => (
            <Card
              key={note.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ 
                backgroundColor: note.status === 'unread' ? 'var(--mantine-color-blue-0)' : 'transparent'
              }}
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
                        : note.type === "error"
                        ? "red"
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
                  <Button 
                    size="xs" 
                    variant="light"
                    onClick={() => markAsRead(note.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}