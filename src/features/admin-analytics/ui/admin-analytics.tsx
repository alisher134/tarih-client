"use client";

import { AdminAnalyticsCoursesSection } from "./admin-analytics-courses";
import { AdminAnalyticsOverviewSection } from "./admin-analytics-overview";
import { AdminAnalyticsSubscriptionsSection } from "./admin-analytics-subscriptions";

export function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      <AdminAnalyticsOverviewSection />
      <AdminAnalyticsSubscriptionsSection />
      <AdminAnalyticsCoursesSection />
    </div>
  );
}
