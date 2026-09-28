"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  coursesListQueryKey,
  getCourses,
  type CoursesListQuery,
} from "@/entities/course";

export function useCoursesList(query: CoursesListQuery) {
  return useQuery({
    queryKey: coursesListQueryKey(query),
    queryFn: () => getCourses(query),
    placeholderData: keepPreviousData,
  });
}
