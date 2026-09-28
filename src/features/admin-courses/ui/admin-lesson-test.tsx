"use client";

import { useTranslations } from "next-intl";

import type { LessonTest } from "@/entities/course";
import type { GenerateCopyParent } from "@/shared/lib/generate-copy";
import { EmptyState } from "@/shared/ui/empty-state";
import { Show } from "@/shared/ui/show";
import { SectionHeading } from "@/shared/ui/section-heading";

import { AdminExistingTest } from "./admin-existing-test";
import { CreateTestDialog } from "./create-test-dialog";

type AdminLessonTestProps = {
  courseId: string;
  lessonId: string;
  test: LessonTest | null;
  copyParent?: GenerateCopyParent;
};

export function AdminLessonTest({
  courseId,
  lessonId,
  test,
  copyParent,
}: AdminLessonTestProps) {
  const t = useTranslations("adminCourses");

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading>{t("test")}</SectionHeading>

      <Show
        when={test != null}
        fallback={
          <EmptyState
            title={t("noTest")}
            action={
              <CreateTestDialog
                courseId={courseId}
                lessonId={lessonId}
                copyParent={copyParent}
              />
            }
          />
        }
      >
        <AdminExistingTest courseId={courseId} test={test!} />
      </Show>
    </section>
  );
}
