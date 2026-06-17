import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Container,
  Title,
  Card,
  Stack,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import "./ContactUs.css";
import { ContactIcons } from "./ContactIcons";

function ContactUs() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };
    console.log("Form Data:", data);
    alert("Thank you for your message! We will get back to you soon.");
    event.target.reset();
  };

  return (
    <Container size="xl" py={80}>
      <Stack gap={60}>
        {/* Header Section */}
        <Stack align="center" gap="md">
          <Title order={1} ta="center">
            Get In Touch
          </Title>
          <Text ta="center" c="dimmed" size="lg" maw={600}>
            Have questions about ScholarLink? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Text>
        </Stack>

        {/* Contact Information Cards */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          <Card withBorder p="xl" radius="md" shadow="sm">
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="blue" variant="light">
                <IconMail size={30} />
              </ThemeIcon>
              <Text fw={600} size="lg">Email Us</Text>
              <Text c="dimmed" ta="center" size="sm">
                support@scholarlink.com
              </Text>
              <Anchor href="mailto:support@scholarlink.com" size="sm">
                Send Email
              </Anchor>
            </Stack>
          </Card>

          <Card withBorder p="xl" radius="md" shadow="sm">
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="green" variant="light">
                <IconPhone size={30} />
              </ThemeIcon>
              <Text fw={600} size="lg">Call Us</Text>
              <Text c="dimmed" ta="center" size="sm">
                +1 (555) 123-4567
              </Text>
              <Anchor href="tel:+15551234567" size="sm">
                Call Now
              </Anchor>
            </Stack>
          </Card>

          <Card withBorder p="xl" radius="md" shadow="sm">
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="orange" variant="light">
                <IconMapPin size={30} />
              </ThemeIcon>
              <Text fw={600} size="lg">Visit Us</Text>
              <Text c="dimmed" ta="center" size="sm">
                123 Education Street<br />Learning City, LC 12345
              </Text>
              <Anchor component={Link} to="/about" size="sm">
                Get Directions
              </Anchor>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Contact Form */}
        <Paper shadow="md" radius="lg" p={{ base: "md", sm: "xl" }}>
          <Stack gap="xl">
            <div>
              <Title order={3} mb="xs">
                Send Us a Message
              </Title>
              <Text c="dimmed" size="sm">
                Fill out the form below and we'll get back to you within 24 hours.
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Your name"
                    placeholder="John Doe"
                    name="name"
                    required
                    size="md"
                  />
                  <TextInput
                    label="Your email"
                    placeholder="john@example.com"
                    name="email"
                    required
                    size="md"
                  />
                </SimpleGrid>

                <TextInput
                  label="Subject"
                  placeholder="How can we help you?"
                  name="subject"
                  required
                  size="md"
                />

                <Textarea
                  label="Your message"
                  placeholder="Please include all relevant information"
                  minRows={5}
                  name="message"
                  required
                  size="md"
                />

                <Group justify="flex-end">
                  <Button type="submit" size="md" radius="md">
                    Send Message
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Paper>

        {/* Social Media */}
        <Stack align="center" gap="md">
          <Text fw={600} size="lg">Connect With Us</Text>
          <Group gap="md">
            <Anchor href="#" size="sm">
              <ThemeIcon size={40} radius="xl" color="blue" variant="light">
                <IconBrandTwitter size={20} />
              </ThemeIcon>
            </Anchor>
            <Anchor href="#" size="sm">
              <ThemeIcon size={40} radius="xl" color="pink" variant="light">
                <IconBrandInstagram size={20} />
              </ThemeIcon>
            </Anchor>
            <Anchor href="#" size="sm">
              <ThemeIcon size={40} radius="xl" color="blue" variant="light">
                <IconBrandLinkedin size={20} />
              </ThemeIcon>
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ContactUs;
