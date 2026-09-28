import type { AdminCoursesListQuery, CoursesListQuery } from "./types";

export const COURSES_QUERY_KEY = ["courses"] as const;

export function coursesListQueryKey(query: CoursesListQuery) {
  return [...COURSES_QUERY_KEY, "list", query] as const;
}

export function courseBySlugQueryKey(slug: string) {
  return [...COURSES_QUERY_KEY, "slug", slug] as const;
}

export const MY_ENROLLMENTS_QUERY_KEY = [...COURSES_QUERY_KEY, "my"] as const;

export const FAVORITES_QUERY_KEY = [...COURSES_QUERY_KEY, "favorites"] as const;

export const ADMIN_COURSES_QUERY_KEY = ["admin", "courses"] as const;

export function adminCoursesListQueryKey(query: AdminCoursesListQuery) {
  return [...ADMIN_COURSES_QUERY_KEY, "list", query] as const;
}

export function adminCourseDetailQueryKey(id: string) {
  return [...ADMIN_COURSES_QUERY_KEY, "detail", id] as const;
}

export function lessonPlaybackQueryKey(lessonId: string) {
  return ["lessons", lessonId, "playback"] as const;
}

export function lessonProgressQueryKey(lessonId: string) {
  return ["lessons", lessonId, "progress"] as const;
}

export function lessonMaterialsQueryKey(lessonId: string) {
  return ["lessons", lessonId, "materials"] as const;
}

export function lessonTestQueryKey(lessonId: string) {
  return ["lessons", lessonId, "test"] as const;
}

export function testDetailQueryKey(testId: string) {
  return ["tests", testId] as const;
}

export function testActiveAttemptQueryKey(testId: string) {
  return ["tests", testId, "active-attempt"] as const;
}
