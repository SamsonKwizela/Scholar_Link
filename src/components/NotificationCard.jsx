import { Card, Text, Group, Button, Badge, Stack } from '@mantine/core';
import { IconCheck, IconTrash, IconExternalLink } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationCard({ notification, onMarkAsRead, onDelete, compact = false }) {
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'scholarship':
        return '🎓';
      case 'internship':
        return '💼';
      case 'deadline':
        return '⏰';
      case 'application':
        return '📋';
      case 'admin':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'scholarship':
        return 'blue';
      case 'internship':
        return 'cyan';
      case 'deadline':
        return 'orange';
      case 'application':
        return 'green';
      case 'admin':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (compact) {
    return (
      <Card 
        withBorder 
        radius="md" 
        p="sm" 
        style={{ 
          cursor: notification.link ? 'pointer' : 'default',
          opacity: notification.read ? 0.7 : 1,
          backgroundColor: notification.read ? 'var(--bg-secondary)' : 'var(--bg-primary)'
        }}
        onClick={handleClick}
      >
        <Group gap="sm" wrap="nowrap">
          <Text size="lg">{getNotificationIcon(notification.type)}</Text>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={600} lineClamp={1}>
              {notification.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {notification.message}
            </Text>
          </div>
          {!notification.read && (
            <Badge size="xs" color={getNotificationColor(notification.type)} variant="filled" />
          )}
        </Group>
      </Card>
    );
  }

  return (
    <Card 
      withBorder 
      radius="lg" 
      p="md" 
      style={{ 
        cursor: notification.link ? 'pointer' : 'default',
        opacity: notification.read ? 0.7 : 1,
        borderLeft: notification.read ? 'none' : `3px solid var(--primary-500)`
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Text size="xl">{getNotificationIcon(notification.type)}</Text>
            <div>
              <Badge color={getNotificationColor(notification.type)} size="xs" variant="light">
                {notification.type}
              </Badge>
              <Text fw={600} size="md" mt="xs">
                {notification.title}
              </Text>
            </div>
          </Group>
          {!notification.read && (
            <Button
              size="xs"
              variant="light"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              leftSection={<IconCheck size={14} />}
            >
              Mark as read
            </Button>
          )}
        </Group>

        <Text size="sm" c="dimmed">
          {notification.message}
        </Text>

        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            {new Date(notification.createdAt).toLocaleString()}
          </Text>
          <Group gap="xs">
            {notification.link && (
              <Button
                size="xs"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(notification.link);
                }}
                rightSection={<IconExternalLink size={14} />}
              >
                View
              </Button>
            )}
            <Button
              size="xs"
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}