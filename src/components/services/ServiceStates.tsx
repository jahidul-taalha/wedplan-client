import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function DetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="h-96 animate-pulse rounded-2xl bg-rose-100 dark:bg-rose-950/50" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/50" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/50" />
        <div className="h-24 animate-pulse rounded bg-rose-100 dark:bg-rose-950/50" />
        <div className="h-11 w-full animate-pulse rounded-lg bg-rose-100 dark:bg-rose-950/50" />
      </div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50/40 px-4 dark:bg-background">
      <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg dark:border-rose-900/50 dark:bg-card">
        <Sparkles className="mx-auto size-10 text-rose-400" />
        <h1 className="mt-4 text-xl font-semibold text-rose-900 dark:text-rose-100">
          We couldn&apos;t find this service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Link href="/services" className={`${buttonVariants()} mt-6`}>
          <ArrowLeft />
          Back to Services
        </Link>
      </div>
    </main>
  );
}
