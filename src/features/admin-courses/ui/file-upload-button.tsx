"use client";

import { useRef, useState } from "react";

import { useTranslations } from "next-intl";
import { cn } from "cn";

import type { UploadPurpose } from "@/entities/course";
import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { showSuccessToast } from "@/shared/utils";

import { useUploadFile } from "../model/use-upload-file";

type FileUploadButtonProps = {
  purpose: UploadPurpose;
  accept: string;
  courseId?: string;
  lessonId?: string;
  label: string;
  selectedFileName?: string;
  error?: string;
  onUploaded: (result: {
    objectKey: string;
    fileName: string;
    fileSize: number;
    duration?: number;
  }) => void;
};

export function FileUploadButton({
  purpose,
  accept,
  courseId,
  lessonId,
  label,
  selectedFileName,
  error,
  onUploaded,
}: FileUploadButtonProps) {
  const t = useTranslations("adminCourses");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadFile();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const displayedFileName =
    selectedFileName != null && selectedFileName.length > 0
      ? selectedFileName
      : uploadedFileName;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (file == null) return;

    setUploadError(null);

    mutate(
      { file, purpose, courseId, lessonId },
      {
        onSuccess: async (result) => {
          const duration =
            purpose === "video" ? await readVideoDuration(file) : undefined;

          showSuccessToast(t("successUpload"));
          setUploadedFileName(result.fileName);
          onUploaded({ ...result, duration });
        },
        onError: (uploadFailure) => {
          setUploadError(getErrorMessage(uploadFailure, t("errors.uploadFailed")));
        },
      },
    );
  };

  const fieldError = error ?? uploadError ?? undefined;

  return (
    <Field data-invalid={fieldError != null ? true : undefined}>
      <FieldLabel className="font-normal text-muted-foreground">
        {label}
      </FieldLabel>

      <div className="flex h-8 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            selectedFileName != null && selectedFileName.length > 0
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {displayedFileName != null && displayedFileName.length > 0
            ? displayedFileName
            : t("noFileSelected")}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="xs"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? t("uploading") : t("chooseFile")}
        </Button>
      </div>

      {fieldError != null ? <FieldError>{fieldError}</FieldError> : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
    </Field>
  );
}

function readVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(
        Number.isFinite(video.duration)
          ? Math.round(video.duration)
          : undefined,
      );
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(undefined);
    };
    video.src = objectUrl;
  });
}
