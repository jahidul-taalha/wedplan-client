"use client";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { buttonVariants } from "@/components/ui/button";

function CancelContent() {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-card">
      <Heart className="mx-auto size-12 fill-rose-200 text-rose-400 dark:fill-rose-900/50" />
      <h1 className="mt-4 font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
        Checkout cancelled
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        No changes were made to your plan. You can keep using your current plan
        and try again whenever you are ready.
      </p>
      <Link
        href="/dashboard/vendor/subscription"
        className={`${buttonVariants()} mt-8`}
      >
        <ArrowLeft />
        Back to Subscription
      </Link>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <CancelContent />
    </AuthGuard>
  );
}
