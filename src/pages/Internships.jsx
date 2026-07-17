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
  Modal,
} from "@mantine/core";

import {
  IconBriefcase,
  IconMapPin,
  IconCalendar,
  IconAlertCircle,
  IconSearch,
} from "@tabler/icons-react";
import { useDataManager } from "../utils/dataManager";
import { useNotifications } from "../context/NotificationContext";
import { applyToOpportunity, getInternships } from "../utils/api";

export default function Internships() {
  const { internships: internshipsManager } = useDataManager();
  const { addNotification } = useNotifications();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [opportunityToApply, setOpportunityToApply] = useState(null);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        const data = await getInternships();
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

  const openConfirmModal = (id, url) => {
    setOpportunityToApply({ id, url });
    setConfirmModalOpened(true);
  };

  const handleApply = async () => {
    if (!opportunityToApply) return;

    const { id, url } = opportunityToApply;
    setApplyingId(id);
    setConfirmModalOpened(false);

    try {
      // Call the backend API
      const response = await applyToOpportunity({
        internshipId: id,
        type: 'internship'
      });

      // Show success notification
      addNotification({
        title: "Application Submitted Successfully",
        message: "Your profile information, CV, assessment results, and documents have been sent for review.",
        type: "success",
      });

      // Open external URL if available
      if (url && url.trim() !== "") {
        window.open(url.trim(), "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      // Show error notification
      addNotification({
        title: "Application Failed",
        message: error.message || "Failed to submit application. Please try again.",
        type: "error",
      });
    } finally {
      setApplyingId(null);
      setOpportunityToApply(null);
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
      <Group justify="space-between" mb="xl" align="flex-start" className="animate-fade-in">
        <div>
          <Title 
            order={2} 
            fw={800}
            style={{ 
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Available Internships
          </Title>
          <Text size="sm" c="dimmed">
            Discover and apply for internships from top companies
          </Text>
        </div>

        <Badge 
          size="lg" 
          color="cyan" 
          variant="light"
          style={{ 
            fontWeight: 600,
            padding: '8px 16px'
          }}
        >
          {internships.length} {internships.length === 1 ? 'Internship' : 'Internships'}
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
          {visibleInternships.map((item, index) => (
            <Grid.Col
              key={item._id}
              span={{ base: 12, sm: 6, md: 4 }}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card 
                shadow="md" 
                radius="xl" 
                padding="lg" 
                withBorder 
                className="card-smooth"
                style={{ 
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
              >

                {/* ICON + TITLE */}
                <Group justify="space-between" mb="md" align="flex-start">
                  <Group gap="sm" align="center">
                    <ThemeIcon 
                      size={50} 
                      radius="lg" 
                      variant="light"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0891b2 100%)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                      }}
                    >
                      <IconBriefcase size={24} />
                    </ThemeIcon>

                    <div style={{ flex: 1 }}>
                      <Text 
                        fw={700} 
                        lineClamp={2}
                        style={{ 
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3
                        }}
                      >
                        {item.title || "Untitled Internship"}
                      </Text>
                      <Text size="sm" c="dimmed" fw={500}>
                        {item.company || "Unknown Company"}
                      </Text>
                    </div>
                  </Group>

                  <Badge
                    color={item.isActive ? "green" : "red"}
                    variant="light"
                    style={{ 
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    {item.isActive ? "Open" : "Closed"}
                  </Badge>
                </Group>

                <Divider my="sm" />

                {/* DESCRIPTION */}
                <Text 
                  size="sm" 
                  c="dimmed" 
                  lineClamp={3} 
                  mb="md"
                  style={{ lineHeight: 1.6 }}
                >
                  {item.description || "No description available."}
                </Text>

                {/* DETAILS */}
                <Stack gap="xs" mb="md">
                  <Group gap="xs" align="center">
                    <IconMapPin size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <Text size="sm" fw={500}>{formatLocation(item.location)}</Text>
                  </Group>

                  <Group gap="xs" align="center">
                    <IconCalendar size={16} style={{ color: 'var(--accent-teal)' }} />
                    <Text size="sm" fw={500}>{formatDeadline(item.deadline)}</Text>
                  </Group>
                </Stack>

                {/* TAGS */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <>
                    <Divider my="md" />
                    <Group gap="xs" mb="md">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <Badge 
                          key={i} 
                          variant="light"
                          style={{ fontWeight: 500 }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </>
                )}

                {/* BUTTON */}
                <Button
                  fullWidth
                  size="sm"
                  radius="md"
                  mt="md"
                  loading={applyingId === item._id}
                  disabled={!item.isActive || !item.applicationUrl?.trim() || applyingId !== null}
                  onClick={(e) => {
                    e.preventDefault();
                    openConfirmModal(item._id, item.applicationUrl);
                  }}
                  styles={{
                    root: {
                      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0891b2 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: 'var(--shadow-md), 0 0 15px rgba(6, 182, 212, 0.3)',
                      }
                    }
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
      
      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpened}
        onClose={() => {
          setConfirmModalOpened(false);
          setOpportunityToApply(null);
        }}
        title={
          <Title order={4} fw={700}>
            Confirm Application
          </Title>
        }
        centered
        size="md"
        styles={{
          header: {
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.5rem',
          },
          body: {
            padding: '1.5rem',
          }
        }}
      >
        <Stack gap="md">
          <Text size="md" style={{ lineHeight: 1.6 }}>
            Are you sure you want to apply for this internship? Your profile information, CV, and documents will be submitted for review.
          </Text>
          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setConfirmModalOpened(false);
                setOpportunityToApply(null);
              }}
              disabled={applyingId !== null}
              styles={{
                root: {
                  fontWeight: 600,
                  '&:hover': {
                    background: 'var(--bg-tertiary)',
                  }
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              loading={applyingId !== null}
              disabled={applyingId !== null}
              styles={{
                root: {
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0891b2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-md), 0 0 15px rgba(6, 182, 212, 0.3)',
                  }
                }
              }}
            >
              Confirm Application
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
