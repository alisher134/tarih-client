import { getTranslations } from "next-intl/server";

import { PricingPlans } from "@/features/subscription";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

import { SectionHeader } from "./section-header";
import { StaggerContainer, StaggerItem, ScaleIn } from "./animated-section";

const accessItems = ["access1", "access2", "access3"] as const;

export async function PricingSection() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-5xl space-y-12" id="pricing">
      <div className="flex flex-col items-center space-y-10 rounded-3xl border bg-card/50 p-8 shadow-sm backdrop-blur-sm md:p-12 transition-colors hover:border-primary/20">
        <SectionHeader
          align="center"
          label={t("pricingLabel")}
          title={t("title")}
          description={t("description")}
        />

        <ScaleIn delay={0.2} className="w-full max-w-3xl">
          <Card className="overflow-hidden border bg-gradient-to-br from-muted/50 to-muted/20 shadow-inner hover:shadow-md transition-shadow duration-300">
            <CardContent className="flex flex-col items-center justify-between gap-4 py-5 sm:flex-row sm:gap-0 sm:px-10">
              {accessItems.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 text-muted-foreground sm:gap-0 group"
                >
                  {index > 0 ? (
                    <Separator
                      orientation="vertical"
                      className="hidden h-5 sm:mx-8 sm:block transition-all group-hover:bg-primary/50"
                    />
                  ) : null}
                  <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                    {t(item)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </ScaleIn>

        <StaggerContainer
          className="w-full pt-4"
          delay={0.3}
          staggerDelay={0.2}
        >
          <StaggerItem>
            <PricingPlans />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
