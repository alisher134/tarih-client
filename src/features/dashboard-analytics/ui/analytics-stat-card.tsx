import type { LucideIcon } from "lucide-react";

type AnalyticsStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
};

export function AnalyticsStatCard({
  icon: Icon,
  label,
  value,
  detail,
}: AnalyticsStatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        <p className="text-sm">{label}</p>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {detail != null ? (
        <p className="text-sm text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}
