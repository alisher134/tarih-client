import { apiClient } from "@/shared/api";

import { parseMyCourseItems } from "../lib/parse-course";
import type { MyCourseItem } from "../model/types";

export async function getMyEnrollments(): Promise<MyCourseItem[]> {
  const { data } = await apiClient.get("/courses/my");

  return parseMyCourseItems(data);
}
