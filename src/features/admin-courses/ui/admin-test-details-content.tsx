"use client";

import { useTranslations } from "next-intl";

import type { LessonTest } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { ErrorPageElement } from "@/shared/ui/error-page-element";

import { AdminQuestionsTable } from "./admin-questions-table";
import { UpdateAdminTestForm } from "./update-admin-test-form";

type AdminTestDetailsContentProps = {
  courseId: string;
  test: LessonTest | undefined;
  copyParent?: GenerateCopyParent;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

export function AdminTestDetailsContent({
  courseId,
  test,
  copyParent,
  isLoading,
  isError,
  error,
}: AdminTestDetailsContentProps) {
  const t = useTranslations("adminCourses");

  return (
    <AsyncWrapper
      isLoading={isLoading}
      isError={isError}
      data={test}
      errorSlot={
        <ErrorPageElement
          layout="inline"
          title={t("errors.testNotFound")}
          description={getErrorMessage(error, t("errors.testNotFound"))}
          homeLabel={t("errors.backToCourse")}
          homeHref={`/admin/courses/${courseId}`}
        />
      }
    >
      {(currentTest) => (
        <div className="flex flex-col gap-10">
          <UpdateAdminTestForm
            courseId={courseId}
            test={currentTest}
            copyParent={copyParent}
          />
          <AdminQuestionsTable
            courseId={courseId}
            testId={currentTest.id}
            questions={currentTest.questions}
            copyParent={copyParent}
          />
        </div>
      )}
    </AsyncWrapper>
  );
}
