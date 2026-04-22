import {
  Container,
  Group,
  Button,
  Title,
  Text,
  Box,
} from "@mantine/core";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Box>
      {/* NAVBAR */}
      <Group
        position="apart"
        px="xl"
        py="md"
        style={{ borderBottom: "1px solid #eee" }}
      >
        <Title order={3}>ScholarLink</Title>

        <Group>
          <Button variant="subtle" component={Link} to="/">
            Home
          </Button>

          <Button variant="subtle" component={Link} to="/about">
            About Us
          </Button>

          <Button variant="subtle" component={Link} to="/contact">
            Contact Us
          </Button>
        </Group>

        <Group>
          <Button variant="outline" component={Link} to="/signin">
            Sign In
          </Button>

          <Button component={Link} to="/signup">
            Sign Up
          </Button>

          <Button color="red" component={Link} to="/admin/login">
            Admin Login
          </Button>
        </Group>
      </Group>

      {/* HERO SECTION */}
      <Container size="md" mt="xl" style={{ textAlign: "center" }}>
        <Title order={1} mb="md">
          Find Scholarships & Internships Easily 🎓
        </Title>

        <Text size="lg" color="dimmed" mb="xl">
          ScholarLink helps students discover opportunities, apply faster,
          and build a better future.
        </Text>

        <Group position="center">
          <Button size="md" component={Link} to="/signup">
            Get Started
          </Button>

          <Button size="md" variant="outline" component={Link} to="/about">
            Learn More
          </Button>
        </Group>
      </Container>
    </Box>
  );
}

export default LandingPage;