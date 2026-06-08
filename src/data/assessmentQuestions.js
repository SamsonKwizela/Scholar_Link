// Admin-managed assessment questions
// This can be fetched from an API endpoint in the future

export const assessmentQuestionsDB = {
  1: {
    assessmentId: 1,
    title: "Scholarship Eligibility Test",
    totalQuestions: 100,
    passingScore: 60,
    timeLimit: 60,
    questions: Array.from({ length: 100 }, (_, index) => {
      const id = index + 1;
      const questionText = `Question ${id}: What is ${id + 1} + ${id}?`;
      const correctAnswer = `${2 * id + 1}`;
      const options = [
        `${2 * id - 1}`,
        `${2 * id}`,
        `${2 * id + 1}`,
        `${2 * id + 3}`,
      ];

      return {
        id,
        question: questionText,
        type: "multiple-choice",
        options,
        correctAnswer,
        marks: 1,
      };
    }),
  },
  2: {
    assessmentId: 2,
    title: "English Proficiency Assessment",
    totalQuestions: 4,
    passingScore: 70,
    timeLimit: 45,
    questions: [
      {
        id: 1,
        question: "Choose the correct sentence:",
        type: "multiple-choice",
        options: [
          "She go to school every day",
          "She goes to school every day",
          "She going to school every day",
          "She gone to school every day",
        ],
        correctAnswer: "She goes to school every day",
        marks: 15,
      },
      {
        id: 2,
        question: "What is the synonym of 'Brilliant'?",
        type: "multiple-choice",
        options: ["Dark", "Intelligent", "Slow", "Quiet"],
        correctAnswer: "Intelligent",
        marks: 15,
      },
      {
        id: 3,
        question: "Fill in the blank: I ___ been to Paris.",
        type: "multiple-choice",
        options: ["has", "have", "am", "is"],
        correctAnswer: "have",
        marks: 15,
      },
      {
        id: 4,
        question: "What is the opposite of 'Happy'?",
        type: "multiple-choice",
        options: ["Joyful", "Sad", "Cheerful", "Content"],
        correctAnswer: "Sad",
        marks: 15,
      },
    ],
  },
  3: {
    assessmentId: 3,
    title: "General Knowledge Test",
    totalQuestions: 5,
    passingScore: 50,
    timeLimit: 20,
    questions: [
      {
        id: 1,
        question: "In what year did World War II end?",
        type: "multiple-choice",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: "1945",
        marks: 10,
      },
      {
        id: 2,
        question: "How many continents are there?",
        type: "multiple-choice",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        marks: 10,
      },
      {
        id: 3,
        question: "What is the smallest country in the world?",
        type: "multiple-choice",
        options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
        correctAnswer: "Vatican City",
        marks: 10,
      },
      {
        id: 4,
        question: "Which element has the chemical symbol 'Au'?",
        type: "multiple-choice",
        options: ["Silver", "Gold", "Aluminum", "Argon"],
        correctAnswer: "Gold",
        marks: 10,
      },
      {
        id: 5,
        question: "What is the speed of light?",
        type: "multiple-choice",
        options: [
          "300,000 km/s",
          "150,000 km/s",
          "450,000 km/s",
          "100,000 km/s",
        ],
        correctAnswer: "300,000 km/s",
        marks: 10,
      },
    ],
  },
};

// Function to calculate score
export const calculateScore = (assessmentId, answers) => {
  const assessment = assessmentQuestionsDB[assessmentId];
  if (!assessment) return { score: 0, maxScore: 0, percentage: 0, passed: false };

  let totalMarks = 0;
  let earnedMarks = 0;

  assessment.questions.forEach((q) => {
    totalMarks += q.marks;
    if (answers[q.id] === q.correctAnswer) {
      earnedMarks += q.marks;
    }
  });

  const percentage = Math.round((earnedMarks / totalMarks) * 100);
  const passed = percentage >= assessment.passingScore;

  return {
    score: earnedMarks,
    maxScore: totalMarks,
    percentage,
    passed,
    passingScore: assessment.passingScore,
  };
};
