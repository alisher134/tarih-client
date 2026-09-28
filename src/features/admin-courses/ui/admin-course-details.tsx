"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorAlert } from "@/shared/ui/error-alert";

import { toCopyParent } from "../lib/to-copy-parent";
import { useAdminCourse } from "../model/use-admin-course";
import { AdminCourseLessons } from "./admin-course-lessons";
import { DeleteAdminCourseDialog } from "./delete-admin-course-dialog";
import { UpdateAdminCourseForm } from "./update-admin-course-form";

type AdminCourseDetailsProps = {
  courseId: string;
};

export function AdminCourseDetails({ courseId }: AdminCourseDetailsProps) {
  const t = useTranslations("adminCourses");
  const { data, isLoading, isError, error } = useAdminCourse(courseId);

  return (
    <AsyncWrapper
      isLoading={isLoading}
      isError={isError}
      data={data}
      errorSlot={
        <ErrorAlert
          errorMessage={getErrorMessage(error, t("errors.courseLoadFailed"))}
        />
      }
    >
      {(course) => (
        <div className="flex flex-col gap-10">
          <UpdateAdminCourseForm course={course} />
          <AdminCourseLessons
            courseId={course.id}
            lessons={course.lessons}
            copyParent={toCopyParent({ course })}
          />
          <DeleteAdminCourseDialog course={course} />
        </div>
      )}
    </AsyncWrapper>
  );
}
