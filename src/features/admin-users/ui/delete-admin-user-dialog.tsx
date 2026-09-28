"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useSession } from "@/entities/session";
import type { User } from "@/entities/user";
import { getErrorMessage } from "@/shared/api";
import { useRouter } from "@/shared/config/i18n/navigation";
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
import { showSuccessToast } from "@/shared/utils";

import { useDeleteUser } from "../model/use-delete-user";

type DeleteAdminUserDialogProps = {
  user: User;
};

export function DeleteAdminUserDialog({ user }: DeleteAdminUserDialogProps) {
  const t = useTranslations("adminUsers");
  const router = useRouter();
  const { data: sessionUser } = useSession();
  const { mutate, isPending } = useDeleteUser();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSelf = sessionUser?.id === user.id;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) setSubmitError(null);
  };

  const handleDelete = () => {
    setSubmitError(null);

    mutate(user.id, {
      onSuccess: () => {
        showSuccessToast(t("successDelete"));
        router.replace("/admin/users");
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error, t("errors.deleteFailed")));
      },
    });
  };

  return (
    <section className="flex flex-col gap-3">
      <Show when={isSelf}>
        <p className="text-sm text-muted-foreground">{t("cannotDeleteSelf")}</p>
      </Show>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          disabled={isSelf}
          render={<Button variant="destructive" />}
        >
          {t("deleteTitle")}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteDescription", { email: user.email })}
            </DialogDescription>
          </DialogHeader>

          <Show when={submitError != null}>
            <ErrorAlert errorMessage={submitError!} />
          </Show>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("deleteCancel")}
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {t("deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
