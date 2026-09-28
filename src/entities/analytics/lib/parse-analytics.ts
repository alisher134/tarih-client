import { z } from "zod";

import type {
  AdminAnalyticsOverview,
  AdminCourseDetailAnalytics,
  AdminCoursesAnalytics,
  AdminSubscriptionsAnalytics,
  AdminTestDetailAnalytics,
  UserAnalyticsOverview,
} from "../model/types";

const periodSchema = z.object({
  from: z.string(),
  to: z.string(),
  timezone: z.string(),
});

const subscriptionPlanSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  durationMonths: z.number(),
  priceKzt: z.number(),
});

const subscriptionSchema = z.object({
  id: z.string(),
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED"]),
  startsAt: z.string(),
  expiresAt: z.string(),
  remainingSeconds: z.number(),
  remainingDays: z.number(),
  isExpired: z.boolean(),
  monthlyPriceKzt: z.number(),
  plan: subscriptionPlanSchema,
});

const userAnalyticsOverviewSchema = z.object({
  period: periodSchema,
  courses: z.object({
    active: z.number(),
    completed: z.number(),
    total: z.number(),
  }),
  lessons: z.object({
    completed: z.number(),
    totalTracked: z.number(),
    watchedSecondsTotal: z.number(),
  }),
  tests: z.object({
    attempts: z.number(),
    passed: z.number(),
    passRate: z.number().nullable(),
    averageScore: z.number().nullable(),
  }),
  streakDays: z.number(),
  dailyActivity: z.array(
    z.object({
      date: z.string(),
      watchedSeconds: z.number(),
    }),
  ),
  subscription: z.object({
    isActive: z.boolean(),
    subscription: subscriptionSchema.nullable(),
  }),
});

const adminAnalyticsOverviewSchema = z.object({
  period: periodSchema,
  users: z.object({
    newUsers: z.number(),
    activeUsers: z.number(),
  }),
  subscriptions: z.object({
    active: z.number(),
    expiringIn7Days: z.number(),
    expiringIn30Days: z.number(),
  }),
  learning: z.object({
    enrollmentsStarted: z.number(),
    enrollmentsCompleted: z.number(),
  }),
  tests: z.object({
    attempts: z.number(),
    passed: z.number(),
    passRate: z.number().nullable(),
    averageScore: z.number().nullable(),
  }),
  dailyActivity: z.array(
    z.object({
      date: z.string(),
      activeUsers: z.number(),
    }),
  ),
});

const courseStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const adminCourseAnalyticsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: courseStatusSchema,
  enrollments: z.number(),
  completed: z.number(),
  averageProgress: z.number(),
  testAttempts: z.number(),
  testPassRate: z.number().nullable(),
  averageTestScore: z.number().nullable(),
});

const listMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

const adminCoursesAnalyticsSchema = z.object({
  data: z.array(adminCourseAnalyticsItemSchema),
  meta: listMetaSchema,
});

const adminCourseDetailAnalyticsSchema = z.object({
  course: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    status: courseStatusSchema,
  }),
  funnel: z.object({
    enrolled: z.number(),
    started: z.number(),
    completed: z.number(),
  }),
  averageProgress: z.number(),
  lessons: z.array(
    z.object({
      lessonId: z.string(),
      title: z.string(),
      order: z.number(),
      hasTest: z.boolean(),
      startedCount: z.number(),
      completedCount: z.number(),
      averageWatchedSeconds: z.number(),
      testPassRate: z.number().nullable(),
    }),
  ),
});

const adminTestDetailAnalyticsSchema = z.object({
  test: z.object({
    id: z.string(),
    title: z.string(),
    lesson: z.object({
      id: z.string(),
      title: z.string(),
      course: z.object({
        id: z.string(),
        title: z.string(),
      }),
    }),
  }),
  attempts: z.number(),
  uniqueUsers: z.number(),
  passRate: z.number().nullable(),
  averageScore: z.number().nullable(),
  medianScore: z.number().nullable(),
  questions: z.array(
    z.object({
      questionId: z.string(),
      text: z.string(),
      order: z.number(),
      answers: z.number(),
      correctRate: z.number().nullable(),
    }),
  ),
});

const adminSubscriptionsAnalyticsSchema = z.object({
  period: z.object({
    from: z.string(),
    to: z.string(),
  }),
  totals: z.object({
    active: z.number(),
    cancelled: z.number(),
    expired: z.number(),
    grantedInPeriod: z.number(),
    expiringIn7Days: z.number(),
    expiringIn30Days: z.number(),
  }),
  byPlan: z.array(
    z.object({
      plan: z.object({
        id: z.string(),
        slug: z.string().optional(),
        title: z.string().optional(),
      }),
      count: z.number(),
    }),
  ),
});

export function parseUserAnalyticsOverview(data: unknown): UserAnalyticsOverview {
  return userAnalyticsOverviewSchema.parse(data);
}

export function parseAdminAnalyticsOverview(
  data: unknown,
): AdminAnalyticsOverview {
  return adminAnalyticsOverviewSchema.parse(data);
}

export function parseAdminCoursesAnalytics(
  data: unknown,
): AdminCoursesAnalytics {
  return adminCoursesAnalyticsSchema.parse(data);
}

export function parseAdminCourseDetailAnalytics(
  data: unknown,
): AdminCourseDetailAnalytics {
  return adminCourseDetailAnalyticsSchema.parse(data);
}

export function parseAdminTestDetailAnalytics(
  data: unknown,
): AdminTestDetailAnalytics {
  return adminTestDetailAnalyticsSchema.parse(data);
}

export function parseAdminSubscriptionsAnalytics(
  data: unknown,
): AdminSubscriptionsAnalytics {
  return adminSubscriptionsAnalyticsSchema.parse(data);
}
