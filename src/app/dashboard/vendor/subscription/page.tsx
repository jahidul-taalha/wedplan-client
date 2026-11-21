"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["Max 3 active services", "Basic Vendor Dashboard", "Booking Request Management"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "Upgrade",
    features: ["Unlimited active services", "Premium Vendor Badge", "All Free features"],
  },
];

function SubscriptionContent() {
  const { data: session, refetch } = useSession();
  const [loading, setLoading] = useState(false);
  const current = (session?.user?.subscriptionPlan ?? "free").toLowerCase();

  async function upgrade() {
    setLoading(true);
    try {
      const response = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
      });
      if (!response?.url) throw new Error("No checkout URL was returned.");
      window.location.href = response.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
            Subscription
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the plan that fits your wedding business.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          Current plan: {current}
        </Badge>
      </div>

      {!session ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent = current === plan.id;
            return (
              <Card
                key={plan.id}
                className={
                  isCurrent
                    ? "border-rose-400 ring-2 ring-rose-200 dark:ring-rose-900/50"
                    : "border-rose-100 dark:border-rose-900/40"
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-rose-900 dark:text-rose-100">
                      {plan.name}
                    </CardTitle>
                    {isCurrent && <Badge>Current plan</Badge>}
                  </div>
                  <CardDescription>{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="size-4 text-rose-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.id === "premium" && current !== "premium" && (
                    <Button onClick={upgrade} disabled={loading} className="w-full">
                      {loading ? <Loader2 className="animate-spin" /> : <Crown />}
                      {loading ? "Opening checkout..." : "Upgrade to Premium"}
                    </Button>
                  )}
                  {plan.id === "premium" && current === "premium" && (
                    <p className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                      <Sparkles className="size-4" />
                      You are enjoying all Premium features.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <Button variant="ghost" onClick={() => refetch()}>
        Refresh plan status
      </Button>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <SubscriptionContent />
    </AuthGuard>
  );
}
