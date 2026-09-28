import { z } from "zod";

import type {
  MySubscription,
  PurchaseLink,
  SubscriptionPlan,
  UserSubscription,
} from "../model/types";

const subscriptionPlanSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  durationMonths: z.number(),
  priceKzt: z.number(),
});

const userSubscriptionSchema = z.object({
  id: z.string(),
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED"]),
  startsAt: z.string(),
  expiresAt: z.string(),
  remainingSeconds: z.number(),
  remainingDays: z.number(),
  isExpired: z.boolean(),
  isUpcoming: z.boolean().optional().default(false),
  monthlyPriceKzt: z.number(),
  plan: subscriptionPlanSchema,
});

const purchaseLinkSchema = z.object({
  channel: z.literal("telegram"),
  url: z.string(),
  instructions: z.string(),
});

const mySubscriptionSchema = z.object({
  isActive: z.boolean(),
  subscription: userSubscriptionSchema.nullable().optional().default(null),
  upcomingSubscription: userSubscriptionSchema
    .nullable()
    .optional()
    .default(null),
});

function parsePlansArray(data: unknown): SubscriptionPlan[] {
  if (Array.isArray(data)) {
    return z.array(subscriptionPlanSchema).parse(data);
  }

  const wrapped = z.object({ data: z.array(subscriptionPlanSchema) }).parse(data);
  return wrapped.data;
}

function parseSubscriptionsArray(data: unknown): UserSubscription[] {
  if (Array.isArray(data)) {
    return z.array(userSubscriptionSchema).parse(data);
  }

  const wrapped = z
    .object({ data: z.array(userSubscriptionSchema) })
    .parse(data);

  return wrapped.data;
}

export function parseSubscriptionPlan(data: unknown): SubscriptionPlan {
  return subscriptionPlanSchema.parse(data);
}

export function parseSubscriptionPlans(data: unknown): SubscriptionPlan[] {
  return parsePlansArray(data);
}

export function parseUserSubscription(data: unknown): UserSubscription {
  return userSubscriptionSchema.parse(data);
}

export function parseUserSubscriptions(data: unknown): UserSubscription[] {
  return parseSubscriptionsArray(data);
}

export function parseMySubscription(data: unknown): MySubscription {
  return mySubscriptionSchema.parse(data);
}

export function parsePurchaseLink(data: unknown): PurchaseLink {
  return purchaseLinkSchema.parse(data);
}
