import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Title,
  SimpleGrid,
  ThemeIcon,
  Stack,
  Box,
} from "@mantine/core";

import {
  IconBook2,
  IconUsersGroup,
  IconChartBar,
  IconArrowRight,
} from "@tabler/icons-react";

import classes from "./OpportunitiesCards.module.css";

const features = [
  {
    icon: <IconBook2 size={26} stroke={1.8} />,
    title: "Learning Resources",
    description:
      "Access notes, tutorials, research materials, and academic content shared by students and lecturers.",
    color: "blue",
    category: "Education",
  },

  {
    icon: <IconUsersGroup size={26} stroke={1.8} />,
    title: "Student Collaboration",
    description:
      "Connect with peers, build study groups, collaborate on projects, and exchange ideas seamlessly.",
    color: "green",
    category: "Community",
  },

  {
    icon: <IconChartBar size={26} stroke={1.8} />,
    title: "Career Development",
    description:
      "Discover internships, scholarships, and opportunities that support your academic and career journey.",
    color: "orange",
    category: "Growth",
  },
];

export default function OpportunitiesCards() {
  return (
    <Box>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="xl"
      >

        {features.map((feature, index) => (
          <Card
            key={index}
            radius="xl"
            padding="xl"
            withBorder
            className={classes.card}
          >

            {/* HEADER */}
            <Group justify="space-between" mb="lg">

              <ThemeIcon
                size={58}
                radius="lg"
                variant="light"
                color={feature.color}
              >
                {feature.icon}
              </ThemeIcon>

              <Badge
                radius="sm"
                variant="light"
                color={feature.color}
                className={classes.label}
              >
                {feature.category}
              </Badge>

            </Group>

            {/* CONTENT */}
            <Stack gap="xs">

              <Title order={4}>
                {feature.title}
              </Title>

              <Text
                size="sm"
                c="dimmed"
                className={classes.description}
              >
                {feature.description}
              </Text>

            </Stack>

            {/* BUTTON */}
            <Button
              mt="xl"
              radius="md"
              variant="light"
              color={feature.color}
              rightSection={<IconArrowRight size={16} />}
              fullWidth
            >
              Explore More
            </Button>

          </Card>
        ))}

      </SimpleGrid>

    </Box>
  );
}