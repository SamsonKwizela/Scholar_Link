import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  LoadingOverlay,
  Alert,
  Divider,
  SimpleGrid,
} from "@mantine/core";
import {
  IconCheck,
  IconMail,
  IconSchool,
  IconBriefcase,
  IconClock,
  IconFileText,
  IconBell,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import EmailPreferenceForm from "../components/EmailPreferenceForm";
import {
  getEmailPreferences,
  updateEmailPreferences,
} from "../utils/notificationApi";

export default function EmailNotificationSettings() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    receiveScholarshipEmails: true,
    receiveInternshipEmails: true,
    receiveDeadlineReminders: true,
    receiveApplicationUpdates: true,
    receiveAdminMessages: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await getEmailPreferences();
      if (data.data) {
        setPreferences(data.data);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEmailPreferences(preferences);
      addNotification({
        title: "Preferences Saved",
        message: "Your email notification preferences have been updated successfully.",
        type: "success",
      });
    } catch (error) {
      addNotification({
        title: "Save Failed",
        message: "Failed to save preferences. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
              Email Notification Settings
            </Title>
            <Text
              size={{ base: "sm", sm: "md" }}
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
              }}
            >
              Manage your email notification preferences
            </Text>
          </div>

          <Button
            variant="light"
            size="sm"
            radius="lg"
            onClick={() => navigate("/notifications")}
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
            Back to Notifications
          </Button>
        </Group>
      </Card>

      {/* SETTINGS FORM */}
      <Card withBorder radius="xl" p="lg" style={{ position: "relative" }}>
        <LoadingOverlay visible={loading || saving} />
        
        <Stack gap="lg">
          <div>
            <Title order={3} mb="xs">
              Email Preferences
            </Title>
            <Text size="sm" c="dimmed">
              Choose which email notifications you want to receive. You can change these settings at any time.
            </Text>
          </div>

          <Divider />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <IconSchool size={24} color="var(--primary-600)" />
                <div>
                  <Text fw={600} size="md">
                    Scholarship Notifications
                  </Text>
                  <Text size="xs" c="dimmed">
                    New opportunities and updates
                  </Text>
                </div>
              </Group>
              <Button
                variant={preferences.receiveScholarshipEmails ? "filled" : "light"}
                color="blue"
                size="sm"
                fullWidth
                onClick={() => handleToggle("receiveScholarshipEmails")}
              >
                {preferences.receiveScholarshipEmails ? "Enabled" : "Disabled"}
              </Button>
            </Card>

            <Card withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <IconBriefcase size={24} color="cyan" />
                <div>
                  <Text fw={600} size="md">
                    Internship Notifications
                  </Text>
                  <Text size="xs" c="dimmed">
                    New opportunities and updates
                  </Text>
                </div>
              </Group>
              <Button
                variant={preferences.receiveInternshipEmails ? "filled" : "light"}
                color="cyan"
                size="sm"
                fullWidth
                onClick={() => handleToggle("receiveInternshipEmails")}
              >
                {preferences.receiveInternshipEmails ? "Enabled" : "Disabled"}
              </Button>
            </Card>

            <Card withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <IconClock size={24} color="orange" />
                <div>
                  <Text fw={600} size="md">
                    Deadline Reminders
                  </Text>
                  <Text size="xs" c="dimmed">
                    Never miss an important deadline
                  </Text>
                </div>
              </Group>
              <Button
                variant={preferences.receiveDeadlineReminders ? "filled" : "light"}
                color="orange"
                size="sm"
                fullWidth
                onClick={() => handleToggle("receiveDeadlineReminders")}
              >
                {preferences.receiveDeadlineReminders ? "Enabled" : "Disabled"}
              </Button>
            </Card>

            <Card withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <IconFileText size={24} color="green" />
                <div>
                  <Text fw={600} size="md">
                    Application Updates
                  </Text>
                  <Text size="xs" c="dimmed">
                    Status changes and responses
                  </Text>
                </div>
              </Group>
              <Button
                variant={preferences.receiveApplicationUpdates ? "filled" : "light"}
                color="green"
                size="sm"
                fullWidth
                onClick={() => handleToggle("receiveApplicationUpdates")}
              >
                {preferences.receiveApplicationUpdates ? "Enabled" : "Disabled"}
              </Button>
            </Card>

            <Card withBorder radius="lg" p="md" style={{ gridColumn: "1 / -1" }}>
              <Group gap="sm" mb="sm">
                <IconBell size={24} color="red" />
                <div>
                  <Text fw={600} size="md">
                    Admin Messages
                  </Text>
                  <Text size="xs" c="dimmed">
                    Important announcements and updates
                  </Text>
                </div>
              </Group>
              <Button
                variant={preferences.receiveAdminMessages ? "filled" : "light"}
                color="red"
                size="sm"
                fullWidth
                onClick={() => handleToggle("receiveAdminMessages")}
              >
                {preferences.receiveAdminMessages ? "Enabled" : "Disabled"}
              </Button>
            </Card>
          </SimpleGrid>

          <Divider />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => navigate("/notifications")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              leftSection={<IconCheck size={16} />}
              styles={{
                root: {
                  background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)",
                  },
                },
              }}
            >
              Save Preferences
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}