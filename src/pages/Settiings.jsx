import {
  Container,
  Title,
  Card,
  Text,
  TextInput,
  Group,
  Button,
  Switch,
  Stack,
  Divider,
} from "@mantine/core";

export default function Settings() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Settings
      </Title>

      {/* PROFILE SETTINGS */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Title order={4} mb="sm">
          Profile Information
        </Title>

        <Stack>
          <TextInput label="Full Name" placeholder="Enter your name" />
          <TextInput label="Email" placeholder="Enter your email" />
          <TextInput label="Phone Number" placeholder="+260..." />
        </Stack>
      </Card>

      {/* ACCOUNT SETTINGS */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Title order={4} mb="sm">
          Account Settings
        </Title>

        <Stack>
          <TextInput type="password" label="New Password" />
          <TextInput type="password" label="Confirm Password" />
        </Stack>
      </Card>

      {/* NOTIFICATIONS */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Title order={4} mb="sm">
          Notifications
        </Title>

        <Stack>
          <Group justify="space-between">
            <Text>Email Notifications</Text>
            <Switch defaultChecked />
          </Group>

          <Group justify="space-between">
            <Text>Assessment Reminders</Text>
            <Switch defaultChecked />
          </Group>

          <Group justify="space-between">
            <Text>Application Updates</Text>
            <Switch />
          </Group>
        </Stack>
      </Card>

      <Divider my="md" />

      {/* SAVE BUTTON */}
      <Group justify="flex-end">
        <Button size="md">
          Save Changes
        </Button>
      </Group>
    </Container>
  );
}