"use client";

import { useQuery } from "@tanstack/react-query";

import { getCourseBySlug } from "../api/get-course-by-slug";
import { courseBySlugQueryKey } from "./course-query";

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: courseBySlugQueryKey(slug),
    queryFn: () => getCourseBySlug(slug),
    enabled: slug.length > 0,
  });
}
