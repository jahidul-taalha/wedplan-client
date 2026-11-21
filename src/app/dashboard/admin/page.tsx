"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck2,
  Clock3,
  Store,
  Users,
  UserRound,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import StatCard from "@/components/dashboard/StatCard";
import { apiFetch } from "@/lib/api";

type Stats = Record<string, unknown>;

function pick(stats: Stats, ...keys: string[]) {
  for (const key of keys) {
    if (stats[key] !== undefined && stats[key] !== null) return Number(stats[key]);
  }
  return 0;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch("/api/admin/stats")
      .then((payload) => {
        if (active) setStats((payload?.stats ?? payload?.data ?? payload ?? {}) as Stats);
      })
      .catch(() => {
        if (active) setStats({});
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A snapshot of everything happening on WedPlan.
          </p>
        </div>

        {!stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card" />
            ))}
          </div>
        ) : Object.keys(stats).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-16 text-center text-sm text-muted-foreground dark:border-rose-900/50 dark:bg-card/50">
            No statistics are available yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Registered Users" value={pick(stats, "totalUsers", "users", "userCount")} icon={Users} />
            <StatCard title="Total Vendors" value={pick(stats, "totalVendors", "vendors", "vendorCount")} icon={Store} />
            <StatCard title="Total Customers" value={pick(stats, "totalCustomers", "customers", "customerCount")} icon={UserRound} />
            <StatCard title="Total Services" value={pick(stats, "totalServices", "services", "serviceCount")} icon={BadgeCheck} />
            <StatCard title="Pending Services" value={pick(stats, "pendingServices", "pending", "servicesPending")} icon={Clock3} />
            <StatCard title="Total Transactions" value={pick(stats, "totalTransactions", "transactions", "transactionCount")} icon={CalendarCheck2} />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
