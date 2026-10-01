import { cn } from "cn";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type PricingCardProps = {
  title: string;
  price: string;
  pricePerMonth: string;
  perMonthLabel: string;
  priceNote: string;
  action: ReactNode;
  featured?: boolean;
  featuredLabel?: string;
};

export function PricingCard({
  title,
  price,
  pricePerMonth,
  perMonthLabel,
  priceNote,
  action,
  featured = false,
  featuredLabel = "Popular",
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        featured
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "bg-card hover:border-primary/30",
      )}
    >
      {featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      )}

      <CardHeader className="pb-6 pt-8 text-center">
        {featured && (
          <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {featuredLabel}
          </div>
        )}
        <CardTitle className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-1.5 text-primary text-center">
            <span className="font-heading text-4xl font-bold tracking-tight">
              {title}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-center gap-1 pb-8 text-center">
        <div className="space-y-1">
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {price}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {priceNote}
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-4 py-1.5 text-sm">
          <span className="font-semibold text-foreground">{pricePerMonth}</span>
          <span className="text-muted-foreground">{perMonthLabel}</span>
        </div>
      </CardContent>

      <CardFooter className="w-full pb-8 pt-0">{action}</CardFooter>
    </Card>
  );
}
