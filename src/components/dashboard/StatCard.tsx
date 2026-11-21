import type { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm dark:border-rose-900/40 dark:bg-card">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-rose-900 dark:text-rose-100">
          {value}
        </p>
      </div>
    </div>
  );
}
