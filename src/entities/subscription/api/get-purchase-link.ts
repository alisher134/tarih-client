import { apiClient } from "@/shared/api";

import { parsePurchaseLink } from "../lib/parse-subscription";
import type { PurchaseLink } from "../model/types";

type GetPurchaseLinkOptions = {
  planId?: string;
};

export async function getPurchaseLink(
  options: GetPurchaseLinkOptions = {},
): Promise<PurchaseLink> {
  const { data } = await apiClient.get("/subscriptions/purchase-link", {
    params: options.planId != null ? { planId: options.planId } : undefined,
  });

  return parsePurchaseLink(data);
}
