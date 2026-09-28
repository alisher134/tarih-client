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
    <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {detail != null ? (
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
