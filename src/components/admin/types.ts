export type AdminUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
  status?: string;
  image?: string | null;
  businessName?: string;
  subscriptionPlan?: string;
  createdAt?: string;
};

export type AdminService = {
  id?: string;
  _id?: string;
  serviceName?: string;
  name?: string;
  category?: string;
  price?: number | string;
  location?: string;
  image?: string | null;
  images?: string[];
  status?: string;
  approvalStatus?: string;
  vendor?: string | { name?: string; email?: string; businessName?: string } | null;
  vendorName?: string;
};

export type Transaction = {
  id?: string;
  _id?: string;
  plan?: string;
  subscriptionPlan?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  createdAt?: string;
  date?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendor?: string | { name?: string; email?: string } | null;
};

export function normalizeList<T>(payload: unknown): T[] {
  const data = payload as Record<string, unknown> | null;
  const list = Array.isArray(payload)
    ? payload
    : (data?.items ?? data?.users ?? data?.services ?? data?.transactions ?? data?.data ?? []);
  return Array.isArray(list) ? (list as T[]) : [];
}

export function getId(item: { id?: string; _id?: string }) {
  return item.id ?? item._id ?? "";
}

export function extractTotal(payload: unknown) {
  const data = (payload ?? {}) as Record<string, unknown>;
  const meta = (data.meta ?? {}) as Record<string, unknown>;
  const pagination = (data.pagination ?? {}) as Record<string, unknown>;
  return Number(data.total ?? meta.total ?? pagination.total ?? 0);
}

export function isBlocked(user: AdminUser) {
  return Boolean(user.isBlocked ?? user.status === "blocked");
}

export function serviceStatus(service: AdminService) {
  return (service.status ?? service.approvalStatus ?? "pending").toLowerCase();
}

export function vendorLabel(service: AdminService) {
  if (typeof service.vendor === "string") return service.vendor;
  return (
    service.vendor?.businessName ??
    service.vendor?.name ??
    service.vendorName ??
    "Unknown vendor"
  );
}
