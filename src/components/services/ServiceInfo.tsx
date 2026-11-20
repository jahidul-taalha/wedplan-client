import Image from "next/image";
import { Crown, MapPin, Store, Tag } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import { formatPrice } from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import type { ServiceDetail, Vendor } from "./types";

export default function ServiceInfo({
  service,
  title,
  vendor,
  vendorLabel,
  vendorId,
  userId,
  role,
}: {
  service: ServiceDetail;
  title: string;
  vendor: Vendor | null;
  vendorLabel: string;
  vendorId?: string;
  userId?: string;
  role: string;
}) {
  const isOwnService = Boolean(userId && vendorId && userId === vendorId);
  const canBook = role !== "vendor" && role !== "admin";
  const isPremium = vendor?.subscriptionPlan?.toLowerCase() === "premium";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Badge variant="secondary" className="mb-3">
          <Tag />
          {service.category ?? "Wedding Service"}
        </Badge>
        <h1 className="font-heading text-3xl font-semibold text-rose-900 dark:text-rose-100">
          {title}
        </h1>
      </div>

      <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
        {formatPrice(service.price)}
      </p>

      {service.location && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-rose-500" />
          {service.location}
        </p>
      )}

      <div className="rounded-xl border border-rose-100 bg-white p-5 dark:border-rose-900/40 dark:bg-card">
        <h2 className="mb-2 text-sm font-semibold text-rose-900 dark:text-rose-100">
          About this service
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {service.description ?? "No description has been provided yet."}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white p-4 dark:border-rose-900/40 dark:bg-card">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
          {vendor?.image ? (
            <Image
              src={vendor.image}
              alt={vendorLabel}
              width={48}
              height={48}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <Store className="size-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
            {vendorLabel}
          </p>
          {vendor?.businessName && (
            <p className="truncate text-xs text-muted-foreground">
              {vendor.businessName}
            </p>
          )}
        </div>
        {isPremium && (
          <Badge className="ml-auto bg-amber-500 text-white">
            <Crown />
            Premium
          </Badge>
        )}
      </div>

      {isOwnService ? (
        <p className="rounded-xl bg-rose-100/70 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          This is your service.
        </p>
      ) : canBook ? (
        <BookingForm serviceId={service.id ?? service._id ?? ""} />
      ) : (
        <p className="rounded-xl bg-rose-100/70 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          Vendors and admins cannot book services
        </p>
      )}
    </div>
  );
}
