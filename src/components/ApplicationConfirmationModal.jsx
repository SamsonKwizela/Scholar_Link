import {
  Modal,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Badge,
  Divider,
  Alert,
  Loader,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconBriefcase, IconSchool } from '@tabler/icons-react';

export default function ApplicationConfirmationModal({
  opened,
  onClose,
  onConfirm,
  opportunity,
  loading,
}) {
  if (!opportunity) return null;

  const isScholarship = opportunity.field || opportunity.category || opportunity.amount;
  const icon = isScholarship ? <IconSchool size={24} /> : <IconBriefcase size={24} />;
  const type = isScholarship ? 'Scholarship' : 'Internship';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Application"
      size="md"
      centered
      withCloseButton={!loading}
    >
      <Stack gap="lg">
        <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
          <Text size="sm">
            Please review the details below before confirming your application submission.
          </Text>
        </Alert>

        <Card withBorder padding="md">
          <Group gap="md" align="flex-start">
            <div style={{ color: 'var(--mantine-color-blue-6)' }}>{icon}</div>
            <Stack gap={0} style={{ flex: 1 }}>
              <Title order={5}>{opportunity.title || opportunity.name}</Title>
              <Text size="sm" c="dimmed">
                {opportunity.provider || opportunity.company}
              </Text>
              <Group gap="xs" mt="xs">
                {opportunity.field && (
                  <Badge size="sm" variant="light">
                    {opportunity.field}
                  </Badge>
                )}
                {opportunity.location && (
                  <Badge size="sm" variant="light">
                    {typeof opportunity.location === 'object'
                      ? `${opportunity.location.city}, ${opportunity.location.country}`
                      : opportunity.location}
                  </Badge>
                )}
                {opportunity.amount && (
                  <Badge size="sm" color="green" variant="light">
                    {opportunity.amount}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Group>
        </Card>

        <Divider />

        <Stack gap="sm">
          <Text size="sm" fw={600}>
            Application Details:
          </Text>
          <Group gap="xs">
            <IconCheck size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm">Your profile information will be submitted</Text>
          </Group>
          <Group gap="xs">
            <IconCheck size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm">Application status will be set to "Pending"</Text>
          </Group>
          <Group gap="xs">
            <IconCheck size={16} color="var(--mantine-color-green-6)" />
            <Text size="sm">You will receive updates on your application status</Text>
          </Group>
        </Stack>

        <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
          <Text size="sm">
            By confirming, you agree to submit your application for this {type.toLowerCase()}.
            This action cannot be undone.
          </Text>
        </Alert>

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            color="blue"
          >
            {loading ? 'Submitting...' : 'Confirm Application'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
