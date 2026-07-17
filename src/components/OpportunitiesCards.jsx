import { useState, useEffect } from "react";
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
  Alert,
} from "@mantine/core";

import {
  IconSchool,
  IconBriefcase,
  IconArrowRight,
  IconAlertCircle,
} from "@tabler/icons-react";

import { Link } from "react-router-dom";
import classes from "./OpportunitiesCards.module.css";
import { getApiCollection } from "../utils/api";

export default function OpportunitiesCards() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data from API
    const loadOpportunities = async () => {
      try {
        const [scholarships, internships] = await Promise.all([
          getApiCollection('/scholarships'),
          getApiCollection('/internships')
        ]);

        // Combine and sort by creation date (most recent first)
        const combined = [
          ...scholarships.map(item => ({ ...item, type: 'scholarship' })),
          ...internships.map(item => ({ ...item, type: 'internship' }))
        ].sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));

        // Take only the first 3 items
        setOpportunities(combined.slice(0, 3));
      } catch (error) {
        console.error("Error loading opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const getOpportunityIcon = (type) => {
    return type === 'scholarship' ? <IconSchool size={26} stroke={1.8} /> : <IconBriefcase size={26} stroke={1.8} />;
  };

  const getOpportunityColor = (type) => {
    return type === 'scholarship' ? 'blue' : 'green';
  };

  const getOpportunityCategory = (type) => {
    return type === 'scholarship' ? 'Scholarship' : 'Internship';
  };

  const getOpportunityLink = (item) => {
    return item.type === 'scholarship' ? `/scholarship/details?id=${item.id}` : `/internships`;
  };

  if (loading) {
    return (
      <Box>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {[1, 2, 3].map((i) => (
            <Card key={i} radius="lg" padding="lg" withBorder className={classes.card}>
              <Stack gap="xs">
                <Box h={45} w={45} bg="var(--surface-strong)" radius="md" />
                <Box h={24} w="60%" bg="var(--surface-strong)" radius="sm" />
                <Box h={16} w="100%" bg="var(--surface-strong)" radius="sm" />
                <Box h={16} w="80%" bg="var(--surface-strong)" radius="sm" />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Alert
        icon={<IconAlertCircle size={20} />}
        title="No Opportunities Available"
        color="gray"
        variant="light"
        radius="md"
      >
        No scholarships or internships are available at the moment. Check back later for new opportunities.
      </Alert>
    );
  }

  return (
    <Box>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {opportunities.map((item) => (
          <Card
            key={item.id}
            radius="lg"
            padding="lg"
            withBorder
            className={classes.card}
          >
            {/* HEADER */}
            <Group justify="space-between" mb="md">
              <ThemeIcon
                size={45}
                radius="md"
                variant="light"
                color={getOpportunityColor(item.type)}
              >
                {getOpportunityIcon(item.type)}
              </ThemeIcon>

              <Badge
                radius="sm"
                variant="light"
                color={getOpportunityColor(item.type)}
                className={classes.label}
              >
                {getOpportunityCategory(item.type)}
              </Badge>
            </Group>

            {/* CONTENT */}
            <Stack gap="xs">
              <Title order={4} lineClamp={2}>
                {item.title || item.name || 'Untitled Opportunity'}
              </Title>

              <Text
                size="sm"
                c="dimmed"
                className={classes.description}
                lineClamp={3}
              >
                {item.description || item.about || 'No description available.'}
              </Text>

              {item.amount && (
                <Text size="xs" fw={600} c="blue">
                  {item.amount}
                </Text>
              )}
            </Stack>

            {/* BUTTON */}
            <Button
              mt="md"
              radius="md"
              variant="light"
              color={getOpportunityColor(item.type)}
              rightSection={<IconArrowRight size={16} />}
              fullWidth
              component={Link}
              to={getOpportunityLink(item)}
            >
              View Details
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}