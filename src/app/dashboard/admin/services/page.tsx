"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";
import ServiceActions from "@/components/admin/ServiceActions";
import { serviceStatus, vendorLabel, type AdminService } from "@/components/admin/types";
import { CATEGORIES } from "@/components/vendor/types";
import { formatPrice } from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const appliedSearch = useRef("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (appliedSearch.current === searchText) return;
      appliedSearch.current = searchText;
      setSearch(searchText);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (search?.trim()) params.set("search", search.trim());
    if (status && status !== "all") params.set("status", status);
    if (category && category !== "all") params.set("category", category);
    const query = params.toString();
    apiFetch(`/api/services/admin/all${query ? `?${query}` : ""}`)
      .then((payload) => {
        if (!active) return;
        const data = payload as Record<string, unknown> | null;
        const list = Array.isArray(payload)
          ? payload
          : (data?.services ?? data?.data ?? []);
        setServices(Array.isArray(list) ? (list as AdminService[]) : []);
      })
      .catch((error: unknown) => {
        console.error("Failed to load admin services:", error);
        if (active) {
          setServices([]);
          toast.error(
            error instanceof Error ? error.message : "Failed to load services.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [search, status, category, refresh]);

  function reload() {
    setLoading(true);
    setRefresh((value) => value + 1);
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-rose-900 dark:text-rose-100">
          Manage Services
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search services..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(value) => setCategory(value ?? "all")}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white dark:border-rose-900/40 dark:bg-card">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-rose-500" /> Loading services...
            </div>
          ) : services.length === 0 ? (
            <p className="p-16 text-center text-sm text-muted-foreground">No services found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => {
                  const statusValue = serviceStatus(service);
                  return (
                    <TableRow key={service.id ?? service._id ?? index}>
                      <TableCell>
                        <div className="size-12 overflow-hidden rounded-lg bg-rose-100 dark:bg-rose-950/40">
                          {(service.images?.[0] ?? service.image) && (
                            <Image
                              src={(service.images?.[0] ?? service.image) as string}
                              alt=""
                              width={48}
                              height={48}
                              unoptimized
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{service.serviceName ?? service.name ?? "-"}</TableCell>
                      <TableCell>{vendorLabel(service)}</TableCell>
                      <TableCell>{service.category ?? "-"}</TableCell>
                      <TableCell>{formatPrice(service.price)}</TableCell>
                      <TableCell>
                        <Badge variant={statusValue === "approved" ? "secondary" : statusValue === "rejected" ? "destructive" : "outline"} className="capitalize">
                          {statusValue}
                        </Badge>
                      </TableCell>
                      <TableCell><ServiceActions service={service} onChanged={reload} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
