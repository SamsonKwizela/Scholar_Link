import {
  Container,
  Title,
  Card,
  Button,
  Badge,
  Group,
  Text,
  Select,
  Stack,
  Loader,
  Alert,
  SimpleGrid,
  Modal,
  Progress,
  Center,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconX,
  IconEye,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAssessments,
  getStudentAttempts,
  startAssessmentAttempt,
} from "../utils/api";

export default function StudentAssessments() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [starting, setStarting] = useState(false);
  const [instructionsModalOpened, setInstructionsModalOpened] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadData = async () => {
    setLoading(true);
    try {
      const [assessmentsData, attemptsData] = await Promise.all([
        getAssessments({ isActive: "true", subject: filterSubject }),
        getStudentAttempts(user.id),
      ]);
      setAssessments(assessmentsData.data || []);
      setAttempts(attemptsData.data || []);
    } catch (err) {
      setError(err.message || "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterSubject]);

  const handleStartAssessment = async (assessment) => {
    setSelectedAssessment(assessment);
    setInstructionsModalOpened(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedAssessment) return;

    setStarting(true);
    try {
      const attempt = await startAssessmentAttempt(selectedAssessment._id);
      navigate(`/assessment/${attempt.data._id}`);
    } catch (err) {
      setError(err.message || "Failed to start assessment");
      setInstructionsModalOpened(false);
    } finally {
      setStarting(false);
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

  const getAttemptStatus = (assessmentId) => {
    const attempt = attempts.find((a) => a.assessmentId._id === assessmentId);
    if (!attempt) return null;
    return attempt;
  };

  const isDeadlinePassed = (deadline) => {
    return new Date() > new Date(deadline);
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
          <Title order={2}>Available Assessments</Title>
          <Text c="dimmed">Take assessments to improve your scholarship eligibility</Text>
        </div>
        <Select
          placeholder="Filter by subject"
          data={[
            { value: "", label: "All Subjects" },
            { value: "Mathematics", label: "Mathematics" },
            { value: "Psychology", label: "Psychology" },
            { value: "General Knowledge", label: "General Knowledge" },
          ]}
          value={filterSubject}
          onChange={setFilterSubject}
          w={200}
        />
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {assessments.length === 0 ? (
          <Alert icon={<IconAlertCircle size={16} />} color="blue" colSpan={3}>
            No assessments available at the moment
          </Alert>
        ) : (
          assessments.map((assessment) => {
            const attempt = getAttemptStatus(assessment._id);
            const deadlinePassed = isDeadlinePassed(assessment.deadline);

            return (
              <Card
                key={assessment._id}
                shadow="sm"
                withBorder
                padding="lg"
                radius="md"
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <Badge color={getSubjectColor(assessment.subject)}>
                      {assessment.subject}
                    </Badge>
                    {deadlinePassed && (
                      <Badge color="red" variant="light">
                        Expired
                      </Badge>
                    )}
                  </Group>

                  <Title order={4}>{assessment.title}</Title>

                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {assessment.instructions}
                  </Text>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconClock size={16} />
                      <Text size="sm">{assessment.duration} minutes</Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm">Total Marks: {assessment.totalMarks}</Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm">
                        Passing Score: {assessment.passingScore}%
                      </Text>
                    </Group>
                  </Stack>

                  {attempt ? (
                    <Stack gap="xs">
                      <Badge
                        color={
                          attempt.status === "completed"
                            ? "green"
                            : attempt.status === "in_progress"
                            ? "yellow"
                            : "gray"
                        }
                        variant="light"
                      >
                        {attempt.status === "completed"
                          ? "Completed"
                          : attempt.status === "in_progress"
                          ? "In Progress"
                          : "Submitted"}
                      </Badge>
                      {attempt.status === "submitted" && (
                        <Group gap="xs">
                          <Text size="sm">Score: {attempt.score}</Text>
                          <Text size="sm">Grade: {attempt.grade}</Text>
                        </Group>
                      )}
                      {attempt.status === "in_progress" && (
                        <Button
                          fullWidth
                          onClick={() =>
                            navigate(`/assessment/${attempt._id}`)
                          }
                        >
                          Resume
                        </Button>
                      )}
                      {attempt.status === "submitted" && (
                        <Button
                          fullWidth
                          variant="light"
                          onClick={() =>
                            navigate(`/assessment-result/${attempt._id}`)
                          }
                        >
                          View Results
                        </Button>
                      )}
                    </Stack>
                  ) : deadlinePassed ? (
                    <Button fullWidth disabled>
                      Deadline Passed
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      onClick={() => handleStartAssessment(assessment)}
                    >
                      Start Assessment
                    </Button>
                  )}
                </Stack>
              </Card>
            );
          })
        )}
      </SimpleGrid>

      <Modal
        opened={instructionsModalOpened}
        onClose={() => setInstructionsModalOpened(false)}
        title="Assessment Instructions"
        size="lg"
      >
        {selectedAssessment && (
          <Stack>
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              Please read the instructions carefully before starting the assessment.
            </Alert>

            <div>
              <Text fw={600} mb="xs">
                {selectedAssessment.title}
              </Text>
              <Badge color={getSubjectColor(selectedAssessment.subject)}>
                {selectedAssessment.subject}
              </Badge>
            </div>

            <Card withBorder padding="md">
              <Text fw={600} mb="xs">Instructions:</Text>
              <Text size="sm">{selectedAssessment.instructions}</Text>
            </Card>

            <SimpleGrid cols={2}>
              <Card withBorder padding="sm">
                <Group gap="xs">
                  <IconClock size={16} />
                  <Text size="sm">Duration</Text>
                </Group>
                <Text fw={500}>{selectedAssessment.duration} minutes</Text>
              </Card>

              <Card withBorder padding="sm">
                <Group gap="xs">
                  <IconCheck size={16} />
                  <Text size="sm">Passing Score</Text>
                </Group>
                <Text fw={500}>{selectedAssessment.passingScore}%</Text>
              </Card>

              <Card withBorder padding="sm">
                <Group gap="xs">
                  <Text size="sm">Total Marks</Text>
                </Group>
                <Text fw={500}>{selectedAssessment.totalMarks}</Text>
              </Card>

              <Card withBorder padding="sm">
                <Group gap="xs">
                  <Text size="sm">Deadline</Text>
                </Group>
                <Text fw={500}>
                  {new Date(selectedAssessment.deadline).toLocaleDateString()}
                </Text>
              </Card>
            </SimpleGrid>

            <Alert icon={<IconAlertCircle size={16} />} color="yellow">
              <Text size="sm">
                Once you start the assessment, the timer will begin. You cannot
                pause the assessment. Make sure you have a stable internet
                connection.
              </Text>
            </Alert>

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={() => setInstructionsModalOpened(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmStart}
                loading={starting}
                disabled={starting}
              >
                Start Now
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
