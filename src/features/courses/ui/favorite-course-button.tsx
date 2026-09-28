"use client";

import { HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { showErrorToast, showSuccessToast } from "@/shared/utils";

import { useToggleFavorite } from "../model/use-toggle-favorite";

type FavoriteCourseButtonProps = {
  courseId: string;
  isFavorite: boolean;
  className?: string;
};

export function FavoriteCourseButton({
  courseId,
  isFavorite,
  className,
}: FavoriteCourseButtonProps) {
  const t = useTranslations("courses");
  const { mutate, isPending } = useToggleFavorite();

  const handleToggle = () => {
    mutate(
      { courseId, isFavorite },
      {
        onSuccess: () => {
          showSuccessToast(
            isFavorite ? t("successFavoriteRemove") : t("successFavoriteAdd"),
          );
        },
        onError: (error) => {
          showErrorToast(getErrorMessage(error, t("errors.favoriteFailed")));
        },
      },
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={handleToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t("favoriteRemove") : t("favoriteAdd")}
      className={className}
    >
      <HeartIcon
        className={isFavorite ? "fill-primary text-primary" : undefined}
        aria-hidden
      />
      {isFavorite ? t("favoriteRemove") : t("favoriteAdd")}
    </Button>
  );
}
