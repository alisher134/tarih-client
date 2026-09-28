"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { MaterialListItem } from "@/entities/course/ui/material-list-item";
import type { LessonMaterial } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
import { SUBSCRIPTION_PLANS_HREF } from "@/shared/config/routes";
import { isSubscriptionRequiredError } from "@/shared/lib/is-subscription-required-error";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Show } from "@/shared/ui/show";
import { showErrorToast } from "@/shared/utils";

import { useDownloadMaterial } from "../model/use-download-material";

type LessonMaterialsProps = {
  materials: LessonMaterial[];
};

export function LessonMaterials({ materials }: LessonMaterialsProps) {
  const t = useTranslations("lessonPlayer");
  const router = useRouter();
  const { mutate } = useDownloadMaterial();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const sortedMaterials = [...materials].sort(
    (left, right) => left.order - right.order,
  );

  const handleDownload = (materialId: string) => {
    setDownloadingId(materialId);

    mutate(materialId, {
      onSuccess: (result) => {
        window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
      },
      onError: (error) => {
        if (isSubscriptionRequiredError(error)) {
          router.push(SUBSCRIPTION_PLANS_HREF);
          return;
        }

        showErrorToast(getErrorMessage(error, t("errors.downloadFailed")));
      },
      onSettled: () => {
        setDownloadingId(null);
      },
    });
  };

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>{t("materials")}</SectionHeading>

      <Show
        when={sortedMaterials.length > 0}
        fallback={<EmptyState title={t("noMaterials")} />}
      >
        <div className="flex flex-col gap-3">
          {sortedMaterials.map((material) => (
            <MaterialListItem
              key={material.id}
              title={material.title}
              fileName={material.fileName}
              fileSize={material.fileSize}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={downloadingId === material.id}
                  onClick={() => handleDownload(material.id)}
                >
                  {t("download")}
                </Button>
              }
            />
          ))}
        </div>
      </Show>
    </section>
  );
}
