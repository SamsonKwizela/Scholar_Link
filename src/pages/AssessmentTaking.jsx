import {
  Container,
  Title,
  Card,
  Button,
  Radio,
  Group,
  Text,
  Stack,
  Loader,
  Alert,
  Progress,
  SimpleGrid,
  Badge,
  Modal,
  Center,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconClock,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssessment,
  getQuestions,
  getAttempt,
  saveAttemptAnswers,
  submitAssessmentAttempt,
} from "../utils/api";

export default function AssessmentTaking() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpened, setConfirmSubmitOpened] = useState(false);
  const autoSaveInterval = useRef(null);

  useEffect(() => {
    loadData();
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [attemptId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  useEffect(() => {
    // Auto-save answers every 30 seconds
    autoSaveInterval.current = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        handleAutoSave();
      }
    }, 30000);

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [answers]);

  const loadData = async () => {
    setLoading(true);
    try {
      const attemptData = await getAttempt(attemptId);
      setAttempt(attemptData.data);

      const assessmentData = await getAssessment(
        attemptData.data.assessmentId._id
      );
      setAssessment(assessmentData.data);

      const questionsData = await getQuestions(
        attemptData.data.assessmentId._id
      );
      setQuestions(questionsData.data || []);

      // Calculate time remaining
      const startedAt = new Date(attemptData.data.startedAt);
      const duration = assessmentData.data.duration * 60 * 1000; // Convert to milliseconds
      const elapsed = Date.now() - startedAt.getTime();
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(Math.floor(remaining / 1000));

      // Load existing answers
      if (attemptData.data.answers && attemptData.data.answers.length > 0) {
        const existingAnswers = {};
        attemptData.data.answers.forEach((a) => {
          existingAnswers[a.questionId] = a.selectedAnswer;
        });
        setAnswers(existingAnswers);
      }
    } catch (err) {
      setError(err.message || "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );
      await saveAttemptAnswers(attemptId, answersArray);
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const result = await submitAssessmentAttempt(attemptId, answersArray);
      navigate(`/assessment-result/${attemptId}`);
    } catch (err) {
      setError(err.message || "Failed to submit assessment");
      setConfirmSubmitOpened(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return (answered / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
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

  if (!assessment || !questions.length) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Assessment not found or has no questions
        </Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container size="xl" py="xl">
      {/* Timer and Progress Bar */}
      <Card withBorder mb="xl" padding="md">
        <Group justify="space-between" align="center">
          <Group gap="xl">
            <Group gap="xs">
              <IconClock size={20} />
              <Text fw={600} size="lg">
                {formatTime(timeRemaining)}
              </Text>
            </Group>
            <Text c="dimmed">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </Group>
          <Group gap="md">
            <Text size="sm" c="dimmed">
              Answered: {getAnsweredCount()}/{questions.length}
            </Text>
            <Progress value={getProgress()} w={150} size="sm" />
          </Group>
        </Group>
      </Card>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
          {error}
        </Alert>
      )}

      {/* Question Card */}
      <Card withBorder shadow="sm" mb="xl" padding="xl">
        <Stack gap="xl">
          <div>
            <Group justify="space-between" mb="md">
              <Badge color="blue" size="lg">
                Question {currentQuestionIndex + 1}
              </Badge>
              <Badge color="gray" variant="light">
                {currentQuestion.marks} marks
              </Badge>
            </Group>
            <Text size="lg" fw={500}>
              {currentQuestion.questionText}
            </Text>
          </div>

          <Radio.Group
            value={answers[currentQuestion._id] || ""}
            onChange={(value) => handleAnswerChange(currentQuestion._id, value)}
          >
            <Stack gap="md">
              {currentQuestion.options.map((option, index) => (
                <Radio
                  key={index}
                  value={String.fromCharCode(65 + index)}
                  label={`${String.fromCharCode(65 + index)}. ${option}`}
                  size="md"
                />
              ))}
            </Stack>
          </Radio.Group>
        </Stack>
      </Card>

      {/* Navigation */}
      <Group justify="space-between" mb="xl">
        <Button
          variant="default"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          leftSection={<IconArrowLeft size={16} />}
        >
          Previous
        </Button>
        <Group gap="md">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              color="green"
              onClick={() => setConfirmSubmitOpened(true)}
              rightSection={<IconCheck size={16} />}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={handleNext} rightSection={<IconArrowRight size={16} />}>
              Next
            </Button>
          )}
        </Group>
      </Group>

      {/* Question Navigation Panel */}
      <Card withBorder padding="md">
        <Title order={4} mb="md">
          Question Navigator
        </Title>
        <SimpleGrid cols={{ base: 5, sm: 10, md: 15 }}>
          {questions.map((question, index) => {
            const isAnswered = answers[question._id];
            const isCurrent = index === currentQuestionIndex;
            return (
              <Button
                key={question._id}
                variant={isCurrent ? "filled" : isAnswered ? "light" : "outline"}
                color={isCurrent ? "blue" : isAnswered ? "green" : "gray"}
                size="sm"
                onClick={() => handleJumpToQuestion(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </SimpleGrid>
      </Card>

      {/* Submit Confirmation Modal */}
      <Modal
        opened={confirmSubmitOpened}
        onClose={() => setConfirmSubmitOpened(false)}
        title="Confirm Submission"
        centered
      >
        <Stack>
          <Alert icon={<IconAlertCircle size={16} />} color="yellow">
            <Text size="sm">
              You have answered {_getAnsweredCount()} out of {questions.length}{" "}
              questions. Are you sure you want to submit?
            </Text>
          </Alert>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setConfirmSubmitOpened(false)}
            >
              Continue
            </Button>
            <Button
              color="green"
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
