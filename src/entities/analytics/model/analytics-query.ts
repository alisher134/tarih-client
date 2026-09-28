import type { AnalyticsDateRangeQuery } from "./types";

export const USER_ANALYTICS_OVERVIEW_QUERY_KEY = [
  "analytics",
  "user",
  "overview",
] as const;

export const ADMIN_ANALYTICS_OVERVIEW_QUERY_KEY = [
  "admin",
  "analytics",
  "overview",
] as const;

export const ADMIN_ANALYTICS_COURSES_QUERY_KEY = [
  "admin",
  "analytics",
  "courses",
] as const;

export const ADMIN_ANALYTICS_SUBSCRIPTIONS_QUERY_KEY = [
  "admin",
  "analytics",
  "subscriptions",
] as const;

export function userAnalyticsOverviewQueryKey(query?: AnalyticsDateRangeQuery) {
  return [...USER_ANALYTICS_OVERVIEW_QUERY_KEY, query ?? {}] as const;
}

export function adminAnalyticsOverviewQueryKey(query?: AnalyticsDateRangeQuery) {
  return [...ADMIN_ANALYTICS_OVERVIEW_QUERY_KEY, query ?? {}] as const;
}

export function adminAnalyticsCoursesQueryKey(query?: AnalyticsDateRangeQuery) {
  return [...ADMIN_ANALYTICS_COURSES_QUERY_KEY, query ?? {}] as const;
}

export function adminAnalyticsSubscriptionsQueryKey(
  query?: AnalyticsDateRangeQuery,
) {
  return [...ADMIN_ANALYTICS_SUBSCRIPTIONS_QUERY_KEY, query ?? {}] as const;
}

export function adminAnalyticsCourseDetailQueryKey(
  courseId: string,
  query?: AnalyticsDateRangeQuery,
) {
  return ["admin", "analytics", "courses", courseId, query ?? {}] as const;
}

export function adminAnalyticsTestDetailQueryKey(
  testId: string,
  query?: AnalyticsDateRangeQuery,
) {
  return ["admin", "analytics", "tests", testId, query ?? {}] as const;
}
