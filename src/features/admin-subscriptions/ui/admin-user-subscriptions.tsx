"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  formatPriceKzt,
  type UserSubscription,
} from "@/entities/subscription";
import { getErrorMessage } from "@/shared/api";
import { formatDateTime } from "@/shared/lib/dayjs";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Button } from "@/shared/ui/button";
import { ConfirmDeleteDialog } from "@/shared/ui/confirm-delete-dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

import { useCancelSubscription } from "../model/use-cancel-subscription";
import { useSubscriptionPlans } from "../model/use-subscription-plans";
import { useUserSubscriptions } from "../model/use-user-subscriptions";
import { GrantSubscriptionDialog } from "./grant-subscription-dialog";

type AdminUserSubscriptionsProps = {
  userId: string;
};

export function AdminUserSubscriptions({ userId }: AdminUserSubscriptionsProps) {
  const t = useTranslations("adminSubscriptions");
  const subscriptionsQuery = useUserSubscriptions(userId);
  const plansQuery = useSubscriptionPlans();
  const { mutateAsync: cancelSubscription, isPending: isCancelPending } =
    useCancelSubscription(userId);

  const handleCancelSubscription = (subscriptionId: string) =>
    cancelSubscription(subscriptionId).then(() => undefined);

  const isLoading = subscriptionsQuery.isLoading || plansQuery.isLoading;
  const isError = subscriptionsQuery.isError || plansQuery.isError;
  const error = subscriptionsQuery.error ?? plansQuery.error;

  const combinedData =
    subscriptionsQuery.data != null && plansQuery.data != null
      ? { subscriptions: subscriptionsQuery.data, plans: plansQuery.data }
      : undefined;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionHeading>{t("title")}</SectionHeading>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Show when={plansQuery.data != null && plansQuery.data.length > 0} data={plansQuery.data}>
          {(plans) => <GrantSubscriptionDialog userId={userId} plans={plans} />}
        </Show>
      </div>

      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={combinedData}
        errorSlot={
          <ErrorAlert
            errorMessage={getErrorMessage(error, t("errors.loadFailed"))}
          />
        }
      >
        {({ subscriptions }) => (
          <Show
            when={subscriptions.length > 0}
            fallback={
              <EmptyState title={t("empty")} />
            }
          >
            <ul className="flex flex-col gap-3">
              {subscriptions.map((subscription) => (
                <SubscriptionHistoryItem
                  key={subscription.id}
                  subscription={subscription}
                  isCancelPending={isCancelPending}
                  onCancel={handleCancelSubscription}
                />
              ))}
            </ul>
          </Show>
        )}
      </AsyncWrapper>
    </section>
  );
}

type SubscriptionHistoryItemProps = {
  subscription: UserSubscription;
  isCancelPending: boolean;
  onCancel: (subscriptionId: string) => Promise<void>;
};

function SubscriptionHistoryItem({
  subscription,
  isCancelPending,
  onCancel,
}: SubscriptionHistoryItemProps) {
  const t = useTranslations("adminSubscriptions");
  const locale = useLocale();
  const canCancel =
    subscription.status === "ACTIVE" && !subscription.isExpired;

  return (
    <li className="rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-medium">{subscription.plan.title}</p>
          <p className="text-sm text-muted-foreground">
            {t(`status.${subscription.status}`)}
          </p>
        </div>

        <p className="text-sm font-medium">
          {formatPriceKzt(subscription.plan.priceKzt)}
        </p>
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t("startsAt")}</dt>
          <dd>{formatDateTime(subscription.startsAt, locale)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("expiresAt")}</dt>
          <dd>{formatDateTime(subscription.expiresAt, locale)}</dd>
        </div>
        <Show when={subscription.status === "ACTIVE"}>
          <div>
            <dt className="text-muted-foreground">{t("remainingDays")}</dt>
            <dd>{subscription.remainingDays}</dd>
          </div>
        </Show>
      </dl>

      <Show when={canCancel}>
        <div className="mt-4">
          <ConfirmDeleteDialog
            title={t("cancelTitle")}
            description={t("cancelDescription")}
            confirmLabel={t("cancelConfirm")}
            cancelLabel={t("cancelDismiss")}
            isPending={isCancelPending}
            trigger={
              <Button type="button" variant="destructive" size="sm">
                {t("cancelAction")}
              </Button>
            }
            onConfirm={() => onCancel(subscription.id)}
          />
        </div>
      </Show>
    </li>
  );
}
