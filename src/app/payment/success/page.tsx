"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data: session, refetch } = useSession();
  const [status, setStatus] = useState<"loading" | "paid" | "unpaid" | "error">(
    "loading",
  );
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    apiFetch(`/api/payments/session/${sessionId}`)
      .then((result) => {
        if (active) {
          setStatus(result?.paymentStatus === "paid" ? "paid" : "unpaid");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (status !== "paid") return;
    if (session?.user?.subscriptionPlan === "premium" || attempts >= 5) return;
    let active = true;
    const timer = setTimeout(() => {
      refetch()
        .then(() => {
          if (active) setAttempts((value) => value + 1);
        })
        .catch(() => {
          if (active) setAttempts((value) => value + 1);
        });
    }, 2000);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [status, session?.user?.subscriptionPlan, attempts, refetch]);

  if (!sessionId) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center dark:border-rose-900/40 dark:bg-card">
        <XCircle className="mx-auto size-10 text-rose-400" />
        <h1 className="mt-4 text-xl font-semibold text-rose-900 dark:text-rose-100">
          Missing session
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not find a payment session to verify.
        </p>
        <Link href="/dashboard/vendor/subscription" className={`${buttonVariants()} mt-6`}>
          Back to Subscription
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-white p-12 dark:border-rose-900/40 dark:bg-card">
        <Loader2 className="size-8 animate-spin text-rose-500" />
        <p className="text-sm text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  const isPremium = session?.user?.subscriptionPlan === "premium";

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm dark:border-rose-900/40 dark:bg-card">
      {status === "paid" ? (
        <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
      ) : (
        <XCircle className="mx-auto size-12 text-amber-500" />
      )}
      <h1 className="mt-4 font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
        {status === "paid" ? "Payment received!" : "Payment not confirmed"}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        {status === "paid"
          ? isPremium
            ? "Your Premium plan is active. Enjoy unlimited services and your Premium badge."
            : "Your payment has been verified by Stripe. Your Premium plan is being activated — this can take a few moments."
          : "We could not confirm a completed payment for this session."}
      </p>
      {status === "paid" && !isPremium && (
        <p className="mt-4 text-xs text-muted-foreground">
          Checking your plan... ({attempts}/5)
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/vendor" className={buttonVariants()}>
          Go to Dashboard
        </Link>
        <Button variant="outline" render={<Link href="/dashboard/vendor/subscription" />}>
          Subscription
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-rose-100 dark:bg-rose-950/40" />}>
        <SuccessContent />
      </Suspense>
    </AuthGuard>
  );
}
