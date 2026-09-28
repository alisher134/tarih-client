import type { ContinueLearning, LearningNextAction } from "@/entities/learning";
import { getLearningNextActionHref } from "@/entities/learning";

export function getContinueLearningHref(
  courseSlug: string,
  nextAction: LearningNextAction,
) {
  return getLearningNextActionHref(courseSlug, nextAction);
}

export function getContinueActionLabelKey(
  nextAction: LearningNextAction,
): "continueLesson" | "continueTest" {
  return nextAction.type === "TEST" ? "continueTest" : "continueLesson";
}

export type ContinueLearningCardData = ContinueLearning;
