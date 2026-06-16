// Admin-managed assessment questions
// This should be fetched from an API endpoint or stored in localStorage
// Currently empty - questions should be added by admin through the application

export const assessmentQuestionsDB = {};

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
