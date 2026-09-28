import { ErrorPageElement } from "@/shared/ui/error-page-element";

type NotFoundViewProps = {
  title: string;
  description: string;
  homeLabel: string;
};

export function NotFoundView({
  title,
  description,
  homeLabel,
}: NotFoundViewProps) {
  return (
    <ErrorPageElement
      className="min-h-dvh"
      title={title}
      description={description}
      homeLabel={homeLabel}
      homeHref="/"
    />
  );
}
