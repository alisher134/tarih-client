import { useMemo, useSyncExternalStore } from "react";
import type { PracticeQuestion } from "@/entities/practice";

const STORAGE_KEY = "tarih_practice_active_session";
const EVENT_NAME = "tarih-practice-session-change";

export type SavedPracticeSession = {
  testIds: string[];
  limit?: number;
  questions: PracticeQuestion[];
  answers: Record<string, string[]>;
  elapsedSeconds: number;
};

export function getSavedPracticeSession(): SavedPracticeSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPracticeSession;
    if (
      parsed &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length > 0
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveActivePracticeSession(session: SavedPracticeSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // ignore
  }
}

export function updatePracticeDraftAnswers(
  answersMap: Map<string, string[]>,
  elapsedSeconds: number,
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedPracticeSession();
    if (!current) return;

    const answersObj: Record<string, string[]> = {};
    for (const [qId, opts] of answersMap.entries()) {
      answersObj[qId] = opts;
    }

    current.answers = answersObj;
    current.elapsedSeconds = elapsedSeconds;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function clearSavedPracticeSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

export function useActivePracticeSession(): SavedPracticeSession | null {
  const sessionRaw = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    if (!sessionRaw) return null;
    try {
      const parsed = JSON.parse(sessionRaw) as SavedPracticeSession;
      if (parsed?.questions?.length > 0) return parsed;
    } catch {
      // ignore
    }
    return null;
  }, [sessionRaw]);
}
