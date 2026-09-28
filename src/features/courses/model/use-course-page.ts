"use client";

import { useCourseLearningSummary } from "@/entities/learning";

import { useCourse } from "../model/use-course";
import { useFavorites } from "../model/use-favorites";
import { useLearningAccess } from "../model/use-learning-access";
import { useMyEnrollments } from "../model/use-my-enrollments";

export function useCoursePage(slug: string) {
  const courseQuery = useCourse(slug);
  const enrollmentsQuery = useMyEnrollments();
  const favoritesQuery = useFavorites();
  const access = useLearningAccess();
  const learningSummaryQuery = useCourseLearningSummary(
    courseQuery.data?.id,
    access.hasAccess,
  );

  const myCourse = enrollmentsQuery.data?.find(
    (item) =>
      item.course.slug === slug || item.course.id === courseQuery.data?.id,
  );
  const summaryEnrollment = learningSummaryQuery.data?.enrollment;
  const enrollmentProgress =
    summaryEnrollment != null
      ? {
          progress: summaryEnrollment.progress,
          status: summaryEnrollment.status,
          isStarted: summaryEnrollment.progress > 0,
        }
      : myCourse != null
        ? {
            progress: myCourse.progress,
            status: myCourse.status,
            isStarted: myCourse.isStarted,
          }
        : null;
  const isFavorite =
    favoritesQuery.data?.some(
      (item) => item.courseId === courseQuery.data?.id,
    ) === true;

  return {
    course: courseQuery.data,
    enrollmentProgress,
    isFavorite,
    canAccess: access.hasAccess,
    isAccessDenied: access.isAccessDenied,
    isAccessLoading: access.isLoading,
    isAccessError: access.isError,
    accessError: access.error,
    nextAction: learningSummaryQuery.data?.nextAction,
    isLearningSummaryLoading:
      access.hasAccess && learningSummaryQuery.isLoading,
    isLearningSummaryError: access.hasAccess && learningSummaryQuery.isError,
    learningSummaryError: learningSummaryQuery.error,
    isLoading: courseQuery.isLoading,
    isError: courseQuery.isError,
    error: courseQuery.error,
    refetch: courseQuery.refetch,
    refetchSubscription: access.refetchSubscription,
    refetchLearningSummary: learningSummaryQuery.refetch,
  };
}
