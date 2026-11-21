"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { normalizeList, type Transaction } from "@/components/admin/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";

function vendorName(item: Transaction) {
  if (typeof item.vendor === "string") return item.vendor;
  return item.vendor?.name ?? item.vendorName ?? "Unknown vendor";
}

function vendorEmail(item: Transaction) {
  if (typeof item.vendor === "string") return item.vendorEmail ?? "-";
  return item.vendor?.email ?? item.vendorEmail ?? "-";
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch("/api/admin/transactions")
      .then((payload) => {
        if (active) setTransactions(normalizeList<Transaction>(payload));
      })
      .catch(() => {
        if (active) setTransactions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
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
            Transactions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A read-only record of subscription payments.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-rose-500" /> Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <p className="p-16 text-center text-sm text-muted-foreground">
              No transactions have been recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((item, index) => (
                  <TableRow key={item.id ?? item._id ?? index}>
                    <TableCell className="font-medium">{vendorName(item)}</TableCell>
                    <TableCell>{vendorEmail(item)}</TableCell>
                    <TableCell className="capitalize">{item.plan ?? item.subscriptionPlan ?? "-"}</TableCell>
                    <TableCell className="font-medium">
                      {item.currency ?? "USD"} {item.amount ?? 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(item.status ?? "").toLowerCase() === "completed" ? "secondary" : "outline"} className="capitalize">
                        {item.status ?? "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.createdAt || item.date
                        ? new Date(item.createdAt ?? item.date ?? "").toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
