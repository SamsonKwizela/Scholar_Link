import { useState, useEffect } from 'react';
import { 
  ActionIcon, 
  Badge, 
  Popover, 
  Stack, 
  Text, 
  Button,
  Group,
  Loader,
  Center
} from '@mantine/core';
import { IconBell, IconCheck, IconTrash, IconExternalLink } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../utils/notificationApi';
import NotificationCard from './NotificationCard';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { unreadCount, setUnreadCount } = useNotifications();
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      loadNotifications();
    }
  }, [opened]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      // Ensure notifications is always an array
      setNotifications(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => {
        // Ensure prev is an array before using map
        const notificationList = Array.isArray(prev) ? prev : [];
        return notificationList.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        );
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => {
        // Ensure prev is an array before using filter
        const notificationList = Array.isArray(prev) ? prev : [];
        return notificationList.filter(notif => notif._id !== id);
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleViewAll = () => {
    setOpened(false);
    navigate('/notifications');
  };

  // Ensure notifications is always an array before using array methods
  const notificationList = Array.isArray(notifications) ? notifications : [];
  const recentNotifications = notificationList.slice(0, 5);

  return (
    <Popover 
      width={400} 
      position="bottom-end" 
      shadow="lg"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon 
          variant="subtle" 
          size="lg" 
          onClick={() => setOpened(!opened)}
          style={{ position: 'relative' }}
        >
          <IconBell size={20} stroke={1.5} />
          {unreadCount > 0 && (
            <Badge 
              size="xs" 
              color="red" 
              variant="filled" 
              circle
              style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0,
                minWidth: '16px',
                height: '16px',
                padding: '0 4px',
                fontSize: '10px'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown p="md">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={700} size="md">Notifications</Text>
            {unreadCount > 0 && (
              <Text size="xs" c="dimmed">{unreadCount} unread</Text>
            )}
          </Group>

          {loading ? (
            <Center py="xl">
              <Loader size="sm" />
            </Center>
          ) : recentNotifications.length === 0 ? (
            <Center py="xl">
              <Text size="sm" c="dimmed">No notifications yet</Text>
            </Center>
          ) : (
            <Stack gap="xs" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification._id)}
                  onDelete={() => handleDelete(notification._id)}
                  compact
                />
              ))}
            </Stack>
          )}

          {notifications.length > 5 && (
            <Button 
              variant="light" 
              size="xs" 
              fullWidth
              onClick={handleViewAll}
              rightSection={<IconExternalLink size={14} />}
            >
              View All Notifications
            </Button>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}