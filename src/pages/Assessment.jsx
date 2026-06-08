import { useState } from "react";
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

const initialAssessments = [
  {
    id: 1,
    title: "Scholarship Eligibility Test",
    type: "Aptitude",
    status: "Not Started",
    duration: "30 mins",
    score: null,
  },
  {
    id: 2,
    title: "English Proficiency Assessment",
    type: "Language",
    status: "Not Started",
    duration: "45 mins",
    score: null,
  },
  {
    id: 3,
    title: "General Knowledge Test",
    type: "Quiz",
    status: "Not Started",
    duration: "20 mins",
    score: null,
  },
];

export default function Assessments() {
  const [assessments, setAssessments] = useState(initialAssessments);
  const [testModalOpened, setTestModalOpened] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

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