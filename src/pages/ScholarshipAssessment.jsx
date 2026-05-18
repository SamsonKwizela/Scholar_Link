import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Radio,
  Button,
  Textarea,
  Progress,
  Group,
  Badge,
  Alert,
} from "@mantine/core";

import { IconAlertCircle } from "@tabler/icons-react";

const questions = [
  {
    id: 1,
    type: "multiple",
    category: "English",
    question: "Choose the correct sentence:",
    options: [
      "She don't like studying.",
      "She doesn't likes studying.",
      "She doesn't like studying.",
      "She not like studying.",
    ],
    answer: "She doesn't like studying.",
  },

  {
    id: 2,
    type: "multiple",
    category: "Logic",
    question: "2, 4, 8, 16, ?",
    options: ["18", "24", "32", "64"],
    answer: "32",
  },

  {
    id: 3,
    type: "multiple",
    category: "Psychology",
    question:
      "You are working in a team project and one member stops contributing. What do you do?",
    options: [
      "Ignore them",
      "Report them immediately",
      "Talk to them respectfully first",
      "Do all the work yourself",
    ],
    answer: "Talk to them respectfully first",
  },

  {
    id: 4,
    type: "text",
    category: "Essay",
    question: "Why do you deserve this scholarship?",
  },
];

function ScholarshipAssessment() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleOptionChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleTextChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((q) => {
      if (q.answer && answers[q.id] === q.answer) {
        score++;
      }
    });

    return score;
  };

  const score = calculateScore();

  const progress =
    (Object.keys(answers).length / questions.length) * 100;

  // ✅ VALIDATION FIX
  const handleSubmit = () => {
    const unanswered = questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === ""
    );

    if (unanswered.length > 0) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError("");
    setSubmitted(true);

    setTimeout(() => {
      navigate("/application-success");
    }, 1500);
  };

  return (
    <Container size="md" py="xl">

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Scholarship Assessment</Title>
          <Text c="dimmed">
            Complete English, logic, and psychological questions.
          </Text>
        </div>

        <Badge size="lg" color="blue">
          {Object.keys(answers).length} / {questions.length} Answered
        </Badge>
      </Group>

      <Progress value={progress} mb="xl" />

      {/* ✅ ERROR MESSAGE */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      <Stack>

        {questions.map((q, index) => (
          <Card key={q.id} shadow="sm" radius="md" padding="lg" withBorder>

            <Group justify="space-between" mb="sm">
              <Badge color="violet">{q.category}</Badge>
              <Text size="sm" c="dimmed">
                Question {index + 1}
              </Text>
            </Group>

            <Text fw={600} mb="md">
              {q.question}
            </Text>

            {q.type === "multiple" && (
              <Radio.Group
                value={answers[q.id] || ""}
                onChange={(value) => handleOptionChange(q.id, value)}
              >
                <Stack mt="sm">
                  {q.options.map((option) => (
                    <Radio key={option} value={option} label={option} />
                  ))}
                </Stack>
              </Radio.Group>
            )}

            {q.type === "text" && (
              <Textarea
                placeholder="Write your answer here..."
                minRows={5}
                value={answers[q.id] || ""}
                onChange={(e) =>
                  handleTextChange(q.id, e.target.value)
                }
              />
            )}

          </Card>
        ))}

        {!submitted ? (
          <Button 
          size="md" 
          onClick={handleSubmit}
          disabled={!isComplete()} >
            Submit Assessment
          </Button>
        ) : (
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Title order={3} mb="sm">
              Assessment Submitted
            </Title>

            <Text>Your score: {score}</Text>

            <Text c="dimmed" mt="sm">
              Redirecting...
            </Text>
          </Card>
        )}

      </Stack>
    </Container>
  );
}

export default ScholarshipAssessment;