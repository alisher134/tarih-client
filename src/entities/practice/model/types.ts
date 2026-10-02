export type PracticeTopicItem = {
  testId: string;
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  questionsCount: number;
  bestScore: number;
  attemptsCount: number;
  lastCompletedAt: string | null;
};

export type PracticeQuestionOption = {
  id: string;
  text: string;
};

export type PracticeQuestion = {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";
  points: number;
  testId: string;
  lessonTitle: string;
  options: PracticeQuestionOption[];
};

export type PracticeStartResult = {
  testIds: string[];
  totalQuestions: number;
  questions: PracticeQuestion[];
};

export type PracticeAnswerInput = {
  questionId: string;
  optionIds: string[];
};

export type PracticeQuestionResultDetail = {
  questionId: string;
  questionText: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";
  points: number;
  earnedPoints: number;
  isCorrect: boolean;
  selectedOptionIds: string[];
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
};

export type PracticeSessionRecord = {
  id: string;
  title: string;
  testIds: string[];
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpentSeconds: number;
  createdAt: string;
  details?: PracticeQuestionResultDetail[];
};

export type PracticeSubmitResult = {
  session: PracticeSessionRecord;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  earnedPoints: number;
  totalPoints: number;
  questionResults: PracticeQuestionResultDetail[];
};

export type UnifiedTestHistoryItem = {
  id: string;
  type: "LESSON" | "PRACTICE";
  title: string;
  courseTitle?: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers?: number;
  date: string;
  timeSpentSeconds?: number;
};
