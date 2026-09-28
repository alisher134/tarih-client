import { getTranslations } from "next-intl/server";

import { LinkButton } from "@/shared/ui/link-button";

export async function CtaSection() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl bg-primary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent" />
        <div className="relative flex flex-col items-center justify-between gap-8 px-8 py-16 text-center md:flex-row md:px-16 md:text-left">
          <div className="max-w-2xl space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              {t("ctaBlock.title")}
            </h2>
            <p className="text-lg text-primary-foreground/80">
              {t("ctaBlock.description")}
            </p>
          </div>

          <LinkButton
            href="/sign-up"
            size="lg"
            className="h-14 shrink-0 rounded-full bg-background px-8 text-base font-semibold text-primary shadow-lg hover:bg-background/90"
          >
            {t("ctaBlock.button")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
