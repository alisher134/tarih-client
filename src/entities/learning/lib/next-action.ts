import type { LearningNextAction } from "../model/types";

export function getLearningNextActionHref(
  courseSlug: string,
  nextAction: LearningNextAction,
) {
  if (nextAction.type === "TEST") {
    return `/dashboard/courses/${courseSlug}/lessons/${nextAction.lessonId}/test`;
  }

  return `/dashboard/courses/${courseSlug}/lessons/${nextAction.lessonId}`;
}

export function getCourseNextActionLabelKey(
  nextAction: LearningNextAction | null,
): "watchLesson" | "takeTest" | "courseCompleted" {
  if (nextAction == null) return "courseCompleted";
  if (nextAction.type === "TEST") return "takeTest";
  return "watchLesson";
}
