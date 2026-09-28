"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  adminCoursesListQueryKey,
  getAdminCourses,
  type AdminCoursesListQuery,
} from "@/entities/course";

export function useAdminCoursesList(query: AdminCoursesListQuery) {
  return useQuery({
    queryKey: adminCoursesListQueryKey(query),
    queryFn: () => getAdminCourses(query),
    placeholderData: keepPreviousData,
  });
}
