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

      <div className="flex flex-col gap-3">
        {sortedLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group/lesson overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
          >
            <CurriculumRow
              title={lesson.title}
              meta={
                lesson.videoDuration != null
                  ? formatDuration(lesson.videoDuration)
                  : null
              }
              icon={<PlayCircleIcon className="size-4.5" aria-hidden />}
              canOpen={canOpenLessons}
              href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
              lockedLabel={t("locked")}
              isTest={false}
            />

            <Show when={lesson.hasTest === true && lesson.testId != null}>
              <CurriculumRow
                title={t("test")}
                meta={null}
                icon={<ClipboardListIcon className="size-4.5" aria-hidden />}
                canOpen={canOpenLessons}
                href={`/dashboard/courses/${slug}/lessons/${lesson.id}/test`}
                lockedLabel={t("locked")}
                isTest={true}
                className="relative border-t border-border/50 bg-muted/10 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-primary/30"
              />
            </Show>
          </div>
        ))}
      </div>
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
  isTest?: boolean;
};

function CurriculumRow({
  title,
  meta,
  icon,
  canOpen,
  href,
  lockedLabel,
  className,
  isTest = false,
}: CurriculumRowProps) {
  const content = (
    <>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          canOpen
            ? isTest
              ? "bg-primary/10 text-primary group-hover:bg-primary/20"
              : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            : "bg-muted/50 text-muted-foreground/50",
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "min-w-0 flex-1 font-medium transition-colors",
          canOpen ? "group-hover:text-foreground" : "text-muted-foreground",
        )}
      >
        {title}
      </span>
      <Show when={meta != null}>
        <span className="text-sm font-medium text-muted-foreground">
          {meta}
        </span>
      </Show>
      <Show
        when={canOpen}
        fallback={
          <LockIcon
            className="size-4 shrink-0 text-muted-foreground/50"
            aria-hidden
          />
        }
      >
        <ChevronRightIcon
          className="size-4 shrink-0 text-muted-foreground/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
          aria-hidden
        />
      </Show>
    </>
  );

  if (!canOpen) {
    return (
      <div
        className={cn("group flex items-center gap-4 px-5 py-3.5", className)}
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
        "group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40",
        className,
      )}
    >
      {content}
    </Link>
  );
}
