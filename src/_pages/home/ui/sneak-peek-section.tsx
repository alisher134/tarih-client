import { getTranslations } from "next-intl/server";

import { SectionHeader } from "./section-header";
import { SneakPeekSlider } from "./sneak-peek-slider";

export async function SneakPeekSection() {
  const t = await getTranslations("home");

  return (
    <section
      id="courses"
      className="mx-auto max-w-5xl space-y-12 px-4 md:px-6 hidden md:block"
    >
      <SectionHeader
        align="center"
        title={t("sneakPeek.title")}
        description={t("sneakPeek.description")}
      />

      <SneakPeekSlider />
    </section>
  );
}
