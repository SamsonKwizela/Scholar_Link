import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Stack,
  Group,
  Radio,
  Progress,
  Title,
  Text,
  Container,
  Card,
  Badge,
  Divider,
} from "@mantine/core";
import { assessmentQuestionsDB, calculateScore } from "../data/assessmentQuestions";

export function TestModal({ opened, onClose, assessmentId, onComplete }) {
  const assessment = assessmentQuestionsDB[assessmentId];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!assessment || !opened) return;
    setTimeLeft(assessment.timeLimit * 60); // Convert to seconds
  }, [opened, assessment]);

  // Timer countdown
  useEffect(() => {
    if (!opened || showResults || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [opened, showResults, timeLeft]);

  if (!assessment) {
    return (
      <Modal opened={opened} onClose={onClose} title="Loading assessment..." centered>
        <Container>
          <Text c="dimmed">Assessment not found or still loading. Please wait a moment and try again.</Text>
        </Container>
      </Modal>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleJump = (value) => {
    if (!value) return;
    setCurrentQuestionIndex(Number(value) - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const scoreData = calculateScore(assessmentId, answers);
    setResult(scoreData);
    setShowResults(true);
    if (onComplete) {
      onComplete(scoreData);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={assessment.title}
      size="lg"
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      {showResults ? (
        <Container>
          <Stack align="center" spacing="lg" py="xl">
            <Title order={3}>
              {result.passed ? "✅ You Passed!" : "❌ You Failed"}
            </Title>

            <Card className="question-card" withBorder p="lg" radius="lg" w="100%">
              <Group justify="center" mb="md">
                <div style={{ textAlign: "center" }}>
                  <Text size="sm" c="dimmed">
                    Your Score
                  </Text>
                  <Title order={2}>{result.percentage}%</Title>
                  <Text size="sm">
                    {result.score} / {result.maxScore} marks
                  </Text>
                </div>
              </Group>

              <Divider my="md" />

              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">
                    Passing Score
                  </Text>
                  <Text fw={700}>{result.passingScore}%</Text>
                </div>
                <Badge color={result.passed ? "green" : "red"} size="lg">
                  {result.passed ? "PASSED" : "FAILED"}
                </Badge>
              </Group>
            </Card>

            <Group>
              <Button
                variant="default"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setResult(null);
                  onClose();
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setResult(null);
                }}
              >
                Retake Test
              </Button>
            </Group>
          </Stack>
        </Container>
      ) : (
        <Stack>
          {/* Progress and Timer */}
          <Group justify="space-between" align="flex-end">
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" c="dimmed">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </Text>
              <Progress value={progress} mt="xs" size="sm" />
            </div>
            <Badge
              color={timeLeft < 300 ? "red" : "blue"}
              size="lg"
            >
              {minutes}:{seconds < 10 ? "0" : ""}{seconds}
            </Badge>
          </Group>
 
          <Divider />

          {/* Question */}
          <Card className="question-card" withBorder p="lg" radius="lg">
            <div>
              <Title order={4}>{currentQuestion.question}</Title>
              <Text size="sm" c="dimmed" mt="xs">
                ({currentQuestion.marks} marks)
              </Text>
            </div>

            <Radio.Group
              value={answers[currentQuestion.id] || ""}
              onChange={handleAnswer}
              name={`question-${currentQuestion.id}`}
            >
              <Stack gap="sm" mt="md">
                {currentQuestion.options.map((option, idx) => (
                  <Radio
                    key={idx}
                    value={option}
                    label={option}
                    p="md"
                    styles={{
                      radio: { cursor: "pointer" },
                      label: { cursor: "pointer", width: "100%" },
                    }}
                  />
                ))}
              </Stack>
            </Radio.Group>
          </Card>

          {/* Navigation */}
          <Group justify="space-between">
            <Button
              variant="default"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === assessment.questions.length - 1 ? (
              <Button onClick={handleSubmit} color="green">
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
