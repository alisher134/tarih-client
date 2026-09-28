"use client";

import type { ReactNode } from "react";

import { cn } from "cn";
import {
  ChevronRightIcon,
  ClipboardListIcon,
  LockIcon,
  PlayCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { StudentCourseLesson } from "@/entities/course";
import { Link } from "@/shared/config/i18n/navigation";
import { formatDuration } from "@/shared/lib/format-duration";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";

type CourseLessonsProps = {
  slug: string;
  lessons: StudentCourseLesson[];
  canAccess: boolean;
  isAccessLoading?: boolean;
};

export function CourseLessons({
  slug,
  lessons,
  canAccess,
  isAccessLoading = false,
}: CourseLessonsProps) {
  const canOpenLessons = canAccess && !isAccessLoading;
  const t = useTranslations("courses");
  const sortedLessons = [...lessons].sort(
    (left, right) => left.order - right.order,
  );

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        description={canOpenLessons ? t("freeOrderHint") : undefined}
      >
        {t("curriculum")}
      </SectionHeading>

      <ul className="divide-y divide-border rounded-xl border border-border">
        {sortedLessons.map((lesson) => (
          <li key={lesson.id}>
            <CurriculumRow
              title={lesson.title}
              meta={
                lesson.videoDuration != null
                  ? formatDuration(lesson.videoDuration)
                  : null
              }
              icon={
                <PlayCircleIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              }
              canOpen={canOpenLessons}
              href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
              lockedLabel={t("locked")}
            />

            <Show when={lesson.hasTest === true && lesson.testId != null}>
              <CurriculumRow
                title={t("test")}
                meta={null}
                icon={
                  <ClipboardListIcon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                }
                canOpen={canOpenLessons}
                href={`/dashboard/courses/${slug}/lessons/${lesson.id}/test`}
                lockedLabel={t("locked")}
                className="border-t border-border bg-muted/20 pl-10"
              />
            </Show>
          </li>
        ))}
      </ul>
    </section>
  );
}

type CurriculumRowProps = {
  title: string;
  meta: string | null;
  icon: ReactNode;
  canOpen: boolean;
  href: string;
  lockedLabel: string;
  className?: string;
};

function CurriculumRow({
  title,
  meta,
  icon,
  canOpen,
  href,
  lockedLabel,
  className,
}: CurriculumRowProps) {
  const content = (
    <>
      {icon}
      <span className="min-w-0 flex-1 font-medium">{title}</span>
      <Show when={meta != null}>
        <span className="text-sm text-muted-foreground">{meta}</span>
      </Show>
      <Show
        when={canOpen}
        fallback={<LockIcon className="size-4 shrink-0" aria-hidden />}
      >
        <ChevronRightIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Show>
    </>
  );

  if (!canOpen) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-muted-foreground",
          className,
        )}
        title={lockedLabel}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-muted/50",
        className,
      )}
    >
      {content}
    </Link>
  );
}
