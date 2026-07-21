import { useState, useEffect } from 'react';
import { 
  Card, 
  Stack, 
  Text, 
  Checkbox, 
  Button, 
  Group, 
  Title,
  LoadingOverlay,
  Alert
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNotifications } from '../context/NotificationContext';
import { getEmailPreferences, updateEmailPreferences } from '../utils/notificationApi';

export default function EmailPreferenceForm() {
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
      console.error('Error loading preferences:', error);
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
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card withBorder radius="lg" p="lg" style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading || saving} />
      
      <Stack gap="md">
        <div>
          <Title order={4} mb="xs">Email Notification Settings</Title>
          <Text size="sm" c="dimmed">
            Choose which email notifications you want to receive
          </Text>
        </div>

        <Stack gap="sm">
          <Checkbox
            label="Receive new scholarship emails"
            description="Get notified when new scholarships are posted"
            checked={preferences.receiveScholarshipEmails}
            onChange={() => handleToggle('receiveScholarshipEmails')}
          />

          <Checkbox
            label="Receive internship notifications"
            description="Get notified about new internship opportunities"
            checked={preferences.receiveInternshipEmails}
            onChange={() => handleToggle('receiveInternshipEmails')}
          />

          <Checkbox
            label="Receive deadline reminders"
            description="Get reminded before application deadlines"
            checked={preferences.receiveDeadlineReminders}
            onChange={() => handleToggle('receiveDeadlineReminders')}
          />

          <Checkbox
            label="Receive application status updates"
            description="Get notified when your application status changes"
            checked={preferences.receiveApplicationUpdates}
            onChange={() => handleToggle('receiveApplicationUpdates')}
          />

          <Checkbox
            label="Receive admin messages"
            description="Get notified about important announcements from admin"
            checked={preferences.receiveAdminMessages}
            onChange={() => handleToggle('receiveAdminMessages')}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button
            onClick={handleSave}
            loading={saving}
            leftSection={<IconCheck size={16} />}
            styles={{
              root: {
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                }
              }
            }}
          >
            Save Preferences
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}