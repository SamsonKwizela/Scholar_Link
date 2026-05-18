import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams(); // scholarship ID
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  const handleTextChange = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  // 🔥 VALIDATION (IMPORTANT FIX)
  const handleSubmit = () => {
    const allAnswered = questions.every((q) => {
      const value = answers[q.id];
      return value !== undefined && value !== "";
    });

    if (!allAnswered) {
      alert("Please answer ALL questions before submitting.");
      return;
    }

    setSubmitted(true);

    console.log("Scholarship ID:", id);
    console.log("Answers:", answers);

    setTimeout(() => {
      navigate("/application-success");
    }, 1500);
  };

  const score = questions.reduce((acc, q) => {
    if (answers[q.id] === q.answer) acc++;
    return acc;
  }, 0);

  const progress =
    (Object.keys(answers).length / questions.length) * 100;

  return (
    <Container size="md" py="xl">

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Scholarship Assessment</Title>
          <Text c="dimmed">
            Scholarship ID: {id}
          </Text>
        </div>

        <Badge>
          {Object.keys(answers).length} / {questions.length}
        </Badge>
      </Group>

      <Progress value={progress} mb="xl" />

      <Stack>
        {questions.map((q) => (
          <Card key={q.id} withBorder p="lg">
            <Badge mb="sm">{q.category}</Badge>

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
                <Stack>
                  {q.options.map((opt) => (
                    <Radio key={opt} value={opt} label={opt} />
                  ))}
                </Stack>
              </Radio.Group>
            )}

            {q.type === "text" && (
              <Textarea
                value={answers[q.id] || ""}
                onChange={(e) =>
                  handleTextChange(q.id, e.target.value)
                }
              />
            )}
          </Card>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit}>
            Submit Assessment
          </Button>
        ) : (
          <Card withBorder>
            <Title order={3}>Submitted</Title>
            <Text>Your score: {score} / 3</Text>
          </Card>
        )}
      </Stack>
    </Container>
  );
}

export default ScholarshipAssessment;