"use client";

import { useCallback, useRef, useState } from "react";

import type { UpdateLessonProgressInput } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";

import { useUpdateLessonProgress } from "./use-update-lesson-progress";

export function useSerializedLessonProgress(lessonId: string) {
  const { mutateAsync } = useUpdateLessonProgress(lessonId);
  const queueRef = useRef(Promise.resolve());
  const latestInputRef = useRef<UpdateLessonProgressInput | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleMutationError = useCallback((error: unknown) => {
    setSaveError(getErrorMessage(error, "Failed to save progress"));
  }, []);

  const saveProgress = useCallback(
    (input: UpdateLessonProgressInput) => {
      latestInputRef.current = input;
      queueRef.current = queueRef.current
        .then(async () => {
          const payload = latestInputRef.current;

          if (payload == null) return;

          await mutateAsync(payload);
          setSaveError(null);
        })
        .catch((error: unknown) => {
          handleMutationError(error);
        });
    },
    [handleMutationError, mutateAsync],
  );

  const flushProgress = useCallback(
    (input: UpdateLessonProgressInput) => {
      latestInputRef.current = input;
      queueRef.current = queueRef.current.then(async () => {
        await mutateAsync(input);
        setSaveError(null);
      });

      return queueRef.current.catch((error: unknown) => {
        handleMutationError(error);
      });
    },
    [handleMutationError, mutateAsync],
  );

  const clearSaveError = useCallback(() => {
    setSaveError(null);
  }, []);

  const retryLastSave = useCallback(() => {
    const payload = latestInputRef.current;
    if (payload == null) return;

    void flushProgress(payload);
  }, [flushProgress]);

  return {
    saveProgress,
    flushProgress,
    saveError,
    clearSaveError,
    retryLastSave,
  };
}
