import { apiClient } from "@/shared/api";

import { parseUserAnalyticsOverview } from "../lib/parse-analytics";
import type {
  AnalyticsDateRangeQuery,
  UserAnalyticsOverview,
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

export async function getUserAnalyticsOverview(
  query?: AnalyticsDateRangeQuery,
): Promise<UserAnalyticsOverview> {
  const { data } = await apiClient.get("/me/analytics/overview", {
    params: toQueryParams(query),
  });

  return parseUserAnalyticsOverview(data);
}
