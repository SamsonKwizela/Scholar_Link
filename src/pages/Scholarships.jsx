import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Loader,
  Center,
  Modal,
  Stack,
  Divider,
  ThemeIcon,
  Alert,
  SimpleGrid,
} from "@mantine/core";

import {
  IconSchool,
  IconMapPin,
  IconCategory,
  IconCalendar,
  IconAlertCircle,
  IconWorld,
  IconBook,
  IconAward,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  // -----------------------------
  // SAFE FORMATTERS
  // -----------------------------
  const formatLocation = (loc) => {
    if (!loc) return "Global";
    if (typeof loc === "string") return loc;

    if (typeof loc === "object") {
      return `${loc.city || ""}, ${loc.country || ""}`
        .replace(/^,\s*|,\s*$/g, "")
        .trim() || "Global";
    }

    return "Global";
  };

  const formatBenefits = (benefits) => {
    if (!benefits) return "No benefits listed";
    if (typeof benefits === "string") return benefits;
    if (typeof benefits === "object") {
      return Object.values(benefits).join(", ") || "No benefits listed";
    }
    return "No benefits listed";
  };

  const formatRequirements = (req) => {
    if (!req) return "No requirements listed";
    if (Array.isArray(req)) return req.join(", ");
    if (typeof req === "string") return req;
    return "No requirements listed";
  };

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/scholarships"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        setScholarships(
          Array.isArray(data?.scholarships) ? data.scholarships : []
        );
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

 
  // APPLY FUNCTION
 
  const handleApply = async (id, url) => {
    setApplyingId(id);

    try {
      await new Promise((res) => setTimeout(res, 800));

      if (url && url.trim() !== "") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert("Application link not available.");
      }
    } finally {
      setApplyingId(null);
    }
  };

  // LOADING STATE
 
  if (loading) {
    return (
      <Center h="70vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* HEADER */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Available Scholarships</Title>
          <Text c="dimmed" size="sm">
            Discover and apply for scholarships from different providers
          </Text>
        </div>

        <Badge size="lg" color="blue" variant="light">
          {scholarships.length} Scholarships
        </Badge>
      </Group>

      {/* EMPTY STATE */}
      {scholarships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="No Scholarships Available"
          color="blue"
        >
          There are currently no scholarships posted.
        </Alert>
      ) : (
        <Grid>
          {scholarships.map((item) => (
            <Grid.Col key={item._id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="md" radius="lg" padding="lg" withBorder h="100%">
                {/* HEADER */}
                <Group justify="space-between" mb="md">
                  <Group>
                    <ThemeIcon size={45} radius="md" variant="light">
                      <IconSchool size={24} />
                    </ThemeIcon>

                    <div>
                      <Text fw={700} lineClamp={2}>
                        {item.title || "Untitled Scholarship"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.provider || "Unknown Provider"}
                      </Text>
                    </div>
                  </Group>

                  <Badge
                    color={item.isActive ? "green" : "red"}
                    variant="light"
                  >
                    {item.isActive ? "Active" : "Closed"}
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
                    <IconCategory size={16} />
                    <Text size="sm">{item.category || "General"}</Text>
                  </Group>

                  <Group gap="xs">
                    <IconAward size={16} />
                    <Text size="sm">{item.level || "All Levels"}</Text>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text size="sm">{formatLocation(item.location)}</Text>
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

                {/* BUTTONS */}
                <Group grow mt="xl">
                  <Button onClick={() => setSelected(item)}>
                    View Details
                  </Button>

                  <Button
                    loading={applyingId === item._id}
                    disabled={applyingId !== null}
                    onClick={() =>
                      handleApply(item._id, item.applicationUrl)
                    }
                  >
                    Apply
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* MODAL */}
      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title="Scholarship Details"
        centered
        size="lg"
      >
        {selected && (
          <Stack gap="md">
            <div>
              <Title order={3}>{selected.title}</Title>
              <Text c="dimmed">{selected.provider}</Text>
            </div>

            <Divider />

            <Text size="sm">{selected.description}</Text>

            <SimpleGrid cols={2}>
              <Card withBorder p="sm">
                <Text fw={600}>Category</Text>
                <Text size="sm">{selected.category}</Text>
              </Card>

              <Card withBorder p="sm">
                <Text fw={600}>Level</Text>
                <Text size="sm">{selected.level}</Text>
              </Card>

              <Card withBorder p="sm">
                <Text fw={600}>Location</Text>
                <Text size="sm">
                  {formatLocation(selected.location)}
                </Text>
              </Card>

              <Card withBorder p="sm">
                <Text fw={600}>Deadline</Text>
                <Text size="sm">
                  {selected.deadline
                    ? new Date(selected.deadline).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Card>
            </SimpleGrid>

            <Divider />

            <div>
              <Group mb="xs">
                <IconBook size={18} />
                <Text fw={700}>Requirements</Text>
              </Group>
              <Text size="sm">
                {formatRequirements(selected.requirements)}
              </Text>
            </div>

            <div>
              <Group mb="xs">
                <IconAward size={18} />
                <Text fw={700}>Benefits</Text>
              </Group>
              <Text size="sm">
                {formatBenefits(selected.benefits)}
              </Text>
            </div>

            <Button
              fullWidth
              mt="md"
              rightSection={<IconWorld size={18} />}
              onClick={() =>
                handleApply(selected._id, selected.applicationUrl)
              }
            >
              Apply Now
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}