"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/entities/session";

import { getContinueLearning } from "../api/get-continue-learning";
import { CONTINUE_LEARNING_QUERY_KEY } from "./learning-query";

type UseContinueLearningOptions = {
  enabled?: boolean;
};

export function useContinueLearning(options: UseContinueLearningOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: CONTINUE_LEARNING_QUERY_KEY,
    queryFn: getContinueLearning,
    enabled: enabled && getAccessToken() != null,
    staleTime: 60 * 1000,
  });
}
