import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // make sure this file exists in SAME folder

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <Paper shadow="md" radius="md" className="login-card">

        <Title order={2} className="login-title">
          Sign In
        </Title>

        <Text className="login-subtitle">
          Welcome back! Please login to continue
        </Text>

        <Stack mt="md">
          <TextInput
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth className="login-button" onClick={handleLogin}>
            Login
          </Button>

          <Text size="sm" align="center" className="login-footer">
            Don’t have an account? <span className="login-link">Sign up</span>
          </Text>
        </Stack>

      </Paper>
    </div>
  );
}

export default Login;