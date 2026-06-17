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
import { scholarshipsManager, internshipsManager } from "../utils/dataManager";

export default function OpportunitiesCards() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data from database
    const loadOpportunities = () => {
      const scholarships = scholarshipsManager.getAll();
      const internships = internshipsManager.getAll();

      // Combine and sort by creation date (most recent first)
      const combined = [
        ...scholarships.map(item => ({ ...item, type: 'scholarship' })),
        ...internships.map(item => ({ ...item, type: 'internship' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Take only the first 3 items
      setOpportunities(combined.slice(0, 3));
      setLoading(false);
    };

    loadOpportunities();

    // Listen for data changes
    const handleDataChange = () => {
      loadOpportunities();
    };

    window.addEventListener('dataChange', handleDataChange);
    return () => window.removeEventListener('dataChange', handleDataChange);
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
            <Card key={i} radius="xl" padding="xl" withBorder className={classes.card}>
              <Stack gap="xs">
                <Box h={58} w={58} bg="var(--surface-strong)" radius="lg" />
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
              mt="xl"
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