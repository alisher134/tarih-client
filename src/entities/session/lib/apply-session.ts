import type { QueryClient } from "@tanstack/react-query";

import { SESSION_QUERY_KEY } from "../model/session-query";
import type { Session, SessionUser } from "../model/types";
import { clearTokens, saveTokens } from "./token-storage";

export function applySession(queryClient: QueryClient, session: Session) {
  clearUserScopedQueries(queryClient);
  saveTokens(session);
  queryClient.setQueryData(SESSION_QUERY_KEY, session.user);
}

export function setSessionUser(queryClient: QueryClient, user: SessionUser) {
  queryClient.setQueryData(SESSION_QUERY_KEY, user);
}

export function resetSession(queryClient: QueryClient) {
  clearTokens();
  clearUserScopedQueries(queryClient);
  queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
}

function clearUserScopedQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: ["courses"] });
  queryClient.removeQueries({ queryKey: ["admin", "courses"] });
  queryClient.removeQueries({ queryKey: ["lessons"] });
  queryClient.removeQueries({ queryKey: ["tests"] });
  queryClient.removeQueries({ queryKey: ["materials"] });
  queryClient.removeQueries({ queryKey: ["learning"] });
  queryClient.removeQueries({ queryKey: ["analytics"] });
  queryClient.removeQueries({ queryKey: ["subscription-plans"] });
  queryClient.removeQueries({ queryKey: ["subscriptions"] });
  queryClient.removeQueries({ queryKey: ["admin", "users", "subscriptions"] });
}
