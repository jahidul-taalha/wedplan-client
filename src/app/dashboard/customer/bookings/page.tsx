"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CalendarDays, MapPin } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";

type Booking = {
  _id?: string;
  id?: string;
  serviceName?: string;
  images?: string[];
  vendor?: { name?: string; email?: string; image?: string | null; businessName?: string } | null;
  eventDate?: string;
  eventLocation?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

function normalize(payload: unknown): Booking[] {
  const data = payload as Record<string, unknown> | null;
  const list = data?.bookings ?? data?.data ?? [];
  return Array.isArray(list) ? (list as Booking[]) : [];
}

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    let active = true;
    apiFetch("/api/bookings/my")
      .then((payload) => {
        if (active) setBookings(normalize(payload));
      })
      .catch((error: unknown) => {
        console.error("Failed to load bookings:", error);
        if (active) {
          setBookings([]);
          toast.error(error instanceof Error ? error.message : "Failed to load bookings.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(load, []);

  async function cancel(id: string) {
    try {
      const result = await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success(result?.message ?? "Booking cancelled.");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking.");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">My Bookings</h1>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2].map((index) => <div key={index} className="h-48 animate-pulse rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-16 text-center text-sm text-muted-foreground dark:border-rose-900/50 dark:bg-card/50">You have not sent any booking requests yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking, index) => {
            const id = String(booking._id ?? booking.id ?? "");
            const status = booking.status ?? "pending";
            return (
              <div key={id || index} className="flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm dark:border-rose-900/40 dark:bg-card">
                <div className="flex items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-rose-100 dark:bg-rose-950/40">
                    {booking.images?.[0] && (
                      <Image src={booking.images[0]} alt="" fill unoptimized className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-rose-900 dark:text-rose-100">{booking.serviceName ?? "Wedding service"}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">{booking.vendor?.businessName ?? booking.vendor?.name ?? "Vendor"} · {booking.vendor?.email ?? ""}</span>
                    </div>
                  </div>
                  <Badge className="ml-auto shrink-0 capitalize">{status}</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><CalendarDays className="size-4 text-rose-500" />{booking.eventDate ?? "-"}</p>
                  <p className="flex items-center gap-2"><MapPin className="size-4 text-rose-500" />{booking.eventLocation ?? "-"}</p>
                  <p className="text-xs">Requested {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-"}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" size="sm" />}>View Details</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{booking.serviceName ?? "Booking details"}</DialogTitle>
                        <DialogDescription>Your request and message.</DialogDescription>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground">{booking.message || "No additional message was provided."}</p>
                    </DialogContent>
                  </Dialog>
                  {status === "pending" && (
                    <ConfirmDialog
                      trigger={<Button variant="ghost" size="sm">Cancel</Button>}
                      title="Cancel this booking?"
                      description="This request will be cancelled and cannot be restored."
                      confirmLabel="Cancel booking"
                      destructive
                      onConfirm={() => cancel(id)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CustomerBookingsPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <MyBookings />
    </AuthGuard>
  );
}
