import { Container, Group, Text, Anchor, Stack, Divider } from "@mantine/core";
import { IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconMail } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function UniversalFooter() {
  return (
    <footer style={{
      background: 'var(--mantine-color-body)',
      borderTop: '1px solid var(--mantine-color-default-border)',
      padding: '2rem 0',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <Container size="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Text fw={700} size="lg" mb="xs">ScholarLink</Text>
              <Text size="sm" c="dimmed">
                Your gateway to educational opportunities. Find scholarships, internships, and assessments to advance your academic and professional journey.
              </Text>
            </div>

            <div style={{ flex: 1 }}>
              <Text fw={600} size="sm" mb="xs">Quick Links</Text>
              <Stack gap="xs">
                <Anchor size="sm" component={Link} to="/scholarships">Scholarships</Anchor>
                <Anchor size="sm" component={Link} to="/internships">Internships</Anchor>
                <Anchor size="sm" component={Link} to="/assessments">Assessments</Anchor>
                <Anchor size="sm" component={Link} to="/about">About Us</Anchor>
              </Stack>
            </div>

            <div style={{ flex: 1 }}>
              <Text fw={600} size="sm" mb="xs">Support</Text>
              <Stack gap="xs">
                <Anchor size="sm" component={Link} to="/contact">Contact Us</Anchor>
                <Anchor size="sm" component={Link} to="/faq">FAQ</Anchor>
                <Anchor size="sm" component={Link} to="/privacy">Privacy Policy</Anchor>
                <Anchor size="sm" component={Link} to="/terms">Terms of Service</Anchor>
              </Stack>
            </div>

            <div style={{ flex: 1 }}>
              <Text fw={600} size="sm" mb="xs">Connect With Us</Text>
              <Group gap="md">
                <Anchor href="#" size="sm">
                  <IconBrandTwitter size={20} />
                </Anchor>
                <Anchor href="#" size="sm">
                  <IconBrandInstagram size={20} />
                </Anchor>
                <Anchor href="#" size="sm">
                  <IconBrandLinkedin size={20} />
                </Anchor>
                <Anchor href="mailto:support@scholarlink.com" size="sm">
                  <IconMail size={20} />
                </Anchor>
              </Group>
            </div>
          </Group>

          <Divider />

          <Text size="xs" c="dimmed" ta="center">
            © {new Date().getFullYear()} ScholarLink. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
