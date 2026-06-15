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
} from "@mantine/core";
import { TestModal } from "../components/TestModal";
import { assessmentQuestionsDB } from "../data/assessmentQuestions";
import { useDataManager } from "../utils/dataManager";

export default function Assessments() {
  const { assessments: assessmentsManager } = useDataManager();
  const [assessments, setAssessments] = useState([]);
  const [testModalOpened, setTestModalOpened] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

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
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === selectedAssessmentId
          ? {
              ...assessment,
              status: "Completed",
              score: `${scoreData.percentage}%`,
            }
          : assessment
      )
    );
  };

  const handleViewResult = (assessmentId) => {
    setSelectedAssessmentId(assessmentId);
    setTestModalOpened(true);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Assessments
      </Title>

      <Grid>
        {assessments.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
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
                onClick={() => {
                  if (item.status === "Completed") {
                    handleViewResult(item.id);
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
    </Container>
  );
}