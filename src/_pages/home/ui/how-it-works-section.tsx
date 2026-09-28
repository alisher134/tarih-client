import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/shared/ui/card";

import { SectionHeader } from "./section-header";

const steps = ["step1", "step2", "step3"] as const;

export async function HowItWorksSection() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-5xl space-y-12">
      <SectionHeader
        align="center"
        title={t("howItWorks.title")}
        description={t("howItWorks.description")}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={step}
            className="group relative overflow-hidden border bg-background/50 transition-colors hover:bg-muted/50 hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative flex h-full flex-col p-8">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 font-heading text-xl font-bold text-primary">
                {index + 1}
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold tracking-tight">
                {t(`howItWorks.${step}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`howItWorks.${step}.description`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
