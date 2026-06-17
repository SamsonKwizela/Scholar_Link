import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
  Modal,
  Stack,
  Divider,
} from "@mantine/core";
import { TestModal } from "../components/TestModal";
import { assessmentQuestionsDB } from "../data/assessmentQuestions";
import { useDataManager } from "../utils/dataManager";

export default function Assessments() {
  const { assessments: assessmentsManager } = useDataManager();
  const [assessments, setAssessments] = useState([]);
  const [testModalOpened, setTestModalOpened] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [resultModalOpened, setResultModalOpened] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const loadAssessments = () => {
      try {
        const data = assessmentsManager.getAll();
        setAssessments(data);
      } catch (error) {
        console.error("Error loading assessments:", error);
        setAssessments([]);
      }
    };

    loadAssessments();

    // Listen for data changes
    const handleDataChange = () => {
      loadAssessments();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  const handleStartTest = (assessmentId) => {
    setSelectedAssessmentId(assessmentId);
    setTestModalOpened(true);
  };

  const handleTestComplete = (scoreData) => {
    const updatedAssessments = assessments.map((assessment) =>
      assessment.id === selectedAssessmentId
        ? {
            ...assessment,
            status: "Completed",
            score: `${scoreData.percentage}%`,
            resultData: scoreData,
            completedAt: new Date().toISOString(),
          }
        : assessment
    );

    setAssessments(updatedAssessments);

    // Update localStorage with completed assessment
    updatedAssessments.forEach(assessment => {
      if (assessment.id === selectedAssessmentId) {
        assessmentsManager.update(assessment.id, assessment);
      }
    });
  };

  const handleViewResult = (assessment) => {
    setSelectedResult(assessment);
    setResultModalOpened(true);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Assessments
      </Title>

      <Grid>
        {assessments.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{item.title}</Text>

                <Badge
                  color={
                    item.status === "Completed"
                      ? "green"
                      : item.status === "In Progress"
                      ? "blue"
                      : "gray"
                  }
                >
                  {item.status}
                </Badge>
              </Group>

              <Text size="sm">Type: {item.type}</Text>
              <Text size="sm">Duration: {item.duration}</Text>

              {item.score && (
                <Text size="sm" mt="xs">
                  Score: <b>{item.score}</b>
                </Text>
              )}

              <Button
                fullWidth
                mt="md"
                variant={item.status === "Completed" ? "light" : "filled"}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.status === "Completed") {
                    handleViewResult(item);
                  } else {
                    handleStartTest(item.id);
                  }
                }}
              >
                {item.status === "Completed"
                  ? "View Result"
                  : item.status === "In Progress"
                  ? "Continue"
                  : "Take Test"}
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <TestModal
        opened={testModalOpened}
        onClose={() => setTestModalOpened(false)}
        assessmentId={selectedAssessmentId}
        onComplete={handleTestComplete}
      />

      {/* Result View Modal - Read Only */}
      <Modal
        opened={resultModalOpened}
        onClose={() => setResultModalOpened(false)}
        title="Assessment Results"
        size="lg"
        centered
      >
        {selectedResult && selectedResult.resultData && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Assessment</Text>
                <Text fw={600} size="lg">{selectedResult.title}</Text>
              </div>
              <Badge
                size="lg"
                color={selectedResult.resultData.passed ? "green" : "red"}
              >
                {selectedResult.resultData.passed ? "PASSED" : "FAILED"}
              </Badge>
            </Group>

            <Divider />

            <Card withBorder p="lg" radius="lg">
              <Group justify="center" mb="md">
                <div style={{ textAlign: "center" }}>
                  <Text size="sm" c="dimmed">Your Score</Text>
                  <Title order={2}>{selectedResult.resultData.percentage}%</Title>
                  <Text size="sm">
                    {selectedResult.resultData.score} / {selectedResult.resultData.maxScore} marks
                  </Text>
                </div>
              </Group>

              <Divider my="md" />

              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">Passing Score</Text>
                  <Text fw={700}>{selectedResult.resultData.passingScore}%</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Completed On</Text>
                  <Text fw={700}>
                    {selectedResult.completedAt ? new Date(selectedResult.completedAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </div>
              </Group>
            </Card>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Test Details</Text>
              <Text>Type: {selectedResult.type}</Text>
              <Text>Duration: {selectedResult.duration}</Text>
            </div>

            <Group grow mt="md">
              <Button
                variant="default"
                onClick={() => setResultModalOpened(false)}
              >
                Close
              </Button>
            </Group>

            <Text size="sm" c="dimmed" ta="center">
              This assessment can only be taken once. Results are final.
            </Text>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}