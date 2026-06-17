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
  Stack,
  TextInput,
  Select,
  SimpleGrid,
  Modal,
  Divider,
  Image,
} from "@mantine/core";
import { IconAlertCircle, IconSearch, IconFilter, IconClock, IconCheck, IconX } from "@tabler/icons-react";
import { useDataManager } from "../utils/dataManager";

export default function FiledApplications() {
  const { applications: applicationsManager } = useDataManager();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const loadApplications = () => {
      try {
        const data = applicationsManager.getAll();
        setApplications(data);
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();

    // Listen for data changes
    const handleDataChange = () => {
      loadApplications();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.scholarship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.title && app.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "Pending").length,
    approved: applications.filter(app => app.status === "Approved").length,
    rejected: applications.filter(app => app.status === "Rejected").length,
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "green";
      case "Rejected": return "red";
      case "Pending": return "yellow";
      case "Assessment Required": return "blue";
      default: return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return <IconCheck size={16} />;
      case "Rejected": return <IconX size={16} />;
      case "Pending": return <IconClock size={16} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Center h="60vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Filed Applications
      </Title>

      {/* Statistics Cards */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">Total Applications</Text>
          <Title order={3}>{stats.total}</Title>
        </Card>
        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">Pending</Text>
          <Title order={3} c="yellow">{stats.pending}</Title>
        </Card>
        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">Approved</Text>
          <Title order={3} c="green">{stats.approved}</Title>
        </Card>
        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">Rejected</Text>
          <Title order={3} c="red">{stats.rejected}</Title>
        </Card>
      </SimpleGrid>

      {/* Search and Filter */}
      <Group mb="md">
        <TextInput
          placeholder="Search applications..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by status"
          leftSection={<IconFilter size={16} />}
          data={[
            { value: "all", label: "All Status" },
            { value: "Pending", label: "Pending" },
            { value: "Approved", label: "Approved" },
            { value: "Rejected", label: "Rejected" },
            { value: "Assessment Required", label: "Assessment Required" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          w={200}
        />
      </Group>

      {applications.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          color="blue"
          title="No Applications Found"
          variant="light"
        >
          You have not submitted any scholarship applications yet. Start exploring scholarships and apply to track your applications here.
        </Alert>
      ) : filteredApplications.length === 0 ? (
        <Alert
          icon={<IconSearch size={18} />}
          color="gray"
          title="No Results Found"
          variant="light"
        >
          No applications match your search criteria. Try adjusting your filters or search term.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {filteredApplications.map((app, index) => (
            <Card
              key={app.id || index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedApplication(app);
                setModalOpened(true);
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text fw={600} lineClamp={1}>
                  {app.scholarship || app.title || "Untitled Application"}
                </Text>

                <Badge
                  color={getStatusColor(app.status)}
                  leftSection={getStatusIcon(app.status)}
                >
                  {app.status || "Pending"}
                </Badge>
              </Group>

              <Divider my="xs" />

              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Applied:{" "}
                  {app.date
                    ? new Date(app.date).toLocaleDateString()
                    : app.appliedDate
                    ? new Date(app.appliedDate).toLocaleDateString()
                    : "N/A"}
                </Text>

                {app.applicationData && (
                  <>
                    <Text size="sm" c="dimmed">
                      Amount: {app.applicationData.scholarshipAmount || "N/A"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Field: {app.applicationData.scholarshipField || "N/A"}
                    </Text>
                  </>
                )}
              </Stack>

              <Button 
                variant="light" 
                fullWidth 
                mt="md"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedApplication(app);
                  setModalOpened(true);
                }}
              >
                View Details
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Application Details Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Application Details"
        size="lg"
        centered
      >
        {selectedApplication && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Scholarship</Text>
                <Text fw={600} size="lg">{selectedApplication.scholarship || selectedApplication.title}</Text>
              </div>
              <Badge
                size="lg"
                color={getStatusColor(selectedApplication.status)}
                leftSection={getStatusIcon(selectedApplication.status)}
              >
                {selectedApplication.status}
              </Badge>
            </Group>

            <Divider />

            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed">Application Date</Text>
                <Text>
                  {selectedApplication.date
                    ? new Date(selectedApplication.date).toLocaleDateString()
                    : selectedApplication.appliedDate
                    ? new Date(selectedApplication.appliedDate).toLocaleDateString()
                    : "N/A"}
                </Text>
              </div>

              {selectedApplication.scholarshipId && (
                <div>
                  <Text size="sm" c="dimmed">Scholarship ID</Text>
                  <Text>{selectedApplication.scholarshipId}</Text>
                </div>
              )}

              {selectedApplication.applicationData && (
                <>
                  <div>
                    <Text size="sm" c="dimmed">Scholarship Amount</Text>
                    <Text fw={700}>{selectedApplication.applicationData.scholarshipAmount || "N/A"}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Field of Study</Text>
                    <Text>{selectedApplication.applicationData.scholarshipField || "N/A"}</Text>
                  </div>
                </>
              )}

              <div>
                <Text size="sm" c="dimmed" mb="xs">Application Status</Text>
                <Text>
                  {selectedApplication.status === "Approved" && "Your application has been approved. Congratulations!"}
                  {selectedApplication.status === "Pending" && "Your application is currently under review. We will notify you of any updates."}
                  {selectedApplication.status === "Assessment Required" && "Please complete the required assessment to proceed with your application."}
                  {selectedApplication.status === "Rejected" && "Unfortunately, your application was not successful. You can apply for other scholarships."}
                </Text>
              </div>
            </Stack>

            <Divider />

            <Group grow>
              <Button
                variant="light"
                onClick={() => setModalOpened(false)}
              >
                Close
              </Button>
              {selectedApplication.status === "Assessment Required" && (
                <Button color="blue">
                  Take Assessment
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}