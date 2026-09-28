"use client";

import { useEffect, useRef } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { getTestAttemptDraft, saveTestAttemptDraft } from "@/entities/course";

import { toTestAnswers, type AnswerMap } from "../lib/answers";

const SAVE_DEBOUNCE_MS = 1500;

type UseTestAttemptDraftOptions = {
  attemptId: string;
  enabled: boolean;
  answers: AnswerMap;
  onHydrate: (answers: AnswerMap) => void;
};

function mergeDraftAnswers(
  current: AnswerMap,
  draft: { questionId: string; optionIds: string[] }[],
): AnswerMap {
  const next = { ...current };

  for (const answer of draft) {
    next[answer.questionId] = answer.optionIds;
  }

  return next;
}

export function useTestAttemptDraft({
  attemptId,
  enabled,
  answers,
  onHydrate,
}: UseTestAttemptDraftOptions) {
  const hasHydratedRef = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);

  const draftQuery = useQuery({
    queryKey: ["tests", "attempt", attemptId, "draft"],
    queryFn: () => getTestAttemptDraft(attemptId),
    enabled: enabled && attemptId.length > 0,
    retry: false,
  });

  const saveDraftMutation = useMutation({
    mutationKey: ["tests", "attempt", attemptId, "draft", "save"],
    mutationFn: () => saveTestAttemptDraft(attemptId, toTestAnswers(answers)),
  });

  const isDraftSupported = Array.isArray(draftQuery.data);
  const isDraftUnsupported =
    draftQuery.isFetched && draftQuery.data === null && !draftQuery.isError;

  useEffect(() => {
    hasHydratedRef.current = false;
  }, [attemptId]);

  useEffect(() => {
    if (!enabled || !isDraftSupported || hasHydratedRef.current) return;

    hasHydratedRef.current = true;
    onHydrate(mergeDraftAnswers(answers, draftQuery.data!));
  }, [answers, draftQuery.data, enabled, isDraftSupported, onHydrate]);

  useEffect(() => {
    if (!enabled || !isDraftSupported || draftQuery.isLoading) return;

    if (debounceRef.current != null) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      saveDraftMutation.mutate();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current != null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [
    answers,
    draftQuery.isLoading,
    enabled,
    isDraftSupported,
    saveDraftMutation,
  ]);

  return {
    isDraftLoading: draftQuery.isLoading,
    isDraftUnsupported,
  };
}
