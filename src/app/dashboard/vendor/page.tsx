"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck2,
  Clock3,
  Crown,
  ListChecks,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import StatCard from "@/components/dashboard/StatCard";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { normalizeServices, type VendorService } from "@/components/vendor/types";

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card"
        />
      ))}
    </div>
  );
}

function VendorOverview() {
  const { data: session } = useSession();
  const [services, setServices] = useState<VendorService[]>([]);
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiFetch("/api/services/mine/list"),
      apiFetch("/api/bookings/stats"),
    ])
      .then(([servicesPayload, statsPayload]) => {
        if (!active) return;
        setServices(normalizeServices(servicesPayload));
        const data = (statsPayload?.stats ?? statsPayload?.data ?? statsPayload ?? {}) as Record<string, unknown>;
        setStats(data);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Vendor Overview
        </h1>
        <StatsSkeleton />
      </div>
    );
  }

  const activeCount = services.filter((service) => service.isActive !== false).length;
  const pending = Number(stats.pending ?? stats.pendingCount ?? stats.pendingBookings ?? 0);
  const accepted = Number(stats.accepted ?? stats.acceptedCount ?? stats.acceptedBookings ?? 0);
  const plan = session?.user?.subscriptionPlan || "Free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "Vendor"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your wedding business.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Services" value={services.length} icon={ListChecks} />
        <StatCard title="Active Services" value={activeCount} icon={BadgeCheck} />
        <StatCard title="Pending Booking Requests" value={pending} icon={Clock3} />
        <StatCard title="Accepted Bookings" value={accepted} icon={CalendarCheck2} />
        <StatCard title="Current Subscription Plan" value={plan} icon={Crown} />
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <VendorOverview />
    </AuthGuard>
  );
}
