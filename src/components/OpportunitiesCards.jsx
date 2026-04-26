import { IconHeart } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";

import classes from "./OpportunitiesCards.module.css"; // ✅ FIXED

const mockdata = {
  image:
    "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&w=600&q=80",
  title: "Verudela Beach",
  country: "Croatia",
  description:
    "Completely renovated for the season 2020, Arena Verudela Beach Apartments are modern 4-star self-service apartments.",
  badges: [
    { emoji: "☀️", label: "Sunny weather" },
    { emoji: "🌊", label: "Sea" },
    { emoji: "🌲", label: "Nature" },
  ],
};

export default function OpportunitiesCards() { // ✅ FIXED EXPORT
  const { image, title, description, country, badges } = mockdata;

  const features = badges.map((badge) => (
    <Badge key={badge.label} variant="light" leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section>

      <Card.Section mt="md" className={classes.section}>
        <Group justify="space-between">
          <Text fw={500} size="lg">
            {title}
          </Text>
          <Badge variant="light">{country}</Badge>
        </Group>

        <Text size="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text c="dimmed" size="sm">
          Perfect for you if you enjoy:
        </Text>

        <Group mt={5}>{features}</Group>
      </Card.Section>

      <Group mt="md">
        <Button style={{ flex: 1 }}>Show details</Button>

        <ActionIcon variant="default" size={36}>
          <IconHeart stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}