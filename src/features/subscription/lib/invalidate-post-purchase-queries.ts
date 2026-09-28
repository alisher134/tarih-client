import type { QueryClient } from "@tanstack/react-query";

import { invalidateLearningProgressQueries } from "@/entities/learning";
import { MY_SUBSCRIPTION_QUERY_KEY } from "@/entities/subscription";

export function invalidatePostPurchaseQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: MY_SUBSCRIPTION_QUERY_KEY,
  });
  invalidateLearningProgressQueries(queryClient);
}
