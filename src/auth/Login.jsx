import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Loader,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect to HOME page
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Paper shadow="md" radius="md" className="login-card">
        <Title order={2} className="login-title">
          Sign In to ScholarLink
        </Title>

        <Text className="login-subtitle">
          Welcome back! Login to continue learning
        </Text>

        <Stack mt="md">
          {error && (
            <Text color="red" size="sm">
              {error}
            </Text>
          )}

          <TextInput
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <Button
            fullWidth
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Loader size="sm" color="white" /> : "Login"}
          </Button>

          <Text size="sm" ta="center" className="login-footer">
            Don’t have an account?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}

export default Login;
