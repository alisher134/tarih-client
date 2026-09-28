export const COURSE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export type CourseStatus = (typeof COURSE_STATUSES)[number];

export type CourseEnrollmentStatus = "ACTIVE" | "COMPLETED";

export type MyCourseNextAction =
  | { type: "LESSON"; lessonId: string }
  | { type: "TEST"; lessonId: string; testId: string };

export type MyCourseItemCourse = {
  id: string;
  title: string;
  slug: string;
  status: string;
  order: number;
};

export type MyCourseItem = {
  course: MyCourseItemCourse;
  progress: number;
  status: CourseEnrollmentStatus | null;
  enrolledAt: string | null;
  lastActivityAt: string | null;
  completedAt: string | null;
  isStarted: boolean;
  nextAction?: MyCourseNextAction | null;
};

export type LessonMaterialType =
  "PDF" | "DOCUMENT" | "PRESENTATION" | "ARCHIVE" | "FILE";

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export const LESSON_MATERIAL_TYPES = [
  "PDF",
  "DOCUMENT",
  "PRESENTATION",
  "ARCHIVE",
  "FILE",
] as const;

export const QUESTION_TYPES = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
] as const;

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: CourseStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CoursesList = {
  data: Course[];
  meta: ListMeta;
};

export type CoursesListQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type AdminCoursesListQuery = CoursesListQuery & {
  status?: CourseStatus;
};

export type QuestionOption = {
  id: string;
  text: string;
  order: number;
  isCorrect?: boolean;
};

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  order: number;
  options: QuestionOption[];
};

export type StudentQuestionOption = Omit<QuestionOption, "isCorrect">;

export type StudentQuestion = Omit<Question, "options"> & {
  options: StudentQuestionOption[];
};

export type LessonTest = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  attemptsLimit: number | null;
  questions: Question[];
};

export type StudentLessonTest = Omit<LessonTest, "questions"> & {
  questions: StudentQuestion[];
};

export type LessonMaterial = {
  id: string;
  title: string;
  type: LessonMaterialType;
  fileObjectKey?: string;
  fileName: string;
  fileSize: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CourseLesson = {
  id: string;
  title: string;
  description: string | null;
  videoObjectKey?: string | null;
  videoDuration: number | null;
  order: number;
  hasMaterials?: boolean;
  hasTest?: boolean;
  materials: LessonMaterial[];
  test: LessonTest | null;
};

export type StudentCourseLesson = {
  id: string;
  title: string;
  description: string | null;
  videoObjectKey?: string | null;
  videoDuration: number | null;
  order: number;
  hasMaterials?: boolean;
  hasTest?: boolean;
  testId: string | null;
};

export type CourseDetail = Course & {
  lessons: CourseLesson[];
};

export type StudentCourseDetail = Course & {
  lessons: StudentCourseLesson[];
};

export type CourseEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
  status: CourseEnrollmentStatus;
  course?: Course;
};

export type CourseFavorite = {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
};

export type UserLessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
};

export type PlaybackUrl = {
  lessonId: string;
  downloadUrl: string;
  expiresIn: number;
};

export type DownloadUrl = {
  downloadUrl: string;
  expiresIn: number;
  materialId?: string;
};

export type TestAttempt = {
  id: string;
  userId: string;
  testId: string;
  score: number | null;
  passed: boolean | null;
  startedAt: string;
  completedAt: string | null;
};

export type CreateCourseInput = {
  title: string;
  description?: string;
  slug: string;
  status?: CourseStatus;
  order?: number;
};

export type UpdateCourseInput = {
  title?: string;
  description?: string;
  slug?: string;
  status?: CourseStatus;
  order?: number;
};

export type CreateLessonInput = {
  title: string;
  description?: string;
  videoObjectKey?: string;
  videoDuration?: number;
  order?: number;
};

export type UpdateLessonInput = {
  title?: string;
  description?: string;
  videoObjectKey?: string;
  videoDuration?: number;
  order?: number;
};

export type CreateMaterialInput = {
  title: string;
  type: LessonMaterialType;
  fileObjectKey: string;
  fileName: string;
  fileSize: number;
  order?: number;
};

export type UpdateMaterialInput = {
  title?: string;
  type?: LessonMaterialType;
  fileObjectKey?: string;
  fileName?: string;
  fileSize?: number;
  order?: number;
};

export type CreateTestInput = {
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number | null;
  attemptsLimit?: number | null;
};

export type UpdateTestInput = {
  title?: string;
  description?: string;
  passingScore?: number;
  timeLimit?: number | null;
  attemptsLimit?: number | null;
};

export type QuestionOptionInput = {
  text: string;
  isCorrect: boolean;
  order: number;
};

export type CreateQuestionInput = {
  text: string;
  type: QuestionType;
  points: number;
  order?: number;
  options: QuestionOptionInput[];
};

export type UpdateQuestionInput = CreateQuestionInput;

export type UpdateLessonProgressInput = {
  watchedSeconds: number;
};

export type TestAnswerInput = {
  questionId: string;
  optionIds: string[];
};

export type UploadPurpose = "video" | "material";

export type CreateUploadIntentInput = {
  purpose: UploadPurpose;
  fileName: string;
  contentType: string;
  fileSize: number;
  courseId?: string;
  lessonId?: string;
};

export type UploadIntent = {
  objectKey: string;
  uploadUrl: string;
  expiresIn: number;
};
