import { MantineProvider } from "@mantine/core";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import "@mantine/core/styles.css";
import "./index.css";
import "./App.css";

function RootMantine() {
  const { isDark } = useTheme();

  return (
    <MantineProvider
      theme={{ colorScheme: isDark ? "dark" : "light", primaryColor: "blue" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <App />
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <ThemeProvider>
      <RootMantine />
    </ThemeProvider>
  </NotificationProvider>
);