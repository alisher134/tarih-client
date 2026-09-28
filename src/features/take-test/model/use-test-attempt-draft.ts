"use client";

import { useEffect, useRef } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { getTestAttemptDraft, saveTestAttemptDraft } from "@/entities/course";

import { toTestAnswers, type AnswerMap } from "../lib/answers";

const SAVE_DEBOUNCE_MS = 1500;

function getLocalDraft(attemptId: string) {
  try {
    const data = localStorage.getItem(`tarih_test_draft_${attemptId}`);
    if (data) {
      return JSON.parse(data) as { questionId: string; optionIds: string[] }[];
    }
  } catch {
    // ignore
  }
  return null;
}

function saveLocalDraft(
  attemptId: string,
  answers: { questionId: string; optionIds: string[] }[],
) {
  try {
    localStorage.setItem(
      `tarih_test_draft_${attemptId}`,
      JSON.stringify(answers),
    );
  } catch {
    // ignore
  }
}

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

  const isDraftUnsupported = false; // With localStorage fallback, it's always supported locally

  useEffect(() => {
    hasHydratedRef.current = false;
  }, [attemptId]);

  useEffect(() => {
    // Wait for the query to finish (either success or error) before hydrating
    if (!enabled || draftQuery.isPending || hasHydratedRef.current) return;

    hasHydratedRef.current = true;

    const backendDraft = Array.isArray(draftQuery.data) ? draftQuery.data : [];
    const localDraft = getLocalDraft(attemptId) ?? [];

    // Merge backend first, then local (local takes precedence if offline saved)
    const withBackend = mergeDraftAnswers(answers, backendDraft);
    const fullyMerged = mergeDraftAnswers(withBackend, localDraft);

    onHydrate(fullyMerged);
  }, [
    answers,
    draftQuery.data,
    draftQuery.isPending,
    enabled,
    attemptId,
    onHydrate,
  ]);

  useEffect(() => {
    if (!enabled || !hasHydratedRef.current) return;
    saveLocalDraft(attemptId, toTestAnswers(answers));
  }, [answers, attemptId, enabled]);

  useEffect(() => {
    if (!enabled || draftQuery.isPending) return;

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
  }, [answers, attemptId, draftQuery.isPending, enabled, saveDraftMutation]);

  return {
    isDraftLoading: draftQuery.isLoading,
    isDraftUnsupported,
  };
}
