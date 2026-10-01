import { apiClient } from "@/shared/api";
import { SubscriptionPlan } from "../model/types";

export type CreateSubscriptionPlanInput = {
  slug: string;
  titleRu: string;
  titleKz?: string;
  description?: string;
  durationMonths: number;
  priceKzt: number;
  order?: number;
  isActive?: boolean;
};

export async function createSubscriptionPlan(
  input: CreateSubscriptionPlanInput,
): Promise<SubscriptionPlan> {
  const { data } = await apiClient.post("/admin/subscription-plans", input);
  return data;
}

export async function updateSubscriptionPlan({
  id,
  ...input
}: CreateSubscriptionPlanInput & { id: string }): Promise<SubscriptionPlan> {
  const { data } = await apiClient.patch(
    `/admin/subscription-plans/${id}`,
    input,
  );
  return data;
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  await apiClient.delete(`/admin/subscription-plans/${id}`);
}

export async function getAdminSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data } = await apiClient.get("/admin/subscription-plans");
  return data;
}
