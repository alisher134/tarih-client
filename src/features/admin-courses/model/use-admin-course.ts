"use client";

import { useQuery } from "@tanstack/react-query";

import { adminCourseDetailQueryKey, getAdminCourse } from "@/entities/course";

export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: adminCourseDetailQueryKey(id),
    queryFn: () => getAdminCourse(id),
    enabled: id.length > 0,
  });
}
