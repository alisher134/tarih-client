import { getTranslations } from "next-intl/server";

import { FaqAccordion } from "./faq-accordion";
import { SectionHeader } from "./section-header";

const faqItems = [
  "access",
  "duration",
  "renewal",
  "payment",
  "afterExpiry",
] as const;

export async function FaqSection() {
  const t = await getTranslations("home");

  const items = faqItems.map((id) => ({
    id,
    question: t(`faq.${id}.question`),
    answer: t(`faq.${id}.answer`),
  }));

  return (
    <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-8">
        <SectionHeader
          align="left"
          label={t("faq.label")}
          title={t("faq.title")}
          description={t("faq.description")}
        />
      </div>

      <FaqAccordion items={items} />
    </section>
  );
}
