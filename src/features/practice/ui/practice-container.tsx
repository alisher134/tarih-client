"use client";

import { useCallback, useState } from "react";
import { HistoryIcon, TargetIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  PracticeAnswerInput,
  PracticeSubmitResult,
} from "@/entities/practice";
import { useLearningAccess, LearningAccessNotice } from "@/features/courses";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@/shared/config/i18n/navigation";
import { isSubscriptionRequiredError } from "@/shared/lib/is-subscription-required-error";
import { LoaderGate } from "@/shared/ui/loader-gate";
import { cn } from "cn";

import { usePracticeTopics } from "../model/use-practice-topics";
import { useStartPractice } from "../model/use-start-practice";
import { useSubmitPractice } from "../model/use-submit-practice";
import {
  clearSavedPracticeSession,
  saveActivePracticeSession,
  useActivePracticeSession,
} from "../model/practice-session-storage";
import { PracticeHistoryView } from "./practice-history-view";
import { PracticeQuizRunner } from "./practice-quiz-runner";
import { PracticeResultView } from "./practice-result-view";
import { PracticeTopicSelector } from "./practice-topic-selector";

type ActiveTab = "practice" | "history";
type PracticeStage = "select" | "quiz" | "result";

export function PracticeContainer() {
  const t = useTranslations("practice");
  const access = useLearningAccess();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Tab state synced with searchParams (?tab=practice or ?tab=history)
  const tabParam = searchParams.get("tab");
  const tab: ActiveTab = tabParam === "history" ? "history" : "practice";

  // Persistent active session from storage
  const activeSavedSession = useActivePracticeSession();
  const [internalStage, setInternalStage] = useState<PracticeStage>("select");

  // If there's an active in-progress session, resume it unless showing results
  const stage: PracticeStage =
    internalStage === "result"
      ? "result"
      : activeSavedSession && activeSavedSession.questions.length > 0
        ? "quiz"
        : internalStage;

  const [lastSelectedTestIds, setLastSelectedTestIds] = useState<string[]>([]);
  const [lastQuestionLimit, setLastQuestionLimit] = useState<
    number | undefined
  >(undefined);
  const [submitResult, setSubmitResult] = useState<PracticeSubmitResult | null>(
    null,
  );

  const activeQuestions = activeSavedSession?.questions ?? [];

  const {
    data: topics = [],
    isLoading: isLoadingTopics,
    error: topicsError,
  } = usePracticeTopics();
  const startPractice = useStartPractice();
  const submitPractice = useSubmitPractice();

  const isAccessDenied =
    access.isAccessDenied ||
    isSubscriptionRequiredError(topicsError) ||
    isSubscriptionRequiredError(startPractice.error) ||
    isSubscriptionRequiredError(submitPractice.error);

  const handleTabChange = useCallback(
    (nextTab: ActiveTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextTab === "practice") {
        params.delete("tab");
      } else {
        params.set("tab", "history");
      }
      params.delete("question");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleStartSession = (testIds: string[], limit?: number) => {
    setLastSelectedTestIds(testIds);
    setLastQuestionLimit(limit);

    startPractice.mutate(
      { testIds, questionLimit: limit },
      {
        onSuccess: (data) => {
          saveActivePracticeSession({
            testIds,
            limit,
            questions: data.questions,
            answers: {},
            elapsedSeconds: 0,
          });
          setInternalStage("quiz");

          const params = new URLSearchParams(searchParams.toString());
          params.set("question", "1");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        },
      },
    );
  };

  const handleFinishQuiz = (
    answers: PracticeAnswerInput[],
    timeSpentSeconds: number,
  ) => {
    const testIdsToSubmit = activeSavedSession?.testIds ?? lastSelectedTestIds;
    submitPractice.mutate(
      {
        testIds: testIdsToSubmit,
        answers,
        timeSpentSeconds,
      },
      {
        onSuccess: (result) => {
          clearSavedPracticeSession();
          setSubmitResult(result);
          setInternalStage("result");

          const params = new URLSearchParams(searchParams.toString());
          params.delete("question");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        },
      },
    );
  };

  const handleTryAgain = () => {
    const testIds = activeSavedSession?.testIds ?? lastSelectedTestIds;
    const limit = activeSavedSession?.limit ?? lastQuestionLimit;
    handleStartSession(testIds, limit);
  };

  const handleChooseOther = () => {
    clearSavedPracticeSession();
    setInternalStage("select");
    setSubmitResult(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("question");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleViewHistory = () => {
    handleTabChange("history");
  };

  return (
    <LearningAccessNotice
      isLoading={access.isLoading}
      isError={access.isError}
      isAccessDenied={isAccessDenied}
      error={access.error}
      onRetry={() => {
        void access.refetchSubscription();
      }}
      layout="inline"
    >
      <div className="flex flex-col gap-6">
        {/* Top Navigation Tabs (only shown when not inside an active quiz) */}
        {stage !== "quiz" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-1 rounded-2xl bg-muted p-1 w-fit">
              <button
                type="button"
                onClick={() => handleTabChange("practice")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
                  tab === "practice"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <TargetIcon className="size-4" />
                <span>{t("tabs.practice")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("history")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
                  tab === "history"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <HistoryIcon className="size-4" />
                <span>{t("tabs.history")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Practice mode */}
        {tab === "practice" && (
          <>
            {stage === "select" && (
              <LoaderGate isLoading={isLoadingTopics}>
                <PracticeTopicSelector
                  topics={topics}
                  onStart={handleStartSession}
                  isLoading={startPractice.isPending}
                />
              </LoaderGate>
            )}

            {stage === "quiz" && (
              <PracticeQuizRunner
                questions={activeQuestions}
                initialAnswers={activeSavedSession?.answers}
                initialElapsedSeconds={activeSavedSession?.elapsedSeconds}
                onFinish={handleFinishQuiz}
                onQuit={handleChooseOther}
                isSubmitting={submitPractice.isPending}
              />
            )}

            {stage === "result" && submitResult && (
              <PracticeResultView
                result={submitResult}
                onTryAgain={handleTryAgain}
                onChooseOther={handleChooseOther}
                onViewHistory={handleViewHistory}
              />
            )}
          </>
        )}

        {/* Tab 2: Test history */}
        {tab === "history" && <PracticeHistoryView />}
      </div>
    </LearningAccessNotice>
  );
}
