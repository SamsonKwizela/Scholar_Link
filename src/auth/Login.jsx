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
  Group,
  Alert,
  Divider,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
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
    <div className="login-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg-primary) 50%, var(--primary-100) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, var(--primary-200) 0%, transparent 70%)',
        opacity: 0.4,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--accent-cyan-light) 0%, transparent 70%)',
        opacity: 0.2,
        pointerEvents: 'none'
      }} />

      <Paper 
        shadow="2xl" 
        radius="2xl" 
        className="login-card animate-scale-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          padding: '3rem',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          zIndex: 1,
          boxShadow: 'var(--shadow-2xl)'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Group 
            gap="xs" 
            justify="center" 
            mb="md"
            className="animate-fade-in"
          >
            <Title 
              order={2} 
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
              order={2} 
              fw={400} 
              style={{ 
                color: 'var(--text-secondary)',
                letterSpacing: '-0.02em'
              }}
            >
              Link
            </Title>
          </Group>
          
          <Title 
            order={3} 
            fw={800}
            style={{ 
              letterSpacing: '-0.02em',
              marginBottom: '8px'
            }}
          >
            Welcome back! 👋
          </Title>
          <Text c="dimmed" size="md">
            Sign in to continue your journey
          </Text>
        </div>

        <Stack mt="xl" gap="lg">
          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--error-light)'
              }}
            >
              <Text size="sm" fw={500}>{error}</Text>
            </Alert>
          )}

          <div>
            <Text fw={600} size="sm" mb="xs" style={{ color: 'var(--text-primary)' }}>
              Email Address
            </Text>
            <TextInput
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              size="md"
              styles={{
                input: {
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 16px',
                  '&:focus': {
                    borderColor: 'var(--primary-500)',
                    boxShadow: '0 0 0 3px var(--primary-100)'
                  }
                }
              }}
            />
          </div>

          <div>
            <Text fw={600} size="sm" mb="xs" style={{ color: 'var(--text-primary)' }}>
              Password
            </Text>
            <PasswordInput
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              size="md"
              styles={{
                input: {
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 16px',
                  '&:focus': {
                    borderColor: 'var(--primary-500)',
                    boxShadow: '0 0 0 3px var(--primary-100)'
                  }
                }
              }}
            />
          </div>

          <Button
            fullWidth
            size="md"
            radius="lg"
            onClick={handleLogin}
            disabled={loading}
            styles={{
              root: {
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                padding: '14px 24px',
                fontWeight: 600,
                fontSize: '1rem',
                marginTop: '0.5rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-lg), 0 0 25px rgba(59, 130, 246, 0.4)',
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  transform: 'none'
                }
              }
            }}
          >
            {loading ? (
              <Group gap="xs" justify="center">
                <Loader size="sm" color="white" />
                <Text>Signing in...</Text>
              </Group>
            ) : (
              "Sign In"
            )}
          </Button>

          <Divider 
            label="OR" 
            labelPosition="center"
            style={{ 
              margin: '1.5rem 0',
              color: 'var(--text-muted)'
            }} 
          />

          <Text size="sm" ta="center" style={{ color: 'var(--text-secondary)' }}>
            Don’t have an account?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/signup")}
              style={{
                color: 'var(--primary-600)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'var(--primary-700)',
                  textDecoration: 'underline'
                }
              }}
            >
              Create an account
            </span>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}

export default Login;
