export type AnalyticsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AnalyticsDateRangeQuery = {
  from?: string;
  to?: string;
  timezone?: string;
  page?: number;
  limit?: number;
};

export type AnalyticsPeriod = {
  from: string;
  to: string;
  timezone: string;
};

export type AnalyticsSubscriptionPlan = {
  id: string;
  slug: string;
  title: string;
  durationMonths: number;
  priceKzt: number;
};

export type AnalyticsSubscription = {
  id: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  startsAt: string;
  expiresAt: string;
  remainingSeconds: number;
  remainingDays: number;
  isExpired: boolean;
  monthlyPriceKzt: number;
  plan: AnalyticsSubscriptionPlan;
};

export type UserAnalyticsOverview = {
  period: AnalyticsPeriod;
  courses: {
    active: number;
    completed: number;
    total: number;
  };
  lessons: {
    completed: number;
    totalTracked: number;
    watchedSecondsTotal: number;
  };
  tests: {
    attempts: number;
    passed: number;
    passRate: number | null;
    averageScore: number | null;
  };
  streakDays: number;
  dailyActivity: Array<{ date: string; watchedSeconds: number }>;
  subscription: {
    isActive: boolean;
    subscription: AnalyticsSubscription | null;
  };
};

export type AdminAnalyticsOverview = {
  period: AnalyticsPeriod;
  users: {
    newUsers: number;
    activeUsers: number;
  };
  subscriptions: {
    active: number;
    expiringIn7Days: number;
    expiringIn30Days: number;
  };
  learning: {
    enrollmentsStarted: number;
    enrollmentsCompleted: number;
  };
  tests: {
    attempts: number;
    passed: number;
    passRate: number | null;
    averageScore: number | null;
  };
  dailyActivity: Array<{ date: string; activeUsers: number }>;
};

export type AdminCourseAnalyticsItem = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  enrollments: number;
  completed: number;
  averageProgress: number;
  testAttempts: number;
  testPassRate: number | null;
  averageTestScore: number | null;
};

export type AdminCoursesAnalytics = {
  data: AdminCourseAnalyticsItem[];
  meta: AnalyticsListMeta;
};

export type AdminCourseDetailAnalytics = {
  course: {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
  funnel: {
    enrolled: number;
    started: number;
    completed: number;
  };
  averageProgress: number;
  lessons: Array<{
    lessonId: string;
    title: string;
    order: number;
    hasTest: boolean;
    startedCount: number;
    completedCount: number;
    averageWatchedSeconds: number;
    testPassRate: number | null;
  }>;
};

export type AdminTestDetailAnalytics = {
  test: {
    id: string;
    title: string;
    lesson: {
      id: string;
      title: string;
      course: { id: string; title: string };
    };
  };
  attempts: number;
  uniqueUsers: number;
  passRate: number | null;
  averageScore: number | null;
  medianScore: number | null;
  questions: Array<{
    questionId: string;
    text: string;
    order: number;
    answers: number;
    correctRate: number | null;
  }>;
};

export type AdminSubscriptionsAnalytics = {
  period: { from: string; to: string };
  totals: {
    active: number;
    cancelled: number;
    expired: number;
    grantedInPeriod: number;
    expiringIn7Days: number;
    expiringIn30Days: number;
  };
  byPlan: Array<{
    plan: { id: string; slug?: string; title?: string };
    count: number;
  }>;
};
