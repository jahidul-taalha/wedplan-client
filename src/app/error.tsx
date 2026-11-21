"use client";

import { useEffect } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-20 dark:from-rose-950/40 dark:via-background dark:to-amber-950/30">
      <div className="max-w-md rounded-2xl border border-rose-100 bg-white/90 p-10 text-center shadow-lg dark:border-rose-900/40 dark:bg-card">
        <Heart className="mx-auto size-12 fill-rose-300 text-rose-400 dark:fill-rose-900/60" />
        <h1 className="mt-6 font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn&apos;t load this page. Please try again — your celebration is
          still waiting.
        </p>
        <Button onClick={reset} className="mt-8">
          <RotateCcw />
          Try again
        </Button>
      </div>
    </main>
  );
}
