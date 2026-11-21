import Link from "next/link";
import { Heart, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-20 dark:from-rose-950/40 dark:via-background dark:to-amber-950/30">
      <div className="max-w-md rounded-2xl border border-rose-100 bg-white/90 p-10 text-center shadow-lg dark:border-rose-900/40 dark:bg-card">
        <Heart className="mx-auto size-12 fill-rose-300 text-rose-400 dark:fill-rose-900/60" />
        <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
          404
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          We couldn&apos;t find this page
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for may have moved or no longer exists. Let&apos;s
          get you back to planning your big day.
        </p>
        <Link href="/" className={`${buttonVariants()} mt-8`}>
          <Home />
          Back Home
        </Link>
      </div>
    </main>
  );
}
