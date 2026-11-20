import type { ReactNode } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-12 dark:from-rose-950/40 dark:via-background dark:to-amber-950/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-500/10"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-2xl font-semibold tracking-tight text-rose-700 dark:text-rose-300"
          >
            <Heart className="size-6 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" />
            WedPlan
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Every love story deserves a beautiful beginning.
          </p>
        </div>

        {children}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Crafted with care for your perfect day.
        </p>
      </div>
    </main>
  );
}
