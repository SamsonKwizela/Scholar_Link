import { useState, useEffect } from "react";
import { Group, Title, Text, Avatar, Button, Burger } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function UniversalHeader({ opened, setOpened, showBurger = true }) {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();

  // Load profile data from localStorage
  const [avatar, setAvatar] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile).avatar : "";
  });

  const [userName, setUserName] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile).name : "Student";
  });

  // Update profile data when localStorage changes
  useEffect(() => {
    const handleProfileChange = (event) => {
      if (event.detail && event.detail.avatar) {
        setAvatar(event.detail.avatar);
      }
      if (event.detail && event.detail.name) {
        setUserName(event.detail.name);
      }
    };

    window.addEventListener('profileChange', handleProfileChange);
    return () => window.removeEventListener('profileChange', handleProfileChange);
  }, []);

  return (
    <Group justify="space-between" h="100%" px="md" style={{ transition: 'background-color 0.3s ease' }}>
      <Group>
        {showBurger && (
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
        )}

        <Group gap="xs" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
          <Title order={3} c="blue" fw={800}>
            Scholar
          </Title>
          <Title order={3} c="gray" fw={400}>
            Link
          </Title>
        </Group>
      </Group>

      <Group gap="sm">
        <Button
          variant="light"
          size="sm"
          onClick={toggleDark}
          leftSection={
            isDark ? (
              <IconSun size={16} />
            ) : (
              <IconMoon size={16} />
            )
          }
        >
          {isDark ? "Light" : "Dark"}
        </Button>

        <Avatar
          radius="xl"
          size="md"
          src={avatar}
          alt="Profile"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/UserProfile");
          }}
        />
      </Group>
    </Group>
  );
}
