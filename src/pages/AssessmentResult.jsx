import {
  Container,
  Title,
  Card,
  Button,
  Badge,
  Group,
  Text,
  Stack,
  Loader,
  Alert,
  SimpleGrid,
  Progress,
  Center,
  ThemeIcon,
  List,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconX,
  IconTrophy,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt } from "../utils/api";

export default function AssessmentResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResult();
  }, [attemptId]);

  const loadResult = async () => {
    setLoading(true);
    try {
      const data = await getAttempt(attemptId);
      setAttempt(data.data);
    } catch (err) {
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "green";
      case "B":
        return "blue";
      case "C":
        "yellow";
      case "D":
        return "orange";
      default:
        return "red";
    }
  };

  const getGradeIcon = (grade) => {
    if (grade === "A" || grade === "B") return <IconTrophy size={32} />;
    return <IconCheck size={32} />;
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

  if (!attempt) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Result not found
        </Alert>
      </Container>
    );
  }

  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = attempt.answers.length - correctCount;

  return (
    <Container size="xl" py="xl">
      <Button
        variant="default"
        mb="xl"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/assessments")}
      >
        Back to Assessments
      </Button>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      {/* Score Card */}
      <Card withBorder shadow="md" padding="xl" mb="xl">
        <Stack align="center">
          <ThemeIcon
            size={80}
            radius="50%"
            color={getGradeColor(attempt.grade)}
            variant="light"
          >
            {getGradeIcon(attempt.grade)}
          </ThemeIcon>

          <Title order={2}>Assessment Result</Title>
          <Text size="xl" fw={600}>
            {attempt.assessmentId.title}
          </Text>

          <SimpleGrid cols={3} w="100%" mt="md">
            <Card withBorder padding="md" ta="center">
              <Text size="sm" c="dimmed">
                Score
              </Text>
              <Text size="xl" fw={700} c="blue">
                {attempt.score}
              </Text>
            </Card>

            <Card withBorder padding="md" ta="center">
              <Text size="sm" c="dimmed">
                Percentage
              </Text>
              <Text size="xl" fw={700} c="blue">
                {attempt.percentage.toFixed(1)}%
              </Text>
            </Card>

            <Card withBorder padding="md" ta="center">
              <Text size="sm" c="dimmed">
                Grade
              </Text>
              <Badge
                size="xl"
                color={getGradeColor(attempt.grade)}
                variant="filled"
              >
                {attempt.grade}
              </Badge>
            </Card>
          </SimpleGrid>

          <Card withBorder padding="md" w="100%">
            <Group justify="space-between">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconCheck size={16} color green />
                  <Text size="sm">Correct: {correctCount}</Text>
                </Group>
                <Group gap="xs">
                  <IconX size={16} color red />
                  <Text size="sm">Incorrect: {incorrectCount}</Text>
                </Group>
              </Stack>
              <Stack gap="xs" align="flex-end">
                <Text size="sm" c="dimmed">
                  Passing Score: {attempt.assessmentId.passingScore}%
                </Text>
                <Badge
                  color={attempt.percentage >= attempt.assessmentId.passingScore ? "green" : "red"}
                  variant="light"
                  size="lg"
                >
                  {attempt.percentage >= attempt.assessmentId.passingScore
                    ? "PASSED"
                    : "FAILED"}
                </Badge>
              </Stack>
            </Group>
          </Card>
        </Stack>
      </Card>

      {/* Detailed Results */}
      <Card withBorder shadow="sm" padding="xl">
        <Title order={3} mb="md">
          Detailed Results
        </Title>

        <Stack gap="md">
          {attempt.answers.map((answer, index) => {
            const question = answer.questionId;
            return (
              <Card
                key={answer.questionId._id}
                withBorder
                padding="md"
                style={{
                  borderColor: answer.isCorrect ? "var(--mantine-color-green-4)" : "var(--mantine-color-red-4)",
                }}
              >
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge color="blue" size="sm">
                        Q{index + 1}
                      </Badge>
                      <Badge
                        color={answer.isCorrect ? "green" : "red"}
                        variant="light"
                        size="sm"
                      >
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                      <Badge color="gray" variant="light" size="sm">
                        {question.marks} marks
                      </Badge>
                    </Group>
                    {answer.isCorrect ? (
                      <IconCheck size={20} color green />
                    ) : (
                      <IconX size={20} color red />
                    )}
                  </Group>

                  <Text fw={500}>{question.questionText}</Text>

                  <Stack gap="xs">
                    <Text size="sm" fw={600}>
                      Options:
                    </Text>
                    <List spacing="xs" size="sm">
                      {question.options.map((option, optIndex) => {
                        const optionLetter = String.fromCharCode(65 + optIndex);
                        const isCorrectAnswer = optionLetter === question.correctAnswer;
                        const isSelected = optionLetter === answer.selectedAnswer;

                        return (
                          <List.Item
                            key={optIndex}
                            icon={
                              isCorrectAnswer ? (
                                <IconCheck size={14} color green />
                              ) : isSelected && !isCorrectAnswer ? (
                                <IconX size={14} color red />
                              ) : null
                            }
                            c={
                              isCorrectAnswer
                                ? "green"
                                : isSelected && !isCorrectAnswer
                                ? "red"
                                : "dimmed"
                            }
                            fw={isSelected ? 600 : 400}
                          >
                            {optionLetter}. {option}
                            {isCorrectAnswer && " (Correct Answer)"}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Stack>

                  {question.explanation && (
                    <Card withBorder padding="sm" bg="gray.0">
                      <Text size="sm" fw={600} mb="xs">
                        Explanation:
                      </Text>
                      <Text size="sm">{question.explanation}</Text>
                    </Card>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Card>
    </Container>
  );
}
