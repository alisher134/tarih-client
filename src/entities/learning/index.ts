export type {
  ContinueLearning,
  ContinueLearningLesson,
  CourseLearningSummary,
  LearningNextAction,
  LearningNextActionType,
} from "./model/types";

export { getContinueLearning } from "./api/get-continue-learning";
export { getCourseLearningSummary } from "./api/get-course-learning-summary";

export {
  getCourseNextActionLabelKey,
  getLearningNextActionHref,
} from "./lib/next-action";

export {
  flushLearningProgressInvalidation,
  invalidateLearningProgressQueries,
  scheduleLearningProgressInvalidation,
} from "./lib/invalidate-learning-queries";

export { useContinueLearning } from "./model/use-continue-learning";
export { useCourseLearningSummary } from "./model/use-course-learning-summary";

export {
  CONTINUE_LEARNING_QUERY_KEY,
  COURSE_LEARNING_SUMMARY_QUERY_KEY,
  courseLearningSummaryQueryKey,
} from "./model/learning-query";
