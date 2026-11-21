"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import DeleteServiceDialog from "@/components/vendor/DeleteServiceDialog";
import EditServiceDialog from "@/components/vendor/EditServiceDialog";
import {
  approvalStatus,
  normalizeServices,
  serviceId,
  serviceName,
  type VendorService,
} from "@/components/vendor/types";
import { formatPrice } from "@/components/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";

function StatusBadge({ service }: { service: VendorService }) {
  const status = approvalStatus(service);
  const style =
    status === "approved"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
      : status === "rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>{status}</span>;
}

function MyServices() {
  const [services, setServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  function load() {
    let active = true;
    apiFetch("/api/services/mine/list")
      .then((payload) => {
        if (active) setServices(normalizeServices(payload));
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
  }

  useEffect(load, []);

  async function toggle(service: VendorService) {
    const id = serviceId(service);
    setToggling(id);
    try {
      const next = !(service.isActive ?? true);
      const result = await apiFetch(`/api/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: next }),
      });
      toast.success(result?.message ?? `Service ${next ? "activated" : "deactivated"}.`);
      setServices((current) =>
        current.map((item) =>
          serviceId(item) === id ? { ...item, isActive: next } : item,
        ),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update service.");
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
            My Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your wedding service listings.</p>
        </div>
        <Link href="/dashboard/vendor/add-service" className={buttonVariants()}>
          <Plus />
          Add Service
        </Link>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-rose-500" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <p className="p-16 text-center text-sm text-muted-foreground">
            You haven&apos;t added any services yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const id = serviceId(service);
                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{serviceName(service)}</TableCell>
                    <TableCell>{service.category ?? "-"}</TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell><StatusBadge service={service} /></TableCell>
                    <TableCell>
                      <button
                        type="button"
                        disabled={toggling === id}
                        onClick={() => toggle(service)}
                        aria-label="Toggle availability"
                        className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
                          service.isActive !== false ? "bg-rose-500" : "bg-muted"
                        }`}
                      >
                        <span className={`absolute top-1 size-4 rounded-full bg-white transition-all ${service.isActive !== false ? "left-6" : "left-1"}`} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <EditServiceDialog service={service} onUpdated={load} />
                        <DeleteServiceDialog service={service} onDeleted={load} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default function VendorServicesPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <MyServices />
    </AuthGuard>
  );
}
