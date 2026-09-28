import { apiClient } from "@/shared/api";

import {
  parseAdminAnalyticsOverview,
  parseAdminCourseDetailAnalytics,
  parseAdminCoursesAnalytics,
  parseAdminSubscriptionsAnalytics,
  parseAdminTestDetailAnalytics,
} from "../lib/parse-analytics";
import type {
  AdminAnalyticsOverview,
  AdminCourseDetailAnalytics,
  AdminCoursesAnalytics,
  AdminSubscriptionsAnalytics,
  AdminTestDetailAnalytics,
  AnalyticsDateRangeQuery,
} from "../model/types";

function toQueryParams(query?: AnalyticsDateRangeQuery) {
  if (query == null) return undefined;

  return {
    from: query.from,
    to: query.to,
    timezone: query.timezone,
    page: query.page,
    limit: query.limit,
  };
}

export async function getAdminAnalyticsOverview(
  query?: AnalyticsDateRangeQuery,
): Promise<AdminAnalyticsOverview> {
  const { data } = await apiClient.get("/admin/analytics/overview", {
    params: toQueryParams(query),
  });

  return parseAdminAnalyticsOverview(data);
}

export async function getAdminAnalyticsCourses(
  query?: AnalyticsDateRangeQuery,
): Promise<AdminCoursesAnalytics> {
  const { data } = await apiClient.get("/admin/analytics/courses", {
    params: toQueryParams(query),
  });

  return parseAdminCoursesAnalytics(data);
}

export async function getAdminAnalyticsCourseDetail(
  courseId: string,
  query?: AnalyticsDateRangeQuery,
): Promise<AdminCourseDetailAnalytics> {
  const { data } = await apiClient.get(
    `/admin/analytics/courses/${courseId}`,
    { params: toQueryParams(query) },
  );

  return parseAdminCourseDetailAnalytics(data);
}

export async function getAdminAnalyticsTestDetail(
  testId: string,
  query?: AnalyticsDateRangeQuery,
): Promise<AdminTestDetailAnalytics> {
  const { data } = await apiClient.get(`/admin/analytics/tests/${testId}`, {
    params: toQueryParams(query),
  });

  return parseAdminTestDetailAnalytics(data);
}

export async function getAdminAnalyticsSubscriptions(
  query?: AnalyticsDateRangeQuery,
): Promise<AdminSubscriptionsAnalytics> {
  const { data } = await apiClient.get("/admin/analytics/subscriptions", {
    params: toQueryParams(query),
  });

  return parseAdminSubscriptionsAnalytics(data);
}
