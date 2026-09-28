"use client";

import { useTranslations } from "next-intl";
import type { UseFormRegisterReturn } from "react-hook-form";

import type {
  GenerateCopyEntity,
  GenerateCopyParent,
} from "@/shared/lib/generate-copy";
import { InputField } from "@/shared/ui/input-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { GenerateCopyButton } from "./generate-copy-button";

export const GENERATED_COPY_OPTIONS = {
  shouldDirty: true,
  shouldValidate: true,
} as const;

type AdminCopyFieldsProps = {
  entity: GenerateCopyEntity;
  parent?: GenerateCopyParent;
  title: string;
  description: string;
  titleError?: string;
  descriptionError?: string;
  titleRegister: UseFormRegisterReturn;
  descriptionRegister: UseFormRegisterReturn;
  onTitleGenerated: (text: string) => void;
  onDescriptionGenerated: (text: string) => void;
};

export function AdminCopyFields({
  entity,
  parent,
  title,
  description,
  titleError,
  descriptionError,
  titleRegister,
  descriptionRegister,
  onTitleGenerated,
  onDescriptionGenerated,
}: AdminCopyFieldsProps) {
  const t = useTranslations("adminCourses");

  return (
    <>
      <InputField
        label={t("name")}
        error={titleError}
        action={
          <GenerateCopyButton
            entity={entity}
            field="title"
            title={title}
            description={description}
            parent={parent}
            onGenerated={onTitleGenerated}
          />
        }
        {...titleRegister}
      />
      <TextareaField
        label={t("description")}
        error={descriptionError}
        rows={4}
        action={
          <GenerateCopyButton
            entity={entity}
            field="description"
            title={title}
            description={description}
            parent={parent}
            onGenerated={onDescriptionGenerated}
          />
        }
        {...descriptionRegister}
      />
    </>
  );
}
