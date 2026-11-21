"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import UserDetailsDialog from "@/components/admin/UserDetailsDialog";
import { extractTotal, getId, isBlocked, normalizeList, type AdminUser } from "@/components/admin/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";

const LIMIT = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const appliedSearch = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (appliedSearch.current === searchText) return;
      appliedSearch.current = searchText;
      setSearch(searchText);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    if (role !== "all") params.set("role", role);
    apiFetch(`/api/admin/users?${params}`)
      .then((payload) => {
        if (!active) return;
        setUsers(normalizeList<AdminUser>(payload));
        setTotal(extractTotal(payload));
      })
      .catch(() => {
        if (active) setUsers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [search, role, page]);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    if (role !== "all") params.set("role", role);
    apiFetch(`/api/admin/users?${params}`)
      .then((payload) => {
        setUsers(normalizeList<AdminUser>(payload));
        setTotal(extractTotal(payload));
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  async function toggleBlock(user: AdminUser) {
    try {
      const result = await apiFetch(`/api/admin/users/${getId(user)}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !isBlocked(user) }),
      });
      toast.success(result?.message ?? "User status updated.");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Manage Users
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or email..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <Select value={role} onValueChange={(value) => { setRole(value ?? "all"); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-rose-500" /> Loading users...
            </div>
          ) : users.length === 0 ? (
            <p className="p-16 text-center text-sm text-muted-foreground">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={getId(user)}>
                    <TableCell className="font-medium">{user.name ?? "-"}</TableCell>
                    <TableCell>{user.email ?? "-"}</TableCell>
                    <TableCell className="capitalize">{user.role ?? "customer"}</TableCell>
                    <TableCell>
                      <Badge variant={isBlocked(user) ? "destructive" : "secondary"}>
                        {isBlocked(user) ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <UserDetailsDialog user={user} />
                        {user.role !== "admin" && (
                          <ConfirmDialog
                            trigger={<Button variant="ghost" size="sm">{isBlocked(user) ? "Unblock" : "Block"}</Button>}
                            title={isBlocked(user) ? "Unblock this user?" : "Block this user?"}
                            description={`This will ${isBlocked(user) ? "restore" : "revoke"} ${user.name ?? "this user"}'s access to WedPlan.`}
                            confirmLabel={isBlocked(user) ? "Unblock" : "Block"}
                            destructive={!isBlocked(user)}
                            onConfirm={() => toggleBlock(user)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      </div>
    </AuthGuard>
  );
}
