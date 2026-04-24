import { MantineProvider } from "@mantine/core";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <App />
  </MantineProvider>
);