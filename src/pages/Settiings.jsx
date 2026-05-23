import {
  Box,
  Container,
  Card,
  Grid,
  Stack,
  Title,
  Text,
  Switch,
  Group,
  Button,
  TextInput,
  Select,
  Divider,
  Badge,
  LoadingOverlay,
} from "@mantine/core";

import {
  IconBell,
  IconShieldLock,
  IconGlobe,
  IconPalette,
  IconDeviceFloppy,
} from "@tabler/icons-react";

import { useForm } from "@mantine/form";
import { useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      darkMode: false,
      emailNotifications: true,
      pushNotifications: true,
      language: "English",
      themeColor: "blue",
      twoFactor: false,
      email: "",
      password: "",
    },
  });

  const saveSettings = async () => {
    setLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    form.resetDirty();
  };

  const isDirty = form.isDirty();

  return (
    <Box style={{ minHeight: "100vh", background: "#f4f7fb", padding: 30 }}>
      <Container size="lg">

        {/* HEADER */}
        <Card radius="xl" p="xl" withBorder shadow="sm" mb="xl">
          <Group justify="space-between">
            <div>
              <Title order={2}>Settings</Title>
              <Text c="dimmed">
                Manage your account preferences and system settings
              </Text>
            </div>

            <Badge size="lg" color="blue">
              User Preferences
            </Badge>
          </Group>
        </Card>

        <Grid gutter="lg">

          {/* LEFT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            {/* APPEARANCE */}
            <Card radius="xl" p="lg" withBorder shadow="sm" mb="lg">
              <Group mb="md">
                <IconPalette size={20} />
                <Title order={4}>Appearance</Title>
              </Group>

              <Stack>
                <Group justify="space-between">
                  <Text>Dark Mode</Text>
                  <Switch
                    {...form.getInputProps("darkMode", { type: "checkbox" })}
                  />
                </Group>

                <Select
                  label="Theme Color"
                  data={["blue", "green", "orange", "red", "violet"]}
                  {...form.getInputProps("themeColor")}
                />
              </Stack>
            </Card>

            {/* NOTIFICATIONS */}
            <Card radius="xl" p="lg" withBorder shadow="sm">
              <Group mb="md">
                <IconBell size={20} />
                <Title order={4}>Notifications</Title>
              </Group>

              <Stack>
                <Group justify="space-between">
                  <Text>Email Notifications</Text>
                  <Switch
                    {...form.getInputProps("emailNotifications", { type: "checkbox" })}
                  />
                </Group>

                <Group justify="space-between">
                  <Text>Push Notifications</Text>
                  <Switch
                    {...form.getInputProps("pushNotifications", { type: "checkbox" })}
                  />
                </Group>
              </Stack>
            </Card>

          </Grid.Col>

          {/* RIGHT */}
          <Grid.Col span={{ base: 12, md: 6 }}>

            {/* SECURITY */}
            <Card radius="xl" p="lg" withBorder shadow="sm" mb="lg">
              <Group mb="md">
                <IconShieldLock size={20} />
                <Title order={4}>Security</Title>
              </Group>

              <Stack>
                <Group justify="space-between">
                  <Text>Two-Factor Authentication</Text>
                  <Switch
                    {...form.getInputProps("twoFactor", { type: "checkbox" })}
                  />
                </Group>

                <Divider />

                <TextInput
                  label="Change Password"
                  placeholder="Enter new password"
                  type="password"
                  {...form.getInputProps("password")}
                />
              </Stack>
            </Card>

            {/* GENERAL */}
            <Card radius="xl" p="lg" withBorder shadow="sm">
              <Group mb="md">
                <IconGlobe size={20} />
                <Title order={4}>General</Title>
              </Group>

              <Stack>
                <TextInput
                  label="Email"
                  placeholder="your email"
                  {...form.getInputProps("email")}
                />

                <Select
                  label="Language"
                  data={["English", "French", "Portuguese", "Spanish"]}
                  {...form.getInputProps("language")}
                />

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  mt="md"
                  onClick={saveSettings}
                  disabled={!isDirty}
                  loading={loading}
                >
                  Save Settings
                </Button>
              </Stack>
            </Card>

          </Grid.Col>
        </Grid>

        {/* GLOBAL LOADER */}
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      </Container>
    </Box>
  );
}