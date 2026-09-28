export type {
  AdminAnalyticsOverview,
  AdminCourseAnalyticsItem,
  AdminCourseDetailAnalytics,
  AdminCoursesAnalytics,
  AdminSubscriptionsAnalytics,
  AdminTestDetailAnalytics,
  AnalyticsDateRangeQuery,
  AnalyticsListMeta,
  AnalyticsPeriod,
  UserAnalyticsOverview,
} from "./model/types";

export { getUserAnalyticsOverview } from "./api/get-user-analytics-overview";
export {
  getAdminAnalyticsOverview,
  getAdminAnalyticsCourseDetail,
  getAdminAnalyticsCourses,
  getAdminAnalyticsSubscriptions,
  getAdminAnalyticsTestDetail,
} from "./api/get-admin-analytics";

export {
  ADMIN_ANALYTICS_COURSES_QUERY_KEY,
  ADMIN_ANALYTICS_OVERVIEW_QUERY_KEY,
  ADMIN_ANALYTICS_SUBSCRIPTIONS_QUERY_KEY,
  adminAnalyticsCourseDetailQueryKey,
  adminAnalyticsCoursesQueryKey,
  adminAnalyticsOverviewQueryKey,
  adminAnalyticsSubscriptionsQueryKey,
  adminAnalyticsTestDetailQueryKey,
  USER_ANALYTICS_OVERVIEW_QUERY_KEY,
  userAnalyticsOverviewQueryKey,
} from "./model/analytics-query";
