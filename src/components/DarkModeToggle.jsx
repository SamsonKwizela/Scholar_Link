import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "../context/ThemeContext";

export function DarkModeToggle() {
  const { isDark, toggleDark } = useTheme();

  return (
    <ActionIcon
      onClick={toggleDark}
      variant="subtle"
      size="lg"
      aria-label="Toggle dark mode"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
    </ActionIcon>
  );
}
