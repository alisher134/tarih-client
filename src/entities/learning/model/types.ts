export type LearningNextActionType = "LESSON" | "TEST";

export type LearningEnrollmentStatus = "ACTIVE" | "COMPLETED";

export type LearningNextAction =
  | { type: "LESSON"; lessonId: string }
  | { type: "TEST"; lessonId: string; testId: string };

export type ContinueLearningLesson = {
  id: string;
  title: string;
  order: number;
  videoDuration: number;
  watchedSeconds: number;
  completed: boolean;
};

export type ContinueLearning = {
  course: {
    id: string;
    title: string;
    slug: string;
    progress: number;
  };
  lesson: ContinueLearningLesson;
  nextAction: LearningNextAction;
};

export type CourseLearningSummary = {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  enrollment: {
    progress: number;
    status: LearningEnrollmentStatus;
    enrolledAt: string;
    lastActivityAt: string | null;
    completedAt: string | null;
  } | null;
  lessonsTotal: number;
  lessonsCompleted: number;
  testsTotal: number;
  testsPassed: number;
  watchedSecondsTotal: number;
  averageTestScore: number | null;
  testPassRate: number | null;
  currentLesson: ContinueLearningLesson | null;
  nextAction: LearningNextAction | null;
};
