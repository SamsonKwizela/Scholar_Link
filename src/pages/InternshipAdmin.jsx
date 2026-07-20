import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  Switch,
  Group,
  Alert,
  Loader,
  Center,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  Text,
  Paper,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconBriefcase,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
} from "../utils/api";

export default function InternshipAdmin() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [modalOpened, setModalOpened] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmOpened, setDeleteConfirmOpened] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    locationType: "remote",
    category: "technology",
    isActive: true,
    applicationUrl: "",
    tags: "",
  });

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getInternships();
      setInternships(data);
    } catch (error) {
      console.error("Error loading internships:", error);
      setError("Failed to load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      company: "",
      description: "",
      location: "",
      locationType: "remote",
      category: "technology",
      isActive: true,
      applicationUrl: "",
      tags: "",
    });
    setModalOpened(true);
  };

  const openEditModal = (internship) => {
    setEditingId(internship._id);
    setFormData({
      title: internship.title || "",
      company: internship.company || "",
      description: internship.description || "",
      location: internship.location || "",
      locationType: internship.locationType || "remote",
      category: internship.category || "technology",
      isActive: internship.isActive ?? true,
      applicationUrl: internship.applicationUrl || "",
      tags: Array.isArray(internship.tags) ? internship.tags.join(", ") : "",
    });
    setModalOpened(true);
  };

  const openDeleteConfirm = (internship) => {
    setInternshipToDelete(internship);
    setDeleteConfirmOpened(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Validate required fields
      if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
        setError("Title, company, and description are required.");
        setSaving(false);
        return;
      }

      // Prepare data for API
      const data = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      if (editingId) {
        // Update existing internship
        await updateInternship(editingId, data);
        setSuccess("Internship updated successfully!");
      } else {
        // Create new internship
        await createInternship(data);
        setSuccess("Internship created successfully!");
      }

      setModalOpened(false);
      await loadInternships();
    } catch (error) {
      console.error("Error saving internship:", error);
      setError(error.message || "Failed to save internship. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!internshipToDelete) return;

    try {
      setSaving(true);
      setError("");
      await deleteInternship(internshipToDelete._id);
      setSuccess("Internship deleted successfully!");
      setDeleteConfirmOpened(false);
      setInternshipToDelete(null);
      await loadInternships();
    } catch (error) {
      console.error("Error deleting internship:", error);
      setError(error.message || "Failed to delete internship. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} fw={800}>
            Internship Management
          </Title>
          <Text size="sm" c="dimmed">
            Create, edit, and manage internship postings
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={openCreateModal}
          size="md"
          radius="md"
        >
          Create Internship
        </Button>
      </Group>

      {/* Alerts */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Error"
          color="red"
          mb="md"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          icon={<IconBriefcase size={18} />}
          title="Success"
          color="green"
          mb="md"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* Internships List */}
      {internships.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{ textAlign: "center", background: "var(--bg-secondary)" }}
        >
          <IconBriefcase size={48} stroke={1} color="var(--text-dimmed)" />
          <Text mt="md" c="dimmed">
            No internships found. Create your first internship to get started.
          </Text>
        </Paper>
      ) : (
        <Stack gap="md">
          {internships.map((internship) => (
            <Paper
              key={internship._id}
              p="lg"
              radius="lg"
              withBorder
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                transition: "all 0.3s ease",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Group gap="sm" mb="xs">
                    <Title order={4} fw={700}>
                      {internship.title}
                    </Title>
                    <Badge
                      color={internship.isActive ? "green" : "red"}
                      variant="light"
                      size="sm"
                    >
                      {internship.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed" fw={500} mb="xs">
                    {internship.company}
                  </Text>
                  <Text size="sm" c="dimmed" lineClamp={2} mb="sm">
                    {internship.description}
                  </Text>
                  <Group gap="xs">
                    <Badge variant="light" size="xs">
                      {internship.locationType}
                    </Badge>
                    <Badge variant="light" size="xs" color="cyan">
                      {internship.category}
                    </Badge>
                    {internship.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" size="xs">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </div>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={() => openEditModal(internship)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      onClick={() => openDeleteConfirm(internship)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Title order={4} fw={700}>
            {editingId ? "Edit Internship" : "Create New Internship"}
          </Title>
        }
        centered
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="e.g., Software Engineering Intern"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />

          <TextInput
            label="Company"
            placeholder="e.g., Google, Microsoft, StartupXYZ"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe the internship role, responsibilities, and requirements..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            minRows={4}
            required
          />

          <Group grow>
            <TextInput
              label="Location"
              placeholder="e.g., San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />

            <Select
              label="Location Type"
              value={formData.locationType}
              onChange={(value) => handleInputChange("locationType", value)}
              data={[
                { value: "remote", label: "Remote" },
                { value: "onsite", label: "On-site" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
          </Group>

          <Group grow>
            <Select
              label="Category"
              value={formData.category}
              onChange={(value) => handleInputChange("category", value)}
              data={[
                { value: "technology", label: "Technology" },
                { value: "engineering", label: "Engineering" },
                { value: "business", label: "Business" },
                { value: "marketing", label: "Marketing" },
                { value: "design", label: "Design" },
                { value: "finance", label: "Finance" },
                { value: "healthcare", label: "Healthcare" },
                { value: "education", label: "Education" },
              ]}
            />

            <TextInput
              label="Application URL"
              placeholder="https://..."
              value={formData.applicationUrl}
              onChange={(e) => handleInputChange("applicationUrl", e.target.value)}
            />
          </Group>

          <TextInput
            label="Tags"
            placeholder="e.g., react, nodejs, python (comma-separated)"
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            description="Separate tags with commas"
          />

          <Switch
            label="Active"
            description="Make this internship visible to students"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.currentTarget.checked)}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setModalOpened(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={saving}>
              {editingId ? "Update" : "Create"} Internship
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpened}
        onClose={() => {
          setDeleteConfirmOpened(false);
          setInternshipToDelete(null);
        }}
        title={
          <Title order={4} fw={700}>
            Confirm Deletion
          </Title>
        }
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete the internship{" "}
            <Text span fw={700}>
              "{internshipToDelete?.title}"
            </Text>
            ? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                setDeleteConfirmOpened(false);
                setInternshipToDelete(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={saving}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}