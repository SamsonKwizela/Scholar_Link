import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  Alert,
  Loader,
  SimpleGrid,
  Table,
  Modal,
} from "@mantine/core";
import { IconAlertCircle, IconSend, IconCheck, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [excludeAdmins, setExcludeAdmins] = useState(true);
  const [notificationType, setNotificationType] = useState("general");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [resultsModalOpened, setResultsModalOpened] = useState(false);

  // Email data fields based on notification type
  const [emailData, setEmailData] = useState({
    scholarshipTitle: "",
    scholarshipAmount: "",
    scholarshipField: "",
    internshipTitle: "",
    company: "",
    location: "",
    assessmentTitle: "",
    subject: "",
    duration: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/admin/users");
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSendNotification = async () => {
    if (!title || !message) {
      setError("Title and message are required");
      return;
    }

    if (!sendToAll && selectedUsers.length === 0) {
      setError("Please select users or send to all users");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title,
        message,
        type: notificationType,
        notificationType: notificationType,
        emailData: {},
      };

      // Add email data based on notification type
      if (notificationType === "scholarship") {
        payload.emailData = {
          scholarshipTitle: emailData.scholarshipTitle,
          scholarshipAmount: emailData.scholarshipAmount,
          scholarshipField: emailData.scholarshipField,
        };
      } else if (notificationType === "internship") {
        payload.emailData = {
          internshipTitle: emailData.internshipTitle,
          company: emailData.company,
          location: emailData.location,
        };
      } else if (notificationType === "assessment") {
        payload.emailData = {
          assessmentTitle: emailData.assessmentTitle,
          subject: emailData.subject,
          duration: emailData.duration,
        };
      }

      let response;
      if (sendToAll) {
        payload.excludeAdmins = excludeAdmins;
        response = await apiRequest("/notifications/send-all", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        payload.users = selectedUsers;
        response = await apiRequest("/notifications/send", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setResults(response.data);
      setResultsModalOpened(true);
      setSuccess("Notification sent successfully!");
      
      // Reset form
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
      setEmailData({
        scholarshipTitle: "",
        scholarshipAmount: "",
        scholarshipField: "",
        internshipTitle: "",
        company: "",
        location: "",
        assessmentTitle: "",
        subject: "",
        duration: "",
      });
    } catch (err) {
      setError(err.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user._id,
    label: `${user.name} (${user.email}) - ${user.role}`,
  }));

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        Send Notifications
      </Title>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      {success && (
        <Alert icon={<IconCheck size={16} />} color="green" mb="xl">
          {success}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        {/* Notification Form */}
        <Card withBorder shadow="sm" padding="lg">
          <Stack gap="md">
            <Title order={4}>Compose Notification</Title>

            <Select
              label="Notification Type"
              placeholder="Select type"
              data={[
                { value: "general", label: "General Announcement" },
                { value: "scholarship", label: "New Scholarship" },
                { value: "internship", label: "New Internship" },
                { value: "assessment", label: "New Assessment" },
              ]}
              value={notificationType}
              onChange={setNotificationType}
              required
            />

            <TextInput
              label="Title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="Message"
              placeholder="Notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={4}
              required
            />

            {/* Type-specific email data */}
            {notificationType === "scholarship" && (
              <Stack gap="xs" p="md" withBorder>
                <Text fw={600} size="sm">
                  Scholarship Details (for email)
                </Text>
                <TextInput
                  label="Scholarship Title"
                  placeholder="Scholarship title"
                  value={emailData.scholarshipTitle}
                  onChange={(e) =>
                    setEmailData({ ...emailData, scholarshipTitle: e.target.value })
                  }
                />
                <TextInput
                  label="Amount"
                  placeholder="$10,000"
                  value={emailData.scholarshipAmount}
                  onChange={(e) =>
                    setEmailData({ ...emailData, scholarshipAmount: e.target.value })
                  }
                />
                <TextInput
                  label="Field"
                  placeholder="Engineering, Business, etc."
                  value={emailData.scholarshipField}
                  onChange={(e) =>
                    setEmailData({ ...emailData, scholarshipField: e.target.value })
                  }
                />
              </Stack>
            )}

            {notificationType === "internship" && (
              <Stack gap="xs" p="md" withBorder>
                <Text fw={600} size="sm">
                  Internship Details (for email)
                </Text>
                <TextInput
                  label="Internship Title"
                  placeholder="Internship title"
                  value={emailData.internshipTitle}
                  onChange={(e) =>
                    setEmailData({ ...emailData, internshipTitle: e.target.value })
                  }
                />
                <TextInput
                  label="Company"
                  placeholder="Company name"
                  value={emailData.company}
                  onChange={(e) =>
                    setEmailData({ ...emailData, company: e.target.value })
                  }
                />
                <TextInput
                  label="Location"
                  placeholder="Remote, New York, etc."
                  value={emailData.location}
                  onChange={(e) =>
                    setEmailData({ ...emailData, location: e.target.value })
                  }
                />
              </Stack>
            )}

            {notificationType === "assessment" && (
              <Stack gap="xs" p="md" withBorder>
                <Text fw={600} size="sm">
                  Assessment Details (for email)
                </Text>
                <TextInput
                  label="Assessment Title"
                  placeholder="Assessment title"
                  value={emailData.assessmentTitle}
                  onChange={(e) =>
                    setEmailData({ ...emailData, assessmentTitle: e.target.value })
                  }
                />
                <TextInput
                  label="Subject"
                  placeholder="Mathematics, Psychology, etc."
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                />
                <TextInput
                  label="Duration (minutes)"
                  placeholder="30"
                  value={emailData.duration}
                  onChange={(e) =>
                    setEmailData({ ...emailData, duration: e.target.value })
                  }
                />
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Recipient Selection */}
        <Card withBorder shadow="sm" padding="lg">
          <Stack gap="md">
            <Title order={4}>Recipients</Title>

            <Checkbox
              label="Send to all users"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.currentTarget.checked)}
            />

            {sendToAll && (
              <Checkbox
                label="Exclude admins"
                checked={excludeAdmins}
                onChange={(e) => setExcludeAdmins(e.currentTarget.checked)}
              />
            )}

            {!sendToAll && (
              <MultiSelect
                label="Select Users"
                placeholder="Choose users to send notification"
                data={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                searchable
                nothingFoundMessage="No users found"
                maxDropdownHeight={200}
              />
            )}

            {!sendToAll && (
              <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                <Text size="sm">
                  Selected: {selectedUsers.length} user(s)
                </Text>
              </Alert>
            )}

            {sendToAll && (
              <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                <Text size="sm">
                  Will send to {excludeAdmins ? users.filter(u => u.role !== 'admin').length : users.length} user(s)
                </Text>
              </Alert>
            )}

            <Button
              fullWidth
              leftSection={<IconSend size={16} />}
              onClick={handleSendNotification}
              loading={sending}
              disabled={sending}
              color="blue"
            >
              {sending ? "Sending..." : "Send Notification"}
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Results Modal */}
      <Modal
        opened={resultsModalOpened}
        onClose={() => setResultsModalOpened(false)}
        title="Notification Results"
        size="md"
        centered
      >
        {results && (
          <Stack gap="md">
            <Alert icon={<IconCheck size={16} />} color="green">
              Notification processing completed
            </Alert>

            <SimpleGrid cols={2}>
              <Card withBorder p="sm">
                <Text size="sm" c="dimmed">Total Users</Text>
                <Text fw={700} size="lg">{results.total}</Text>
              </Card>
              <Card withBorder p="sm">
                <Text size="sm" c="dimmed">Notifications Created</Text>
                <Text fw={700} size="lg" c="blue">{results.notificationsCreated}</Text>
              </Card>
              <Card withBorder p="sm">
                <Text size="sm" c="dimmed">Emails Sent</Text>
                <Text fw={700} size="lg" c="green">{results.emailsSent}</Text>
              </Card>
              <Card withBorder p="sm">
                <Text size="sm" c="dimmed">Emails Failed</Text>
                <Text fw={700} size="lg" c="red">{results.emailsFailed}</Text>
              </Card>
            </SimpleGrid>

            {results.errors && results.errors.length > 0 && (
              <>
                <Title order={5}>Errors</Title>
                <Card withBorder p="sm" style={{ maxHeight: 200, overflow: "auto" }}>
                  <Stack gap="xs">
                    {results.errors.map((err, index) => (
                      <Text key={index} size="sm" c="red">
                        {err.userId ? `User ${err.userId}: ` : ""}{err.error}
                      </Text>
                    ))}
                  </Stack>
                </Card>
              </>
            )}

            <Button onClick={() => setResultsModalOpened(false)}>
              Close
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
