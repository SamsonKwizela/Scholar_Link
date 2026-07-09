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
  Alert,
  ThemeIcon,
  Stack,
  Divider,
  TextInput,
  SegmentedControl,
  Modal,
  Notification,
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
import { useDataManager } from "../utils/dataManager";
import { useNotifications } from "../context/NotificationContext";
import { applyToOpportunity } from "../utils/api";

export default function Scholarships() {
  const { scholarships: scholarshipsManager, applications } = useDataManager();
  const { addNotification } = useNotifications();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applyingId, setApplyingId] = useState(null);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  const [opportunityToApply, setOpportunityToApply] = useState(null);

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
    const loadScholarships = () => {
      try {
        const data = scholarshipsManager.getAll();
        setScholarships(data);
      } catch (error) {
        console.error("Error loading scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();

    // Listen for data changes
    const handleDataChange = () => {
      loadScholarships();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

 
  // APPLY FUNCTION
  
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
        scholarshipId: id,
        type: 'scholarship'
      });

      // Add application to localStorage for tracking
      const scholarship = scholarships.find(s => s.id === id);
      if (scholarship) {
        applications.add({
          scholarship: scholarship.title,
          status: "Pending",
          date: new Date().toISOString().split('T')[0],
          scholarshipId: id,
        });
      }

      // Show success notification
      addNotification({
        title: "Application Submitted Successfully",
        message: "Your profile information, CV, assessment results, and documents have been sent for review.",
        type: "success",
      });

      // Open external URL if available
      if (url && url.trim() !== "") {
        window.open(url, "_blank", "noopener,noreferrer");
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
      <Group justify="space-between" mb="xl" className="animate-fade-in">
        <div>
          <Title 
            order={2} 
            fw={800}
            style={{ 
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Available Scholarships
          </Title>
          <Text c="dimmed" size="sm">
            Discover and apply for scholarships from different providers
          </Text>
        </div>

        <Badge 
          size="lg" 
          color="blue" 
          variant="light"
          style={{ 
            fontWeight: 600,
            padding: '8px 16px'
          }}
        >
          {scholarships.length} {scholarships.length === 1 ? 'Scholarship' : 'Scholarships'}
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
          {scholarships.map((item, index) => (
            <Grid.Col key={item._id} span={{ base: 12, sm: 6, lg: 4 }} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <Card 
                shadow="md" 
                radius="xl" 
                padding="lg" 
                withBorder 
                h="100%"
                className="card-smooth"
                style={{ 
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
              >
                {/* HEADER */}
                <Group justify="space-between" mb="md" align="flex-start">
                  <Group gap="sm" align="center">
                    <ThemeIcon 
                      size={50} 
                      radius="lg" 
                      variant="light"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <IconSchool size={24} />
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
                        {item.title || "Untitled Scholarship"}
                      </Text>
                      <Text size="sm" c="dimmed" fw={500}>
                        {item.provider || "Unknown Provider"}
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
                    {item.isActive ? "Active" : "Closed"}
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
                    <IconCategory size={16} style={{ color: 'var(--primary-600)' }} />
                    <Text size="sm" fw={500}>{item.category || "General"}</Text>
                  </Group>

                  <Group gap="xs" align="center">
                    <IconAward size={16} style={{ color: 'var(--accent-gold)' }} />
                    <Text size="sm" fw={500}>{item.level || "All Levels"}</Text>
                  </Group>

                  <Group gap="xs" align="center">
                    <IconMapPin size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <Text size="sm" fw={500}>{formatLocation(item.location)}</Text>
                  </Group>

                  <Group gap="xs" align="center">
                    <IconCalendar size={16} style={{ color: 'var(--accent-teal)' }} />
                    <Text size="sm" fw={500}>
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

                {/* BUTTONS */}
                <Group grow mt="xl" gap="sm">
                  <Button
                    variant="light"
                    size="sm"
                    radius="md"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelected(item);
                    }}
                    styles={{
                      root: {
                        fontWeight: 600,
                        '&:hover': {
                          background: 'var(--bg-tertiary)',
                        }
                      }
                    }}
                  >
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    radius="md"
                    loading={applyingId === item._id}
                    disabled={applyingId !== null || !item.isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      openConfirmModal(item._id, item.applicationUrl);
                    }}
                    styles={{
                      root: {
                        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: 'var(--shadow-md), 0 0 15px rgba(59, 130, 246, 0.3)',
                        }
                      }
                    }}
                  >
                    {applyingId === item._id ? 'Applying...' : 'Apply Now'}
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
        title={
          <Title order={3} fw={700}>
            Scholarship Details
          </Title>
        }
        centered
        size="lg"
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
        {selected && (
          <Stack gap="md">
            <div>
              <Title order={3} fw={800} style={{ letterSpacing: '-0.02em' }}>
                {selected.title}
              </Title>
              <Text c="dimmed" fw={500} mt="xs">
                {selected.provider}
              </Text>
            </div>

            <Divider />

            <Text size="sm" style={{ lineHeight: 1.7 }}>
              {selected.description}
            </Text>

            <SimpleGrid cols={2} spacing="md">
              <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
                <Text fw={600} size="sm" c="dimmed" mb="xs">Category</Text>
                <Text fw={700} size="md">{selected.category}</Text>
              </Card>

              <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
                <Text fw={600} size="sm" c="dimmed" mb="xs">Level</Text>
                <Text fw={700} size="md">{selected.level}</Text>
              </Card>

              <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
                <Text fw={600} size="sm" c="dimmed" mb="xs">Location</Text>
                <Text fw={700} size="md">
                  {formatLocation(selected.location)}
                </Text>
              </Card>

              <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
                <Text fw={600} size="sm" c="dimmed" mb="xs">Deadline</Text>
                <Text fw={700} size="md">
                  {selected.deadline
                    ? new Date(selected.deadline).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Card>
            </SimpleGrid>

            <Divider />

            <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
              <Group mb="xs">
                <IconBook size={18} style={{ color: 'var(--primary-600)' }} />
                <Text fw={700} size="md">Requirements</Text>
              </Group>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                {formatRequirements(selected.requirements)}
              </Text>
            </Card>

            <Card withBorder p="md" radius="lg" style={{ background: 'var(--bg-tertiary)' }}>
              <Group mb="xs">
                <IconAward size={18} style={{ color: 'var(--accent-gold)' }} />
                <Text fw={700} size="md">Benefits</Text>
              </Group>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                {formatBenefits(selected.benefits)}
              </Text>
            </Card>

            <Button
              fullWidth
              mt="md"
              size="lg"
              radius="lg"
              rightSection={<IconWorld size={18} />}
              onClick={() =>
                openConfirmModal(selected._id, selected.applicationUrl)
              }
              styles={{
                root: {
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.3)',
                  }
                }
              }}
            >
              Apply Now
            </Button>
          </Stack>
        )}
      </Modal>

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
            Are you sure you want to apply for this scholarship? Your profile information, CV, and documents will be submitted for review.
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
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-md), 0 0 15px rgba(59, 130, 246, 0.3)',
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
