"use client";

import type { ReactNode } from "react";

import { cn } from "cn";
import {
  ChevronRightIcon,
  CheckCircle2Icon,
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
      <SectionHeading>{t("curriculum")}</SectionHeading>

      <div className="flex flex-col gap-3">
        {sortedLessons.map((lesson) => {
          const isLessonLocked = !canOpenLessons || lesson.isLocked;

          return (
            <div
              key={lesson.id}
              className={cn(
                "group/lesson overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs transition-all duration-300",
                !isLessonLocked && "hover:border-primary/40 hover:shadow-md",
                isLessonLocked && "opacity-75",
              )}
            >
              <CurriculumRow
                title={lesson.title}
                meta={
                  lesson.videoDuration != null
                    ? formatDuration(lesson.videoDuration)
                    : null
                }
                icon={
                  lesson.isCompleted ? (
                    <CheckCircle2Icon className="size-4.5" aria-hidden />
                  ) : (
                    <PlayCircleIcon className="size-4.5" aria-hidden />
                  )
                }
                canOpen={!isLessonLocked}
                href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
                lockedLabel={t("locked")}
                isCompleted={lesson.isCompleted}
              />
            </div>
          );
        })}
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
  isCompleted?: boolean;
};

function CurriculumRow({
  title,
  meta,
  icon,
  canOpen,
  href,
  lockedLabel,
  className,
  isCompleted = false,
}: CurriculumRowProps) {
  const content = (
    <>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          canOpen
            ? isCompleted
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
          isCompleted && "text-foreground",
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
