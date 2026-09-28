"use client";

import { SparklesIcon } from "lucide-react";
import { hasLocale, useLocale, useTranslations } from "next-intl";

import { getErrorMessage } from "@/shared/api";
import { routing } from "@/shared/config/i18n/routing";
import { useGenerateCopy } from "@/shared/hooks/use-generate-copy";
import {
  hasCopyContext,
  type GenerateCopyEntity,
  type GenerateCopyField,
  type GenerateCopyParent,
  type GenerateCopyRequest,
  type GeneratedOption,
} from "@/shared/lib/generate-copy";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { showErrorToast, showSuccessToast } from "@/shared/utils";

type GenerateCopyButtonProps = {
  entity: GenerateCopyEntity;
  field: GenerateCopyField;
  title: string;
  description: string;
  parent?: GenerateCopyParent;
  onGenerated: (text: string) => void;
  onOptionsGenerated?: (options: GeneratedOption[]) => void;
};

export function GenerateCopyButton({
  entity,
  field,
  title,
  description,
  parent,
  onGenerated,
  onOptionsGenerated,
}: GenerateCopyButtonProps) {
  const locale = useLocale();
  const t = useTranslations("adminCourses");
  const { mutate, isPending } = useGenerateCopy();
  const request: GenerateCopyRequest = {
    entity,
    field,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    title,
    description,
    parent,
  };

  const handleGenerate = () => {
    if (!hasCopyContext(request)) {
      showErrorToast(t("generateCopyNeedContext"));
      return;
    }

    mutate(request, {
      onSuccess: (result) => {
        onGenerated(result.text);
        if (result.options != null && result.options.length > 0) {
          onOptionsGenerated?.(result.options);
        }
        showSuccessToast(t("generateCopySuccess"));
      },
      onError: (error) => {
        showErrorToast(getErrorMessage(error, t("generateCopyFailed")));
      },
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      disabled={isPending}
      onClick={handleGenerate}
      aria-label={t("generateCopy")}
      title={t("generateCopy")}
    >
      {isPending ? (
        <Spinner className="size-3.5" />
      ) : (
        <SparklesIcon aria-hidden />
      )}
    </Button>
  );
}
