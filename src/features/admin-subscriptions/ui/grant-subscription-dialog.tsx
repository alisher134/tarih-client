"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import {
  formatPriceKzt,
  type SubscriptionPlan,
} from "@/entities/subscription";
import { getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { SelectField } from "@/shared/ui/select-field";
import { Show } from "@/shared/ui/show";
import { showSuccessToast } from "@/shared/utils";

import { useGrantSubscription } from "../model/use-grant-subscription";

type GrantSubscriptionDialogProps = {
  userId: string;
  plans: SubscriptionPlan[];
};

export function GrantSubscriptionDialog({
  userId,
  plans,
}: GrantSubscriptionDialogProps) {
  const t = useTranslations("adminSubscriptions");
  const { mutate, isPending } = useGrantSubscription(userId);
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError(null);
      setPlanId(plans[0]?.id ?? "");
    }
  };

  const handleGrant = () => {
    if (planId.length === 0) return;

    setSubmitError(null);

    mutate(
      { planId },
      {
        onSuccess: () => {
          showSuccessToast(t("successGrant"));
          setOpen(false);
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, t("errors.grantFailed")));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" disabled={plans.length === 0} />
        }
      >
        {t("grant")}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("grantTitle")}</DialogTitle>
        </DialogHeader>

        <SelectField
          label={t("plan")}
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.title} — {formatPriceKzt(plan.priceKzt)}
            </option>
          ))}
        </SelectField>

        <Show when={submitError != null}>
          <ErrorAlert errorMessage={submitError!} />
        </Show>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t("cancel")}
          </DialogClose>
          <Button type="button" disabled={isPending || planId.length === 0} onClick={handleGrant}>
            {t("grantConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
