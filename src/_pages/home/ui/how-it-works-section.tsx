import { getTranslations } from "next-intl/server";

import { SectionHeader } from "./section-header";

const steps = ["step1", "step2", "step3"] as const;

export async function HowItWorksSection() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-5xl space-y-16 px-4 md:px-6">
      <SectionHeader
        align="center"
        title={t("howItWorks.title")}
        description={t("howItWorks.description")}
      />

      <div className="grid gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col gap-6">
            {/* Connecting line for desktop */}
            {index < steps.length - 1 && (
              <div className="absolute left-[3.5rem] top-6 hidden w-[calc(100%-4rem)] border-t border-dashed border-border/80 md:block" />
            )}

            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background font-heading text-lg font-medium shadow-sm">
              0{index + 1}
            </div>

            <div className="space-y-3 pr-6">
              <h3 className="font-heading text-xl font-medium tracking-tight">
                {t(`howItWorks.${step}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`howItWorks.${step}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
