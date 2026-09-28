export const CONTINUE_LEARNING_QUERY_KEY = ["learning", "continue"] as const;

export const COURSE_LEARNING_SUMMARY_QUERY_KEY = [
  "learning",
  "course-summary",
] as const;

export function courseLearningSummaryQueryKey(courseId: string) {
  return [...COURSE_LEARNING_SUMMARY_QUERY_KEY, courseId] as const;
}
