import { getTranslations } from "next-intl/server";
import { LinkButton } from "@/shared/ui/link-button";

export async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground md:px-12 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg text-primary-foreground/80 sm:text-xl">
          {t("subtitle")}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <LinkButton
            href="#pricing"
            size="lg"
            className="h-14 rounded-full bg-background px-8 text-base font-semibold text-primary hover:bg-background/90"
          >
            {t("cta")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
