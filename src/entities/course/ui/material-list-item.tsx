import type { ReactNode } from "react";

import { FileTextIcon } from "lucide-react";

import { formatFileSize } from "@/shared/lib/format-file-size";

type MaterialListItemProps = {
  title: string;
  fileName: string;
  fileSize: number;
  action: ReactNode;
};

export function MaterialListItem({
  title,
  fileName,
  fileSize,
  action,
}: MaterialListItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-colors hover:border-primary/40">
      <FileTextIcon className="size-5 shrink-0 text-primary/60" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {fileName} · {formatFileSize(fileSize)}
        </p>
      </div>
      {action}
    </div>
  );
}
