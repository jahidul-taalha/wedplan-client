"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";

type VendorBooking = {
  _id?: string;
  id?: string;
  customer?: { name?: string; email?: string; image?: string | null } | null;
  serviceName?: string;
  eventDate?: string;
  eventLocation?: string;
  message?: string;
  status?: string;
};

function normalize(payload: unknown): VendorBooking[] {
  const data = payload as Record<string, unknown> | null;
  const list = data?.bookings ?? data?.data ?? [];
  return Array.isArray(list) ? (list as VendorBooking[]) : [];
}

function BookingsContent() {
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    let active = true;
    apiFetch("/api/bookings/vendor")
      .then((payload) => {
        if (active) setBookings(normalize(payload));
      })
      .catch((error: unknown) => {
        console.error("Failed to load bookings:", error);
        if (active) {
          setBookings([]);
          toast.error(
            error instanceof Error ? error.message : "Failed to load bookings.",
          );
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

  async function update(id: string, status: "accepted" | "rejected") {
    setBusy(id);
    try {
      const result = await apiFetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(result?.message ?? `Booking ${status}.`);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update booking.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Booking Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and respond to requests from couples.
        </p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-sm text-muted-foreground">
            Loading booking requests...
          </div>
        ) : bookings.length === 0 ? (
          <p className="p-16 text-center text-sm text-muted-foreground">
            No booking requests yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => {
                const id = String(booking._id ?? booking.id ?? "");
                const status = booking.status ?? "pending";
                return (
                  <TableRow key={id || index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          {booking.customer?.image && (
                            <AvatarImage src={booking.customer.image} alt="" />
                          )}
                          <AvatarFallback>
                            {(booking.customer?.name ?? "C").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.customer?.name ?? "-"}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.customer?.email ?? "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.serviceName ?? "-"}</TableCell>
                    <TableCell>
                      <p>{booking.eventDate ?? "-"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.eventLocation ?? "-"}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-52 whitespace-normal">
                      {booking.message ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">{status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {status === "pending" && (
                          <>
                            <ConfirmDialog
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label="Accept booking" disabled={busy === id}>
                                  <Check />
                                </Button>
                              }
                              title="Accept this booking?"
                              description="The customer will be notified of your decision."
                              confirmLabel="Accept"
                              onConfirm={() => update(id, "accepted")}
                            />
                            <ConfirmDialog
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label="Reject booking" disabled={busy === id}>
                                  <X />
                                </Button>
                              }
                              title="Reject this booking?"
                              description="The customer will be notified of your decision."
                              confirmLabel="Reject"
                              destructive
                              onConfirm={() => update(id, "rejected")}
                            />
                          </>
                        )}
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

export default function VendorBookingsPage() {
  return (
    <AuthGuard allowedRoles={["vendor"]}>
      <BookingsContent />
    </AuthGuard>
  );
}
