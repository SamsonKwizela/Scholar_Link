import { useState, useEffect } from "react";
import { Group, Title, Text, Avatar, Button, Burger } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

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
            styles={{
              root: {
                '&:hover': {
                  background: 'var(--bg-tertiary)',
                }
              }
            }}
          />
        )}

        <Group 
          gap="xs" 
          onClick={() => navigate("/")} 
          style={{ 
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s ease'
          }}
          className="animate-fade-in"
        >
          <Title 
            order={3} 
            fw={800} 
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Scholar
          </Title>
          <Title 
            order={3} 
            fw={400} 
            style={{ 
              color: 'var(--text-secondary)',
              letterSpacing: '-0.02em'
            }}
          >
            Link
          </Title>
        </Group>
      </Group>

      <Group gap="sm">
        <NotificationBell />
        
        <Button
          variant="subtle"
          size="sm"
          onClick={toggleDark}
          leftSection={
            isDark ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )
          }
          styles={{
            root: {
              '&:hover': {
                background: 'var(--bg-tertiary)',
              }
            }
          }}
        >
          {isDark ? "Light" : "Dark"}
        </Button>

        <Avatar
          radius="xl"
          size="md"
          src={avatar}
          alt="Profile"
          style={{ 
            cursor: 'pointer',
            border: '2px solid var(--border-color)',
            transition: 'all 0.3s ease'
          }}
          className="animate-scale-in"
          onClick={(e) => {
            e.preventDefault();
            navigate("/UserProfile");
          }}
        />
      </Group>
    </Group>
  );
}
