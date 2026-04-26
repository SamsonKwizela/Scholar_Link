import {
  Container,
  Group,
  Button,
  Title,
  Text,
  Box,
  Grid,
} from "@mantine/core";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import OpportunitiesCards from "../components/OpportunitiesCards";



function LandingPage() {
  return (
    <Box className="page">
  {/* NAVBAR */}
   <Group
  position="apart"
  px="xl"
  py="lg"
  className="navbar"
>
  <Title order={3} className="logo">ScholarLink</Title>

  <Group spacing="lg">
    <Button variant="subtle" component={Link} to="/">Home</Button>
    <Button variant="subtle" component={Link} to="/about">About Us</Button>
    <Button variant="subtle" component={Link} to="/contact">Contact Us</Button>
  </Group>

  <Group spacing="md">
    <Button variant="outline" component={Link} to="/Login">Sign In</Button>
    <Button component={Link} to="/signup">Sign Up</Button>
    <Button className="admin-btn" component={Link} to="/admin/login">
      Admin Login
    </Button>
  </Group>
</Group>

  {/* HERO SECTION */}
  <Container size="md" className="hero">
    <Title className="hero-title">
      Find Scholarships & Internships Easily 🎓
    </Title>

    <Text className="hero-text">
      ScholarLink helps students discover opportunities, apply faster,
      and build a better future.
    </Text>
  </Container>

  {/* RECENT POSTED OPPORTUNITIES SECTION */}
  <Container size="lg" py="xl">
    <h1 className="opportunities-title">
  RECENT POSTED OPPORTUNITIES
</h1>
      <Grid gutter="lg">
        
        {/* CARD 1 */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <OpportunitiesCards />
        </Grid.Col>

        {/* CARD 2 */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <OpportunitiesCards />
        </Grid.Col>

        {/* CARD 3 */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <OpportunitiesCards />
        </Grid.Col>

      </Grid>
    </Container>

  <Group justify="center" className="hero-buttons">
      <Button size="md" component={Link} to="/Login">
        Get Started
      </Button>

      <Button size="md" variant="outline" component={Link} to="/about">
        Learn More
      </Button>
    </Group>
</Box>
  );
}

export default LandingPage;