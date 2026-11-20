export default function SkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-rose-100 bg-white/70 dark:border-rose-900/40 dark:bg-card/60"
        >
          <div className="h-48 animate-pulse bg-linear-to-br from-rose-100 to-amber-100 dark:from-rose-950/50 dark:to-amber-950/40" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-rose-100 dark:bg-rose-950/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
