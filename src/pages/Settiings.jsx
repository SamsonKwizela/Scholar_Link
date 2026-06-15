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
  Tabs,
  PasswordInput,
  NumberInput,
  Slider,
  SegmentedControl,
  Alert,
  ActionIcon,
  Tooltip,
  Progress,
  Checkbox,
  Radio,
  Textarea,
} from "@mantine/core";

import {
  IconBell,
  IconShieldLock,
  IconGlobe,
  IconPalette,
  IconDeviceFloppy,
  IconUser,
  IconDatabase,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconRefresh,
  IconAlertTriangle,
  IconCheck,
  IconSettings,
  IconLock,
  IconKey,
  IconBuilding,
  IconClock,
  IconLanguage,
  IconAccessible,
} from "@tabler/icons-react";

import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";

export default function SettingsPage() {
  const { isDark, toggleDark } = useTheme();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);

  // Load settings from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      // General
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      
      // Appearance
      themeColor: "blue",
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
      
      // Notifications
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notificationSound: true,
      desktopNotifications: true,
      digestFrequency: "daily",
      
      // Privacy
      profileVisibility: "public",
      showOnlineStatus: true,
      allowDataCollection: false,
      shareAnalytics: false,
      
      // Security
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordStrength: "medium",
      
      // Account
      currentEmail: "samson@example.com",
      username: "samsonkwizela",
    };
  });

  // Calculate storage usage
  useEffect(() => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    setStorageUsed((total / 1024 / 1024).toFixed(2)); // Convert to MB
  }, []);

  // Save settings to localStorage
  const saveSettings = async (section) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    addNotification({
      title: "Settings Saved",
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
      type: "success",
    });
    
    setLoading(false);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all local data? This action cannot be undone.")) {
      localStorage.clear();
      addNotification({
        title: "Data Cleared",
        message: "All local data has been cleared successfully.",
        type: "warning",
      });
      window.location.reload();
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scholarlink-settings.json';
    link.click();
    addNotification({
      title: "Settings Exported",
      message: "Your settings have been exported successfully.",
      type: "success",
    });
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setSettings(imported);
          localStorage.setItem('appSettings', JSON.stringify(imported));
          addNotification({
            title: "Settings Imported",
            message: "Your settings have been imported successfully.",
            type: "success",
          });
        } catch (error) {
          addNotification({
            title: "Import Failed",
            message: "Invalid settings file format.",
            type: "error",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box className="app-page">
      <Container size="xl">
        
        {/* HEADER */}
        <Card radius="xl" p="xl" withBorder shadow="sm" mb="xl">
          <Group justify="space-between">
            <div>
              <Title order={2}>Settings</Title>
              <Text c="dimmed">
                Manage your account preferences, security, and application settings
              </Text>
            </div>
            <Group>
              <Badge size="lg" color="blue" variant="light">
                <IconSettings size={14} style={{ marginRight: 4 }} />
                Advanced Settings
              </Badge>
            </Group>
          </Group>
        </Card>

        {/* SETTINGS TABS */}
        <Card radius="xl" withBorder shadow="sm" p={0}>
          <Tabs defaultValue="general" value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="general" leftSection={<IconGlobe size={16} />}>
                General
              </Tabs.Tab>
              <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
                Appearance
              </Tabs.Tab>
              <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
                Notifications
              </Tabs.Tab>
              <Tabs.Tab value="privacy" leftSection={<IconEye size={16} />}>
                Privacy
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<IconShieldLock size={16} />}>
                Security
              </Tabs.Tab>
              <Tabs.Tab value="account" leftSection={<IconUser size={16} />}>
                Account
              </Tabs.Tab>
              <Tabs.Tab value="data" leftSection={<IconDatabase size={16} />}>
                Data
              </Tabs.Tab>
            </Tabs.List>

            {/* GENERAL SETTINGS */}
            <Tabs.Panel value="general" p="xl">
              <Stack gap="xl">
                
                {/* Language & Region */}
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconLanguage size={20} />
                    <Title order={4}>Language & Region</Title>
                  </Group>
                  <Stack>
                    <Select
                      label="Language"
                      data={[
                        { value: 'en', label: 'English' },
                        { value: 'fr', label: 'Français' },
                        { value: 'es', label: 'Español' },
                        { value: 'pt', label: 'Português' },
                        { value: 'de', label: 'Deutsch' },
                      ]}
                      value={settings.language}
                      onChange={(value) => handleSettingChange('language', value)}
                    />
                    <Select
                      label="Timezone"
                      data={[
                        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                        { value: 'America/New_York', label: 'Eastern Time (ET)' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                        { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
                        { value: 'Africa/Lusaka', label: 'Central Africa Time (CAT)' },
                      ]}
                      value={settings.timezone}
                      onChange={(value) => handleSettingChange('timezone', value)}
                    />
                    <Group grow>
                      <Select
                        label="Date Format"
                        data={[
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                        ]}
                        value={settings.dateFormat}
                        onChange={(value) => handleSettingChange('dateFormat', value)}
                      />
                      <Select
                        label="Time Format"
                        data={[
                          { value: '12h', label: '12-hour (AM/PM)' },
                          { value: '24h', label: '24-hour' },
                        ]}
                        value={settings.timeFormat}
                        onChange={(value) => handleSettingChange('timeFormat', value)}
                      />
                    </Group>
                  </Stack>
                </Card>

                {/* Accessibility */}
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconAccessible size={20} />
                    <Title order={4}>Accessibility</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Reduced Motion</Text>
                        <Text size="sm" c="dimmed">Minimize animations throughout the app</Text>
                      </div>
                      <Switch
                        checked={settings.reducedMotion}
                        onChange={(e) => handleSettingChange('reducedMotion', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>High Contrast</Text>
                        <Text size="sm" c="dimmed">Increase contrast for better visibility</Text>
                      </div>
                      <Switch
                        checked={settings.highContrast}
                        onChange={(e) => handleSettingChange('highContrast', e.currentTarget.checked)}
                      />
                    </Group>
                  </Stack>
                </Card>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('general')}
                  loading={loading}
                  size="lg"
                >
                  Save General Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* APPEARANCE SETTINGS */}
            <Tabs.Panel value="appearance" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconPalette size={20} />
                    <Title order={4}>Theme & Display</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Dark Mode</Text>
                        <Text size="sm" c="dimmed">Switch between light and dark theme</Text>
                      </div>
                      <Switch
                        checked={isDark}
                        onChange={toggleDark}
                      />
                    </Group>
                    
                    <Divider label="Theme Color" labelPosition="left" />
                    
                    <SegmentedControl
                      data={[
                        { value: 'blue', label: 'Blue' },
                        { value: 'green', label: 'Green' },
                        { value: 'orange', label: 'Orange' },
                        { value: 'red', label: 'Red' },
                        { value: 'violet', label: 'Violet' },
                      ]}
                      value={settings.themeColor}
                      onChange={(value) => handleSettingChange('themeColor', value)}
                      fullWidth
                    />
                    
                    <Divider label="Font Size" labelPosition="left" />
                    
                    <Select
                      label="Base Font Size"
                      data={[
                        { value: 'small', label: 'Small (14px)' },
                        { value: 'medium', label: 'Medium (16px)' },
                        { value: 'large', label: 'Large (18px)' },
                        { value: 'xl', label: 'Extra Large (20px)' },
                      ]}
                      value={settings.fontSize}
                      onChange={(value) => handleSettingChange('fontSize', value)}
                    />
                  </Stack>
                </Card>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('appearance')}
                  loading={loading}
                  size="lg"
                >
                  Save Appearance Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* NOTIFICATIONS SETTINGS */}
            <Tabs.Panel value="notifications" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconBell size={20} />
                    <Title order={4}>Notification Preferences</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Email Notifications</Text>
                        <Text size="sm" c="dimmed">Receive notifications via email</Text>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Push Notifications</Text>
                        <Text size="sm" c="dimmed">Receive browser push notifications</Text>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>SMS Notifications</Text>
                        <Text size="sm" c="dimmed">Receive notifications via SMS</Text>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Notification Sounds</Text>
                        <Text size="sm" c="dimmed">Play sound for new notifications</Text>
                      </div>
                      <Switch
                        checked={settings.notificationSound}
                        onChange={(e) => handleSettingChange('notificationSound', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Desktop Notifications</Text>
                        <Text size="sm" c="dimmed">Show desktop notifications</Text>
                      </div>
                      <Switch
                        checked={settings.desktopNotifications}
                        onChange={(e) => handleSettingChange('desktopNotifications', e.currentTarget.checked)}
                      />
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconClock size={20} />
                    <Title order={4}>Digest Frequency</Title>
                  </Group>
                  <Select
                    label="How often would you like to receive notification digests?"
                    data={[
                      { value: 'immediate', label: 'Immediate (Real-time)' },
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                    ]}
                    value={settings.digestFrequency}
                    onChange={(value) => handleSettingChange('digestFrequency', value)}
                  />
                </Card>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('notifications')}
                  loading={loading}
                  size="lg"
                >
                  Save Notification Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* PRIVACY SETTINGS */}
            <Tabs.Panel value="privacy" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconEye size={20} />
                    <Title order={4}>Profile Visibility</Title>
                  </Group>
                  <Stack>
                    <Radio.Group
                      value={settings.profileVisibility}
                      onChange={(value) => handleSettingChange('profileVisibility', value)}
                      label="Who can see your profile?"
                    >
                      <Radio value="public" label="Public - Anyone can view your profile" />
                      <Radio value="registered" label="Registered Users Only" />
                      <Radio value="private" label="Private - Only you can view your profile" />
                    </Radio.Group>
                    
                    <Divider />
                    
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Show Online Status</Text>
                        <Text size="sm" c="dimmed">Let others see when you're online</Text>
                      </div>
                      <Switch
                        checked={settings.showOnlineStatus}
                        onChange={(e) => handleSettingChange('showOnlineStatus', e.currentTarget.checked)}
                      />
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconDatabase size={20} />
                    <Title order={4}>Data & Analytics</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Allow Data Collection</Text>
                        <Text size="sm" c="dimmed">Help improve our services by sharing usage data</Text>
                      </div>
                      <Switch
                        checked={settings.allowDataCollection}
                        onChange={(e) => handleSettingChange('allowDataCollection', e.currentTarget.checked)}
                      />
                    </Group>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Share Analytics</Text>
                        <Text size="sm" c="dimmed">Share anonymous analytics with partners</Text>
                      </div>
                      <Switch
                        checked={settings.shareAnalytics}
                        onChange={(e) => handleSettingChange('shareAnalytics', e.currentTarget.checked)}
                      />
                    </Group>
                  </Stack>
                </Card>

                <Alert icon={<IconAlertTriangle size={16} />} color="yellow" variant="light">
                  <Text size="sm">
                    Changes to privacy settings may take up to 24 hours to take effect across all platforms.
                  </Text>
                </Alert>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('privacy')}
                  loading={loading}
                  size="lg"
                >
                  Save Privacy Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* SECURITY SETTINGS */}
            <Tabs.Panel value="security" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconShieldLock size={20} />
                    <Title order={4}>Authentication</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Two-Factor Authentication</Text>
                        <Text size="sm" c="dimmed">Add an extra layer of security to your account</Text>
                      </div>
                      <Switch
                        checked={settings.twoFactorEnabled}
                        onChange={(e) => handleSettingChange('twoFactorEnabled', e.currentTarget.checked)}
                      />
                    </Group>
                    
                    {settings.twoFactorEnabled && (
                      <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                        <Text size="sm">Two-factor authentication is enabled. You'll be asked for a verification code when logging in.</Text>
                      </Alert>
                    )}
                    
                    <Divider />
                    
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Login Alerts</Text>
                        <Text size="sm" c="dimmed">Get notified when someone logs into your account</Text>
                      </div>
                      <Switch
                        checked={settings.loginAlerts}
                        onChange={(e) => handleSettingChange('loginAlerts', e.currentTarget.checked)}
                      />
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconClock size={20} />
                    <Title order={4}>Session Management</Title>
                  </Group>
                  <Stack>
                    <NumberInput
                      label="Session Timeout (minutes)"
                      description="Automatically log out after inactivity"
                      min={5}
                      max={120}
                      value={settings.sessionTimeout}
                      onChange={(value) => handleSettingChange('sessionTimeout', value)}
                    />
                    <Progress value={(settings.sessionTimeout / 120) * 100} size="sm" />
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconKey size={20} />
                    <Title order={4}>Password Requirements</Title>
                  </Group>
                  <Select
                    label="Password Strength Requirement"
                    data={[
                      { value: 'low', label: 'Low - 6 characters minimum' },
                      { value: 'medium', label: 'Medium - 8 characters, 1 number, 1 special character' },
                      { value: 'high', label: 'High - 12 characters, mixed case, numbers, special characters' },
                    ]}
                    value={settings.passwordStrength}
                    onChange={(value) => handleSettingChange('passwordStrength', value)}
                  />
                </Card>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('security')}
                  loading={loading}
                  size="lg"
                >
                  Save Security Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ACCOUNT SETTINGS */}
            <Tabs.Panel value="account" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconUser size={20} />
                    <Title order={4}>Account Information</Title>
                  </Group>
                  <Stack>
                    <TextInput
                      label="Username"
                      value={settings.username}
                      onChange={(e) => handleSettingChange('username', e.currentTarget.value)}
                      disabled
                    />
                    <TextInput
                      label="Email Address"
                      value={settings.currentEmail}
                      onChange={(e) => handleSettingChange('currentEmail', e.currentTarget.value)}
                    />
                    <Button variant="light" size="sm">
                      Change Email
                    </Button>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconLock size={20} />
                    <Title order={4}>Change Password</Title>
                  </Group>
                  <Stack>
                    <PasswordInput
                      label="Current Password"
                      placeholder="Enter current password"
                    />
                    <PasswordInput
                      label="New Password"
                      placeholder="Enter new password"
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      placeholder="Confirm new password"
                    />
                    <Button variant="filled" size="sm">
                      Update Password
                    </Button>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconBuilding size={20} />
                    <Title order={4}>Linked Accounts</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <Group>
                        <Text fw={500}>Google</Text>
                        <Badge color="green" size="sm">Connected</Badge>
                      </Group>
                      <Button variant="outline" size="xs">Disconnect</Button>
                    </Group>
                  </Stack>
                </Card>

                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => saveSettings('account')}
                  loading={loading}
                  size="lg"
                >
                  Save Account Settings
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* DATA MANAGEMENT */}
            <Tabs.Panel value="data" p="xl">
              <Stack gap="xl">
                
                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconDatabase size={20} />
                    <Title order={4}>Storage Usage</Title>
                  </Group>
                  <Stack>
                    <Group justify="space-between">
                      <Text>Local Storage Used</Text>
                      <Text fw={500}>{storageUsed} MB</Text>
                    </Group>
                    <Progress value={(storageUsed / 5) * 100} size="lg" />
                    <Text size="sm" c="dimmed">Maximum local storage: 5 MB</Text>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg">
                  <Group mb="md">
                    <IconDeviceFloppy size={20} />
                    <Title order={4}>Export & Import Settings</Title>
                  </Group>
                  <Stack>
                    <Text size="sm" c="dimmed">
                      Export your settings to backup or import settings from a previous backup.
                    </Text>
                    <Group>
                      <Button
                        leftSection={<IconDeviceFloppy size={16} />}
                        onClick={exportSettings}
                      >
                        Export Settings
                      </Button>
                      <Button
                        component="label"
                        variant="outline"
                      >
                        Import Settings
                        <input
                          type="file"
                          hidden
                          accept=".json"
                          onChange={importSettings}
                        />
                      </Button>
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" p="lg" style={{ borderColor: 'var(--mantine-color-red-5)' }}>
                  <Group mb="md">
                    <IconTrash size={20} color="var(--mantine-color-red-5)" />
                    <Title order={4} c="red">Danger Zone</Title>
                  </Group>
                  <Stack>
                    <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light">
                      <Text size="sm">
                        These actions are irreversible. Please proceed with caution.
                      </Text>
                    </Alert>
                    <Group>
                      <Button
                        leftSection={<IconRefresh size={16} />}
                        variant="outline"
                        color="orange"
                        onClick={() => {
                          if (confirm("Reset all settings to default values?")) {
                            localStorage.removeItem('appSettings');
                            window.location.reload();
                          }
                        }}
                      >
                        Reset All Settings
                      </Button>
                      <Button
                        leftSection={<IconTrash size={16} />}
                        variant="filled"
                        color="red"
                        onClick={clearAllData}
                      >
                        Clear All Data
                      </Button>
                    </Group>
                  </Stack>
                </Card>

              </Stack>
            </Tabs.Panel>

          </Tabs>
        </Card>

        {/* GLOBAL LOADER */}
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      </Container>
    </Box>
  );
}