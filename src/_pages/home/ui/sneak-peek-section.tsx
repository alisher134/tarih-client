import { getTranslations } from "next-intl/server";

import { SectionHeader } from "./section-header";
import { SneakPeekSlider } from "./sneak-peek-slider";

export async function SneakPeekSection() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-5xl space-y-12 px-4 md:px-6">
      <SectionHeader
        align="center"
        title={t("sneakPeek.title")}
        description={t("sneakPeek.description")}
      />

      <SneakPeekSlider />
    </section>
  );
}
