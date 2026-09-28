"use client";

import { useMemo } from "react";

import { toCopyParent } from "../lib/to-copy-parent";
import { useAdminCourse } from "../model/use-admin-course";
import { AdminLessonBreadcrumbs } from "./admin-lesson-breadcrumbs";
import { AdminLessonDetailsContent } from "./admin-lesson-details-content";

type AdminLessonPageProps = {
  courseId: string;
  lessonId: string;
};

export function AdminLessonPage({ courseId, lessonId }: AdminLessonPageProps) {
  const { data, isLoading, isError, error } = useAdminCourse(courseId);
  const lesson = useMemo(
    () => data?.lessons.find((item) => item.id === lessonId),
    [data?.lessons, lessonId],
  );

  return (
    <div className="flex flex-col gap-4">
      <AdminLessonBreadcrumbs
        courseId={courseId}
        lessonId={lessonId}
        course={data}
        lesson={lesson}
      />
      <AdminLessonDetailsContent
        courseId={courseId}
        lesson={lesson}
        copyParent={toCopyParent({ course: data })}
        isLoading={isLoading}
        isError={isError || (!isLoading && lesson == null)}
        error={error}
      />
    </div>
  );
}
