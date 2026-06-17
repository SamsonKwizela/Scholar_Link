import { useEffect, useMemo, useState } from "react";
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
  TextInput,
  SegmentedControl,
} from "@mantine/core";

import {
  IconBriefcase,
  IconMapPin,
  IconCalendar,
  IconAlertCircle,
  IconSearch,
} from "@tabler/icons-react";
import { useDataManager } from "../utils/dataManager";

export default function Internships() {
  const { internships: internshipsManager } = useDataManager();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadInternships = () => {
      try {
        const data = internshipsManager.getAll();
        setInternships(data);
        setFetchError("");
      } catch (error) {
        console.error("Error loading internships:", error);
        setFetchError("Could not load internships right now. Please try again later.");
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    loadInternships();

    // Listen for data changes
    const handleDataChange = () => {
      loadInternships();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  const openCount = internships.filter((item) => item.isActive).length;

  const visibleInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return internships.filter((item) => {
      const searchMatch =
        !query ||
        [item?.title, item?.company, item?.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "open" && item?.isActive) ||
        (statusFilter === "closed" && !item?.isActive);

      return searchMatch && statusMatch;
    });
  }, [internships, search, statusFilter]);

  const handleApply = async (id, url) => {
    if (!url?.trim()) {
      return;
    }

    setApplyingId(id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      window.open(url.trim(), "_blank", "noopener,noreferrer");
    } finally {
      setApplyingId(null);
    }
  };

  const formatLocation = (location) => {
    if (!location) {
      return "Remote";
    }

    if (typeof location === "string") {
      return location;
    }

    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Remote";
  };

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "No deadline";
    }

    const date = new Date(deadline);
    return Number.isNaN(date.getTime())
      ? "No deadline"
      : date.toLocaleDateString();
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
      <Group justify="space-between" mb="xl" align="flex-start">
        <div>
          <Title order={2}>Internships</Title>
          <Text size="sm" c="dimmed">
            Explore available internship opportunities.
          </Text>
        </div>

        <Badge size="lg" color="blue" variant="light">
          {openCount} Open / {internships.length} Total
        </Badge>
      </Group>

      <Group mb="xl" align="flex-end" spacing="sm" wrap="wrap">
        <TextInput
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search by title, company, or description"
          icon={<IconSearch size={16} />}
          sx={{ minWidth: 260, flex: "1 1 360px" }}
        />

        <SegmentedControl
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { label: "All", value: "all" },
            { label: "Open", value: "open" },
            { label: "Closed", value: "closed" },
          ]}
          fullWidth
        />
      </Group>

      {fetchError && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Unable to load internships"
          color="red"
          mb="xl"
        >
          {fetchError}
        </Alert>
      )}

      {visibleInternships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title={internships.length > 0 ? "No matches found" : "No Internships Available"}
          color="blue"
        >
          {internships.length > 0
            ? "Try adjusting your search or filter to see more internships."
            : "There are currently no internship postings."}
        </Alert>
      ) : (
        <Grid>
          {visibleInternships.map((item) => (
            <Grid.Col
              key={item._id}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Card shadow="md" radius="lg" padding="lg" withBorder style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>

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
                    <Text size="sm">{formatLocation(item.location)}</Text>
                  </Group>

                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">{formatDeadline(item.deadline)}</Text>
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
                  disabled={!item.isActive || !item.applicationUrl?.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleApply(item._id, item.applicationUrl);
                  }}
                >
                  {item.isActive
                    ? item.applicationUrl?.trim()
                      ? "Apply Now"
                      : "No Link"
                    : "Closed"}
                </Button>

              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}