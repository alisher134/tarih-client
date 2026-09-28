"use client";

import { ContinueLearningCard } from "./continue-learning-card";
import { AnalyticsOverview } from "./analytics-overview";

export function DashboardAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      <ContinueLearningCard />
      <AnalyticsOverview />
    </div>
  );
}
