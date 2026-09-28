"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyEnrollments, MY_ENROLLMENTS_QUERY_KEY } from "@/entities/course";

export function useMyEnrollments() {
  return useQuery({
    queryKey: MY_ENROLLMENTS_QUERY_KEY,
    queryFn: getMyEnrollments,
  });
}
