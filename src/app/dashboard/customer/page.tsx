"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import StatCard from "@/components/dashboard/StatCard";
import { apiFetch } from "@/lib/api";

function count(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function CustomerOverview() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch("/api/bookings/stats")
      .then((payload) => {
        if (active) {
          setStats((payload?.stats ?? payload?.data ?? payload ?? {}) as Record<string, unknown>);
        }
      })
      .catch(() => {
        if (active) setStats({});
      });
    return () => {
      active = false;
    };
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card" />
        ))}
      </div>
    );
  }

  if (Object.keys(stats).length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-16 text-center text-sm text-muted-foreground dark:border-rose-900/50 dark:bg-card/50">
        No booking statistics are available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Booking Requests" value={count(stats.total ?? stats.totalBookings)} icon={CalendarCheck2} />
      <StatCard title="Pending" value={count(stats.pending)} icon={Clock3} />
      <StatCard title="Accepted" value={count(stats.accepted)} icon={CheckCircle2} />
      <StatCard title="Rejected" value={count(stats.rejected)} icon={XCircle} />
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
            My Wedding Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of every booking request in one place.
          </p>
        </div>
        <CustomerOverview />
      </div>
    </AuthGuard>
  );
}
