import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMantineColorScheme } from "@mantine/core";

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
} from "@mantine/core";

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

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- HANDLERS ---------------- */

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

  /* ---------------- VALIDATION ---------------- */

  const isComplete = () => {
    return questions.every((q) => {
      const answer = answers[q.id];

      if (q.type === "text") {
        return answer && answer.trim() !== "";
      }

      return answer !== undefined && answer !== "";
    });
  };

  /* ---------------- SCORE ---------------- */

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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    if (!isComplete()) {
      setError("⚠️ Please answer all questions before submitting.");
      return;
    }

    setError("");
    setSubmitted(true);

    setTimeout(() => {
      navigate("/application-success");
    }, 1500);
  };

  /* ---------------- UI ---------------- */

  return (
    <Container size="md" py="xl">

      {/* HEADER */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>
            Scholarship Assessment
          </Title>

          <Text c="dimmed">
            Complete English, logic, and psychological questions.
          </Text>
        </div>

        <Group>
          <Button
            variant="light"
            onClick={toggleColorScheme}
          >
            {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>

          <Badge size="lg" color="blue">
            {Object.keys(answers).length} / {questions.length} Answered
          </Badge>
        </Group>
      </Group>

      {/* ERROR MESSAGE */}
      {error && (
        <Text color="red" mb="md">
          {error}
        </Text>
      )}

      {/* PROGRESS */}
      <Progress value={progress} mb="xl" />

      <Stack>

        {questions.map((q, index) => (
          <Card
            key={q.id}
            shadow="sm"
            radius="md"
            padding="lg"
            withBorder
          >

            <Group justify="space-between" mb="sm">
              <Badge color="violet">
                {q.category}
              </Badge>

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
                onChange={(value) =>
                  handleOptionChange(q.id, value)
                }
              >
                <Stack mt="sm">
                  {q.options.map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      label={option}
                    />
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
            disabled={!isComplete()}
          >
            Submit Assessment
          </Button>
        ) : (
          <Card shadow="sm" radius="md" padding="lg" withBorder>
            <Title order={3} mb="sm">
              Assessment Submitted
            </Title>

            <Text>
              Your score: {score} / 3
            </Text>

            <Text c="dimmed" mt="sm">
              Redirecting to confirmation page...
            </Text>
          </Card>
        )}

      </Stack>
    </Container>
  );
}

export default ScholarshipAssessment;