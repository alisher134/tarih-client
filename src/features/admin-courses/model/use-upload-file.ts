"use client";

import { useMutation } from "@tanstack/react-query";

import {
  confirmUploadIntent,
  createUploadIntent,
  putUploadFile,
  type UploadPurpose,
} from "@/entities/course";

type UploadFileInput = {
  file: File;
  purpose: UploadPurpose;
  courseId?: string;
  lessonId?: string;
};

export function useUploadFile() {
  return useMutation({
    mutationKey: ["admin", "uploads"],
    mutationFn: async ({
      file,
      purpose,
      courseId,
      lessonId,
    }: UploadFileInput) => {
      const intent = await createUploadIntent({
        purpose,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
        courseId,
        lessonId,
      });

      await putUploadFile(intent.uploadUrl, file);
      await confirmUploadIntent(intent.objectKey);

      return {
        objectKey: intent.objectKey,
        fileName: file.name,
        fileSize: file.size,
      };
    },
  });
}
