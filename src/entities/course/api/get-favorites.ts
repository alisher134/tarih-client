import { apiClient } from "@/shared/api";

import { parseCourseFavorites } from "../lib/parse-course";
import type { CourseFavorite } from "../model/types";

export async function getFavorites(): Promise<CourseFavorite[]> {
  const { data } = await apiClient.get("/courses/favorites");

  return parseCourseFavorites(data);
}
