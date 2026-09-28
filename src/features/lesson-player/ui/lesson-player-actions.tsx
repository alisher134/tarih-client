"use client";

import { cn } from "cn";
import { useTranslations } from "next-intl";

import type { StudentCourseLesson } from "@/entities/course";
import { Link } from "@/shared/config/i18n/navigation";
import { buttonVariants } from "@/shared/ui/button";
import { Show } from "@/shared/ui/show";

type LessonPlayerActionsProps = {
  slug: string;
  currentLesson: StudentCourseLesson;
  nextLesson: StudentCourseLesson | undefined;
  isLessonCompleted: boolean;
};

export function LessonPlayerActions({
  slug,
  currentLesson,
  nextLesson,
  isLessonCompleted,
}: LessonPlayerActionsProps) {
  const t = useTranslations("lessonPlayer");

  const shouldTakeTest =
    isLessonCompleted &&
    currentLesson.hasTest === true &&
    currentLesson.testId != null;
  const shouldGoToNextLesson = nextLesson != null && !shouldTakeTest;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Show when={shouldTakeTest}>
        <Link
          href={`/dashboard/courses/${slug}/lessons/${currentLesson.id}/test`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          {t("takeTest")}
        </Link>
      </Show>
      <Show when={shouldGoToNextLesson} data={nextLesson}>
        {(lesson) => (
          <Link
            href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("nextLesson")}
          </Link>
        )}
      </Show>
    </div>
  );
}
