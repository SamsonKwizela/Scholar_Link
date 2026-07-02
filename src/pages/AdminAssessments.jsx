import {
  Container,
  Title,
  Card,
  Button,
  Table,
  Badge,
  Group,
  Text,
  Modal,
  TextInput,
  Select,
  Textarea,
  NumberInput,
  Switch,
  Stack,
  ActionIcon,
  Loader,
  Alert,
  SimpleGrid,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  getAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "../utils/api";

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    instructions: "",
    duration: 30,
    passingScore: 60,
    totalMarks: 100,
    deadline: "",
    isActive: true,
  });

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await getAssessments();
      setAssessments(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleOpenModal = (assessment = null) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setFormData({
        title: assessment.title,
        subject: assessment.subject,
        instructions: assessment.instructions,
        duration: assessment.duration,
        passingScore: assessment.passingScore,
        totalMarks: assessment.totalMarks,
        deadline: assessment.deadline.split("T")[0],
        isActive: assessment.isActive,
      });
    } else {
      setEditingAssessment(null);
      setFormData({
        title: "",
        subject: "",
        instructions: "",
        duration: 30,
        passingScore: 60,
        totalMarks: 100,
        deadline: "",
        isActive: true,
      });
    }
    setModalOpened(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingAssessment) {
        await updateAssessment(editingAssessment._id, formData);
      } else {
        await createAssessment(formData);
      }
      setModalOpened(false);
      loadAssessments();
    } catch (err) {
      setError(err.message || "Failed to save assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      await deleteAssessment(id);
      loadAssessments();
    } catch (err) {
      setError(err.message || "Failed to delete assessment");
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "Mathematics":
        return "blue";
      case "Psychology":
        return "violet";
      case "General Knowledge":
        return "green";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h="50vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Assessment Management</Title>
          <Text c="dimmed">Create and manage assessments for students</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => handleOpenModal()}
        >
          Create Assessment
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      <Card withBorder shadow="sm">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Total Marks</Table.Th>
              <Table.Th>Passing Score</Table.Th>
              <Table.Th>Deadline</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {assessments.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8} ta="center">
                  <Text c="dimmed">No assessments found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              assessments.map((assessment) => (
                <Table.Tr key={assessment._id}>
                  <Table.Td>
                    <Text fw={500}>{assessment.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getSubjectColor(assessment.subject)}>
                      {assessment.subject}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{assessment.duration} min</Table.Td>
                  <Table.Td>{assessment.totalMarks}</Table.Td>
                  <Table.Td>{assessment.passingScore}%</Table.Td>
                  <Table.Td>
                    {new Date(assessment.deadline).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={assessment.isActive ? "green" : "red"}
                      variant="light"
                    >
                      {assessment.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        size="sm"
                        variant="light"
                        color="blue"
                        onClick={() => handleOpenModal(assessment)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(assessment._id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingAssessment ? "Edit Assessment" : "Create Assessment"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <TextInput
              label="Title"
              placeholder="Assessment title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Select
              label="Subject"
              placeholder="Select subject"
              data={[
                "Mathematics",
                "Psychology",
                "General Knowledge",
              ]}
              value={formData.subject}
              onChange={(value) =>
                setFormData({ ...formData, subject: value })
              }
              required
            />

            <Textarea
              label="Instructions"
              placeholder="Assessment instructions"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              minRows={3}
              required
            />

            <SimpleGrid cols={3}>
              <NumberInput
                label="Duration (minutes)"
                value={formData.duration}
                onChange={(value) =>
                  setFormData({ ...formData, duration: value })
                }
                min={1}
                required
              />

              <NumberInput
                label="Passing Score (%)"
                value={formData.passingScore}
                onChange={(value) =>
                  setFormData({ ...formData, passingScore: value })
                }
                min={0}
                max={100}
                required
              />

              <NumberInput
                label="Total Marks"
                value={formData.totalMarks}
                onChange={(value) =>
                  setFormData({ ...formData, totalMarks: value })
                }
                min={1}
                required
              />
            </SimpleGrid>

            <TextInput
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              required
            />

            <Switch
              label="Active"
              description="Enable this assessment for students"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.currentTarget.checked })
              }
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={() => setModalOpened(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {editingAssessment ? "Update" : "Create"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
