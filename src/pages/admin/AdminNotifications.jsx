import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Divider,
  SimpleGrid,
  Badge,
  Modal,
  Table,
  ScrollArea,
  Checkbox,
} from "@mantine/core";
import {
  IconSend,
  IconCheck,
  IconX,
  IconUsers,
  IconMail,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import {
  sendBroadcastNotification,
  sendNotificationToUsers,
  getNotificationStats,
} from "../../utils/notificationApi";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    totalPending: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    recipientType: "all", // all, students, specific
    selectedUsers: [],
    sendEmail: true,
  });

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getNotificationStats();
      if (data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!formData.subject || !formData.message) {
      addNotification({
        title: "Validation Error",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setSending(true);
    try {
      await sendBroadcastNotification({
        subject: formData.subject,
        message: formData.message,
        sendEmail: formData.sendEmail,
      });

      addNotification({
        title: "Notification Sent",
        message: "Broadcast notification has been sent successfully.",
        type: "success",
      });

      // Reset form
      setFormData({
        subject: "",
        message: "",
        recipientType: "all",
        selectedUsers: [],
        sendEmail: true,
      });

      loadStats();
    } catch (error) {
      addNotification({
        title: "Send Failed",
        message: "Failed to send notification. Please try again.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendToUsers = async () => {
    if (selectedUsers.length === 0) {
      addNotification({
        title: "Validation Error",
        message: "Please select at least one recipient.",
        type: "error",
      });
      return;
    }

    if (!formData.subject || !formData.message) {
      addNotification({
        title: "Validation Error",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setSending(true);
    try {
      await sendNotificationToUsers({
        userIds: selectedUsers,
        subject: formData.subject,
        message: formData.message,
        sendEmail: formData.sendEmail,
      });

      addNotification({
        title: "Notification Sent",
        message: `Notification sent to ${selectedUsers.length} user(s) successfully.`,
        type: "success",
      });

      // Reset form
      setFormData({
        subject: "",
        message: "",
        recipientType: "all",
        selectedUsers: [],
        sendEmail: true,
      });
      setSelectedUsers([]);

      loadStats();
    } catch (error) {
      addNotification({
        title: "Send Failed",
        message: "Failed to send notification. Please try again.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    if (formData.recipientType === "all") {
      handleSendBroadcast();
    } else {
      handleSendToUsers();
    }
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
              Admin Notification Management
            </Title>
            <Text
              size={{ base: "sm", sm: "md" }}
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
              }}
            >
              Send announcements and notifications to users
            </Text>
          </div>

          <Button
            variant="light"
            size="sm"
            radius="lg"
            onClick={loadStats}
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
            Refresh Stats
          </Button>
        </Group>
      </Card>

      {/* STATISTICS */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Emails Sent
            </Text>
            <Text fw={800} size="xl" c="green">
              {stats.totalSent}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Failed
            </Text>
            <Text fw={800} size="xl" c="red">
              {stats.totalFailed}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Pending
            </Text>
            <Text fw={800} size="xl" c="orange">
              {stats.totalPending}
            </Text>
          </Stack>
        </Card>
        <Card withBorder radius="lg" p="md">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>
              Total Users
            </Text>
            <Text fw={800} size="xl" c="blue">
              {users.length}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* NOTIFICATION FORM */}
      <Card withBorder radius="xl" p="lg" style={{ position: "relative" }}>
        <LoadingOverlay visible={sending} />
        
        <Stack gap="lg">
          <div>
            <Title order={3} mb="xs">
              Send Notification
            </Title>
            <Text size="sm" c="dimmed">
              Compose and send notifications to users
            </Text>
          </div>

          <Divider />

          <Stack gap="md">
            <Textarea
              label="Subject"
              placeholder="Enter notification subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              minRows={1}
            />

            <Textarea
              label="Message"
              placeholder="Enter notification message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              minRows={6}
            />

            <Select
              label="Recipients"
              value={formData.recipientType}
              onChange={(value) =>
                setFormData({ ...formData, recipientType: value })
              }
              data={[
                { value: "all", label: "All Users" },
                { value: "students", label: "Students Only" },
                { value: "specific", label: "Specific Users" },
              ]}
            />

            {formData.recipientType === "specific" && (
              <Card withBorder radius="md" p="md">
                <Text size="sm" fw={600} mb="sm">
                  Select Users
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  Choose specific users to send this notification to
                </Text>
                <ScrollArea h={200}>
                  <Stack gap="xs">
                    {users.map((user) => (
                      <Checkbox
                        key={user._id}
                        label={`${user.name} (${user.email})`}
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user._id)
                            );
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </ScrollArea>
              </Card>
            )}

            <Checkbox
              label="Send as email"
              description="Send this notification via email to recipients"
              checked={formData.sendEmail}
              onChange={(e) =>
                setFormData({ ...formData, sendEmail: e.target.checked })
              }
            />

            <Group justify="flex-end" gap="sm">
              <Button
                variant="light"
                onClick={() => navigate("/admin-dashboard")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                loading={sending}
                leftSection={<IconSend size={16} />}
                styles={{
                  root: {
                    background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)",
                    },
                  },
                }}
              >
                Send Notification
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}