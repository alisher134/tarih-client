"use client";

import { type ReactElement, useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isPending: boolean;
  trigger: ReactElement;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDeleteDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending,
  trigger,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setError(null);
    }
  };

  const handleConfirm = async () => {
    setError(null);

    try {
      await onConfirm();
      setOpen(false);
    } catch (confirmError) {
      if (confirmError instanceof Error) {
        setError(confirmError.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Show when={error != null}>
          <ErrorAlert errorMessage={error!} />
        </Show>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {cancelLabel}
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
