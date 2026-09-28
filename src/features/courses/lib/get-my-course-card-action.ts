import {
  getCourseNextActionLabelKey,
  getLearningNextActionHref,
  type ContinueLearning,
  type LearningNextAction,
} from "@/entities/learning";
import type { MyCourseItem } from "@/entities/course";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";

type MyCourseCardAction = {
  href: string;
  labelKey:
    "continue" | "openCourse" | "watchLesson" | "takeTest" | "viewPlans";
};

function resolveNextAction(
  item: MyCourseItem,
  continueLearning: ContinueLearning | null | undefined,
): LearningNextAction | null {
  if (item.nextAction != null) return item.nextAction;

  if (
    continueLearning != null &&
    continueLearning.course.slug === item.course.slug
  ) {
    return continueLearning.nextAction;
  }

  return null;
}

export function getMyCourseCardAction(
  item: MyCourseItem,
  continueLearning: ContinueLearning | null | undefined,
  hasAccess: boolean,
): MyCourseCardAction {
  const courseSlug = item.course.slug;

  if (!hasAccess) {
    return { href: SUBSCRIPTION_PLANS_HREF, labelKey: "viewPlans" };
  }

  if (item.status === "COMPLETED") {
    return {
      href: `/dashboard/courses/${courseSlug}`,
      labelKey: "openCourse",
    };
  }

  const nextAction = resolveNextAction(item, continueLearning);

  if (nextAction != null) {
    const labelKey = getCourseNextActionLabelKey(nextAction);

    return {
      href: getLearningNextActionHref(courseSlug, nextAction),
      labelKey: labelKey === "courseCompleted" ? "continue" : labelKey,
    };
  }

  return {
    href: `/dashboard/courses/${courseSlug}`,
    labelKey: "continue",
  };
}
