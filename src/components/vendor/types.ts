export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export type ServiceFormValues = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  location: string;
};

export type VendorService = {
  id?: string;
  _id?: string;
  serviceName?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number | string;
  location?: string;
  images?: string[];
  image?: string | null;
  isActive?: boolean;
  approvalStatus?: string;
  status?: string;
};

export function normalizeServices(payload: unknown): VendorService[] {
  const data = payload as Record<string, unknown> | null;
  const list = Array.isArray(payload)
    ? payload
    : (data?.services ?? data?.data ?? []);
  return Array.isArray(list) ? (list as VendorService[]) : [];
}

export function serviceId(service: VendorService) {
  return service.id ?? service._id ?? "";
}

export function serviceName(service: VendorService) {
  return service.serviceName ?? service.name ?? "Untitled service";
}

export function approvalStatus(service: VendorService) {
  return (service.approvalStatus ?? service.status ?? "pending").toLowerCase();
}
