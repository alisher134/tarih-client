"use client";

import { useTranslations } from "next-intl";

import type { StudentLessonTest } from "@/entities/course";
import { formatDuration } from "@/shared/lib/format-duration";
import { Button } from "@/shared/ui/button";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { Card, CardContent } from "@/shared/ui/card";

type TestIntroProps = {
  test: StudentLessonTest;
  onStart: () => void;
  isStarting: boolean;
};

export function TestIntro({ test, onStart, isStarting }: TestIntroProps) {
  const t = useTranslations("takeTest");
  const questionsCount = test.questions.length;

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-5 p-6">
        <SectionHeading>{t("rulesTitle")}</SectionHeading>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("passingScore")}</dt>
            <dd className="font-medium">{test.passingScore}%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("questionsCount")}</dt>
            <dd className="font-medium">{questionsCount}</dd>
          </div>
          <Show when={test.timeLimit != null}>
            <div>
              <dt className="text-muted-foreground">{t("timeLimit")}</dt>
              <dd className="font-medium">
                {formatDuration(test.timeLimit ?? 0)}
              </dd>
            </div>
          </Show>
          <Show when={test.attemptsLimit != null}>
            <div>
              <dt className="text-muted-foreground">{t("attemptsLimit")}</dt>
              <dd className="font-medium">{test.attemptsLimit}</dd>
            </div>
          </Show>
        </dl>

        <p className="text-sm text-muted-foreground">{t("rulesDescription")}</p>
        <p className="text-sm text-muted-foreground">{t("refreshWarning")}</p>

        <Button
          type="button"
          className="self-start"
          disabled={isStarting || questionsCount === 0}
          onClick={onStart}
        >
          {t("startAttempt")}
        </Button>
      </CardContent>
    </Card>
  );
}
