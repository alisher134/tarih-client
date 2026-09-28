"use client";

import { type PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { setupSessionClient } from "@/entities/session";

import { getQueryClient } from "./get-query-client";

const queryClient = getQueryClient();
setupSessionClient(queryClient);

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
