import { apiClient } from "@/shared/api";

import { parseCourseLearningSummary } from "../lib/parse-learning";
import type { CourseLearningSummary } from "../model/types";

export async function getCourseLearningSummary(
  courseId: string,
): Promise<CourseLearningSummary> {
  const { data } = await apiClient.get(
    `/courses/${courseId}/learning-summary`,
  );

  return parseCourseLearningSummary(data);
}
