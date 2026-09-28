"use client";

import { BookOpenIcon } from "lucide-react";
import { cn } from "cn";

import type { Course, MyCourseItemCourse } from "@/entities/course";
import { Link } from "@/shared/config/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { LinkButton } from "@/shared/ui/link-button";
import { Show } from "@/shared/ui/show";

import { CourseProgress } from "./course-progress";

type CourseCardCourse = Pick<Course, "title" | "slug"> &
  Partial<Pick<Course, "description">> &
  Pick<MyCourseItemCourse, "id">;

type CourseCardProps = {
  course: CourseCardCourse;
  href?: string;
  actionHref?: string;
  actionLabel?: string;
  meta?: string;
  progress?: number;
};

export function CourseCard({
  course,
  href,
  actionHref,
  actionLabel,
  meta,
  progress,
}: CourseCardProps) {
  const isClickableCard = href != null && actionLabel == null;

  const card = (
    <Card
      className={cn(
        "relative overflow-hidden py-0",
        isClickableCard &&
          "h-full pb-(--card-spacing) transition-colors group-hover:border-primary/40",
      )}
    >
      <div className="flex aspect-video items-center justify-center bg-primary/5 transition-colors group-hover:bg-primary/10">
        <BookOpenIcon
          className={cn(
            "size-12 text-primary/40",
            isClickableCard &&
              "transition-transform duration-200 group-hover:scale-105 group-hover:text-primary/60",
          )}
          strokeWidth={1.25}
          aria-hidden
        />
      </div>

      <CardHeader>
        <CardTitle
          className={cn(
            "text-base font-semibold",
            isClickableCard && "transition-colors group-hover:text-primary",
          )}
        >
          {course.title}
        </CardTitle>
        <Show when={meta != null}>
          <p className="text-sm text-muted-foreground">{meta}</p>
        </Show>
        <Show when={progress != null} data={progress}>
          {(value) => <CourseProgress value={value} />}
        </Show>
      </CardHeader>

      <CardContent>
        <Show
          when={course.description != null && course.description.length > 0}
        >
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
        </Show>
      </CardContent>

      <Show when={actionLabel != null && actionHref != null}>
        <CardFooter className="px-(--card-spacing) pt-0 pb-(--card-spacing)">
          <LinkButton
            href={actionHref ?? ""}
            variant="default"
            size="default"
            className="w-full"
          >
            {actionLabel}
          </LinkButton>
        </CardFooter>
      </Show>
    </Card>
  );

  if (isClickableCard) {
    return (
      <Link
        href={href}
        className="group block h-full rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
