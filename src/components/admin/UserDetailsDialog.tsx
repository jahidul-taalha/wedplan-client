"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getId, isBlocked, type AdminUser } from "./types";

export default function UserDetailsDialog({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) return;
    setLoading(true);
    setDetails(null);
    apiFetch(`/api/admin/users/${getId(user)}`)
      .then((payload) => {
        setDetails((payload?.user ?? payload?.data ?? payload) as AdminUser);
      })
      .catch(() => setDetails(null))
      .finally(() => setLoading(false));
  }

  const record = details ?? user;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>View</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>Full information about this account.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-rose-500" />
            Loading details...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                {record.image ? (
                  <Image src={record.image} alt={record.name ?? "User"} width={48} height={48} unoptimized className="size-full object-cover" />
                ) : (
                  (record.name ?? "?").charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-rose-900 dark:text-rose-100">
                  {record.name ?? "Unnamed user"}
                </p>
                <p className="text-sm text-muted-foreground">{record.email ?? "-"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Role" value={record.role ?? "customer"} />
              <Detail label="Status" value={isBlocked(record) ? "Blocked" : "Active"} />
              <Detail label="Business" value={record.businessName ?? "-"} />
              <Detail label="Plan" value={record.subscriptionPlan ?? "Free"} />
              <Detail label="Joined" value={record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"} />
            </div>
            <Badge variant={isBlocked(record) ? "destructive" : "secondary"}>
              {isBlocked(record) ? "Blocked" : "Active"}
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
