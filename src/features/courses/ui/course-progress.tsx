"use client";

import { cn } from "cn";
import { useTranslations } from "next-intl";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/shared/ui/progress";

type CourseProgressProps = {
  value: number;
  className?: string;
};

export function CourseProgress({ value, className }: CourseProgressProps) {
  const t = useTranslations("courses");

  return (
    <Progress value={value} className={cn("w-full", className)}>
      <ProgressLabel>{t("progress")}</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
