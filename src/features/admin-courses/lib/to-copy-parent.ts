import type { GenerateCopyParent } from "@/shared/lib/generate-copy";

type CopySource = {
  title: string;
  description: string | null;
};

export function toCopyParent(input: {
  course?: CopySource;
  lesson?: CopySource;
  test?: CopySource;
}): GenerateCopyParent {
  return {
    courseTitle: input.course?.title,
    courseDescription: input.course?.description ?? undefined,
    lessonTitle: input.lesson?.title,
    lessonDescription: input.lesson?.description ?? undefined,
    testTitle: input.test?.title,
    testDescription: input.test?.description ?? undefined,
  };
}
