import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Alert,
  ThemeIcon,
  Stack,
  Divider,
} from "@mantine/core";

import {
  IconBriefcase,
  IconMapPin,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  // ---------------------------
  // FETCH INTERNSHIPS
  // ---------------------------
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/internships"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch internships");
        }

        setInternships(
          Array.isArray(data.internships) ? data.internships : []
        );
      } catch (error) {
        console.error("Error fetching internships:", error);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // ---------------------------
  // APPLY HANDLER
  // ---------------------------
  const handleApply = async (id, url) => {
    setApplyingId(id);

    try {
      await new Promise((res) => setTimeout(res, 800));

      if (url && url.trim() !== "") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert("No application link available.");
      }
    } finally {
      setApplyingId(null);
    }
  };

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (loading) {
    return (
      <Center h="60vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* HEADER */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Internships</Title>
          <Text size="sm" c="dimmed">
            Explore available internship opportunities
          </Text>
        </div>

        <Badge size="lg" color="blue" variant="light">
          {internships.length} Openings
        </Badge>
      </Group>

      {/* EMPTY STATE */}
      {internships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="No Internships Available"
          color="blue"
        >
          There are currently no internship postings.
        </Alert>
      ) : (
        <Grid>
          {internships.map((item) => (
            <Grid.Col
              key={item._id}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Card shadow="md" radius="lg" padding="lg" withBorder>

                {/* ICON + TITLE */}
                <Group justify="space-between" mb="sm">
                  <Group>
                    <ThemeIcon size={45} radius="md" variant="light">
                      <IconBriefcase size={22} />
                    </ThemeIcon>

                    <div>
                      <Text fw={700}>
                        {item.title || "Untitled Internship"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.company || "Unknown Company"}
                      </Text>
                    </div>
                  </Group>

                  <Badge
                    color={item.isActive ? "green" : "red"}
                    variant="light"
                  >
                    {item.isActive ? "Open" : "Closed"}
                  </Badge>
                </Group>

                <Divider my="sm" />

                {/* DESCRIPTION */}
                <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                  {item.description || "No description available."}
                </Text>

                {/* DETAILS */}
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text size="sm">
                      {item.location
                        ? typeof item.location === "object"
                          ? `${item.location.city || ""}, ${
                              item.location.country || ""
                            }`
                          : item.location
                        : "Remote"}
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString()
                        : "No deadline"}
                    </Text>
                  </Group>
                </Stack>

                {/* TAGS */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <>
                    <Divider my="md" />
                    <Group gap="xs">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </>
                )}

                {/* BUTTON */}
                <Button
                  fullWidth
                  mt="xl"
                  loading={applyingId === item._id}
                  onClick={() =>
                    handleApply(item._id, item.applicationUrl)
                  }
                >
                  Apply Now
                </Button>

              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}