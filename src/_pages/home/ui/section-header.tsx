import { cn } from "cn";

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "mx-auto max-w-md text-center",
        align === "left" && "max-w-lg",
      )}
    >
      {label ? (
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          {label}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-medium tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
