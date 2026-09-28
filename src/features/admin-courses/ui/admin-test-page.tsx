"use client";

import { useMemo } from "react";

import { toCopyParent } from "../lib/to-copy-parent";
import { useAdminCourse } from "../model/use-admin-course";
import { AdminTestBreadcrumbs } from "./admin-test-breadcrumbs";
import { AdminTestDetailsContent } from "./admin-test-details-content";

type AdminTestPageProps = {
  courseId: string;
  testId: string;
};

export function AdminTestPage({ courseId, testId }: AdminTestPageProps) {
  const { data, isLoading, isError, error } = useAdminCourse(courseId);
  const lesson = useMemo(
    () => data?.lessons.find((item) => item.test?.id === testId),
    [data?.lessons, testId],
  );
  const test = lesson?.test ?? undefined;

  return (
    <div className="flex flex-col gap-4">
      <AdminTestBreadcrumbs
        courseId={courseId}
        testId={testId}
        course={data}
        test={test}
      />
      <AdminTestDetailsContent
        courseId={courseId}
        test={test}
        copyParent={toCopyParent({ course: data, lesson, test })}
        isLoading={isLoading}
        isError={isError || (!isLoading && test == null)}
        error={error}
      />
    </div>
  );
}
