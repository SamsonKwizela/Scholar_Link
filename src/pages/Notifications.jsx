import { useState, useEffect } from "react";
import {
  Container,
  Card,
  SimpleGrid,
  Badge,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Tabs,
  LoadingOverlay,
  Alert,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconTrash,
  IconRefresh,
  IconMail,
  IconSettings,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useDataManager } from "../utils/dataManager";
import NotificationCard from "../components/NotificationCard";
import EmailPreferenceForm from "../components/EmailPreferenceForm";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../utils/notificationApi";

export default function Notifications() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { unreadCount, setUnreadCount } = useNotifications();
  const dataManager = useDataManager();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      // Ensure notifications is always an array
      setNotifications(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      addNotification({
        title: "Error",
        message: "Failed to load notifications. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => {
        // Ensure prev is an array before using map
        const notificationList = Array.isArray(prev) ? prev : [];
        return notificationList.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        );
      });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => {
        // Ensure prev is an array before using map
        const notificationList = Array.isArray(prev) ? prev : [];
        return notificationList.map((notif) => ({ ...notif, read: true }));
      });
      setUnreadCount(0);
      addNotification({
        title: "Success",
        message: "All notifications marked as read.",
        type: "success",
      });
    } catch (error) {
      addNotification({
        title: "Error",
        message: "Failed to mark all notifications as read.",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => {
        // Ensure prev is an array before using filter
        const notificationList = Array.isArray(prev) ? prev : [];
        return notificationList.filter((notif) => notif._id !== id);
      });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Ensure notifications is always an array before using array methods
  const notificationList = Array.isArray(notifications) ? notifications : [];

  const filteredNotifications = notificationList.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.read;
    return notif.type === activeTab;
  });

  const getTabCount = (tab) => {
    if (tab === "all") return notificationList.length;
    if (tab === "unread") return notificationList.filter((n) => !n.read).length;
    return notificationList.filter((n) => n.type === tab).length;
  };

  return (
    <Container fluid>
      {/* HEADER */}
      <Card
        radius="xl"
        p={{ base: "md", sm: "xl" }}
        mb="xl"
        withBorder
        className="animate-fade-in"
        style={{
          background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)",
          border: "none",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, var(--primary-200) 0%, transparent 70%)",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        <Group justify="space-between" align={{ base: "flex-start", sm: "center" }}>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <Title
              order={{ base: 3, sm: 2 }}
              fw={800}
              style={{
                letterSpacing: "-0.02em",
                marginBottom: "8px",
                color: "white",
              }}
            >
              Notification Center
            </Title>
            <Text
              size={{ base: "sm", sm: "md" }}
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
              }}
            >
              Stay updated with scholarships, internships, and application status
            </Text>
          </div>

          <Group gap="sm">
            <Button
              variant="light"
              size="sm"
              radius="lg"
              onClick={() => navigate("/email-settings")}
              leftSection={<IconSettings size={16} />}
              styles={{
                root: {
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.15)",
                  },
                },
              }}
            >
              Email Settings
            </Button>
            <Button
              variant="light"
              size="sm"
              radius="lg"
              onClick={loadNotifications}
              leftSection={<IconRefresh size={16} />}
              styles={{
                root: {
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.15)",
                  },
                },
              }}
            >
              Refresh
            </Button>
          </Group>
        </Group>
      </Card>

      {/* STATISTICS */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Total Notifications
            </Text>
            <Text fw={800} size="xl" c="blue">
              {notifications.length}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Unread
            </Text>
            <Text fw={800} size="xl" c="orange">
              {unreadCount}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Scholarships
            </Text>
            <Text fw={800} size="xl" c="green">
              {getTabCount("scholarship")}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Internships
            </Text>
            <Text fw={800} size="xl" c="cyan">
              {getTabCount("internship")}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* NOTIFICATIONS LIST */}
      <Card withBorder radius="xl" p="lg">
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="pills"
          mb="lg"
        >
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconMail size={16} />}>
              All ({getTabCount("all")})
            </Tabs.Tab>
            <Tabs.Tab value="unread" leftSection={<IconAlertCircle size={16} />}>
              Unread ({getTabCount("unread")})
            </Tabs.Tab>
            <Tabs.Tab value="scholarship">
              Scholarships ({getTabCount("scholarship")})
            </Tabs.Tab>
            <Tabs.Tab value="internship">
              Internships ({getTabCount("internship")})
            </Tabs.Tab>
            <Tabs.Tab value="application">
              Applications ({getTabCount("application")})
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {unreadCount > 0 && (
          <Button
            variant="light"
            size="sm"
            mb="md"
            onClick={handleMarkAllAsRead}
            leftSection={<IconCheck size={16} />}
          >
            Mark All as Read
          </Button>
        )}

        {loading ? (
          <LoadingOverlay visible={loading} />
        ) : filteredNotifications.length === 0 ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="No Notifications"
            color="blue"
            variant="light"
          >
            {activeTab === "all"
              ? "You don't have any notifications yet."
              : `No ${activeTab} notifications found.`}
          </Alert>
        ) : (
          <Stack gap="md">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification._id)}
                onDelete={() => handleDelete(notification._id)}
              />
            ))}
          </Stack>
        )}
      </Card>
    </Container>
  );
}