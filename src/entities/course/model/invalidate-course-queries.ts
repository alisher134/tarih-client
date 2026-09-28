import type { QueryClient } from "@tanstack/react-query";

import {
  ADMIN_COURSES_QUERY_KEY,
  COURSES_QUERY_KEY,
  FAVORITES_QUERY_KEY,
  MY_ENROLLMENTS_QUERY_KEY,
  adminCourseDetailQueryKey,
  courseBySlugQueryKey,
  lessonMaterialsQueryKey,
  lessonProgressQueryKey,
  testDetailQueryKey,
} from "./course-query";

type InvalidateCourseQueriesOptions = {
  courseId?: string;
  slug?: string;
  testId?: string;
  lessonId?: string;
};

export function invalidateCourseQueries(
  queryClient: QueryClient,
  options: InvalidateCourseQueriesOptions = {},
) {
  if (options.courseId != null) {
    queryClient.invalidateQueries({
      queryKey: adminCourseDetailQueryKey(options.courseId),
    });
  }

  if (options.slug != null) {
    queryClient.invalidateQueries({
      queryKey: courseBySlugQueryKey(options.slug),
    });
  }

  if (options.testId != null) {
    queryClient.invalidateQueries({
      queryKey: testDetailQueryKey(options.testId),
    });
  }

  if (options.lessonId != null) {
    queryClient.invalidateQueries({
      queryKey: lessonProgressQueryKey(options.lessonId),
    });
    queryClient.invalidateQueries({
      queryKey: lessonMaterialsQueryKey(options.lessonId),
    });
  }

  queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: MY_ENROLLMENTS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
}
