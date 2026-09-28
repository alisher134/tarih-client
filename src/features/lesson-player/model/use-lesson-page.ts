"use client";

import { useMemo } from "react";

import type {
  StudentCourseDetail,
  StudentCourseLesson,
} from "@/entities/course";

import { useCourseAccess } from "@/features/courses";

type UseLessonPageResult = {
  course: StudentCourseDetail | undefined;
  lesson: StudentCourseLesson | undefined;
  nextLesson: StudentCourseLesson | undefined;
  canAccess: boolean;
  isAccessDenied: boolean;
  isAccessLoading: boolean;
  isAccessError: boolean;
  accessError: unknown;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetchCourse: () => void;
  refetchSubscription: () => void;
};

export function useLessonPage(
  slug: string,
  lessonId: string,
): UseLessonPageResult {
  const access = useCourseAccess(slug);

  const { lesson, nextLesson } = useMemo(() => {
    const lessons = access.course?.lessons ?? [];
    const sortedLessons = [...lessons].sort(
      (left, right) => left.order - right.order,
    );
    const currentLesson = sortedLessons.find((item) => item.id === lessonId);
    const currentIndex = sortedLessons.findIndex(
      (item) => item.id === lessonId,
    );

    return {
      lesson: currentLesson,
      nextLesson: sortedLessons[currentIndex + 1],
    };
  }, [access.course?.lessons, lessonId]);

  const isLessonNotFound =
    !access.isLoading && access.course != null && lesson == null;

  return {
    course: access.course,
    lesson,
    nextLesson,
    canAccess: access.canAccess,
    isAccessDenied: access.isAccessDenied,
    isAccessLoading: access.isAccessLoading,
    isAccessError: access.isAccessError,
    accessError: access.accessError,
    isLoading: access.isLoading,
    isError: access.isError || isLessonNotFound,
    error: access.error,
    refetchCourse: () => {
      void access.refetchCourse();
    },
    refetchSubscription: () => {
      void access.refetchSubscription();
    },
  };
}
