"use client";

import { cn } from "cn";
import { useTranslations } from "next-intl";

import {
  formatPriceKzt,
  formatPricePerMonthKzt,
  type SubscriptionPlan,
} from "@/entities/subscription";
import { getLocalizedApiErrorMessage } from "@/shared/api";
import { buttonVariants } from "@/shared/ui/button";
import { AsyncWrapper } from "@/shared/ui/async-wrapper";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Show } from "@/shared/ui/show";

import { useSubscriptionPlans } from "../model/use-subscription-plans";
import { PricingCard } from "./pricing-card";
import { TelegramPurchaseButton } from "./telegram-purchase-button";

function getFeaturedPlanId(plans: SubscriptionPlan[]) {
  if (plans.length === 0) return null;

  const featuredPlan = plans.reduce((longest, plan) =>
    plan.durationMonths > longest.durationMonths ? plan : longest,
  );

  return featuredPlan.id;
}

export function PricingPlans() {
  const t = useTranslations("home");
  const tSubscription = useTranslations("subscription");
  const tErrors = useTranslations("errors");
  const { data, isLoading, isError, error } = useSubscriptionPlans();
  const featuredPlanId = data == null ? null : getFeaturedPlanId(data);

  return (
    <AsyncWrapper
      isLoading={isLoading}
      isError={isError}
      data={data}
      errorSlot={
        <ErrorAlert
          errorMessage={getLocalizedApiErrorMessage(
            error,
            (code) => tErrors(`apiCodes.${code}`),
            t("errors.plansLoadFailed"),
          )}
        />
      }
    >
      {(plans) => (
        <Show
          when={plans.length > 0}
          fallback={<EmptyState title={t("plansEmpty")} />}
        >
          <div className="flex flex-col gap-4">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <li key={plan.id}>
                  <PricingCard
                    months={plan.durationMonths}
                    period={plan.title}
                    price={formatPriceKzt(plan.priceKzt)}
                    pricePerMonth={formatPricePerMonthKzt(
                      plan.priceKzt,
                      plan.durationMonths,
                    )}
                    perMonthLabel={t("perMonth")}
                    priceNote={t("priceNote")}
                    featured={plan.id === featuredPlanId}
                    action={
                      <TelegramPurchaseButton
                        planId={plan.id}
                        planSlug={plan.slug}
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            size: "default",
                          }),
                          "h-auto min-h-9 w-full whitespace-normal py-2 text-center leading-snug",
                        )}
                      >
                        {t("cta")}
                      </TelegramPurchaseButton>
                    }
                  />
                </li>
              ))}
            </ul>

            <p className="text-center text-sm text-muted-foreground">
              {tSubscription("purchaseInstructions")}
            </p>
          </div>
        </Show>
      )}
    </AsyncWrapper>
  );
}
