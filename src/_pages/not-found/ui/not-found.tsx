import { getTranslations } from "next-intl/server";

import { NotFoundView } from "./not-found-view";

export async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <NotFoundView
      title={t("notFound.title")}
      description={t("notFound.description")}
      homeLabel={t("home")}
    />
  );
}
