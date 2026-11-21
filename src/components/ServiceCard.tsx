"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { ArrowRight, Crown, MapPin, Sparkles, Store } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Service {
  id?: string;
  _id?: string;
  serviceName?: string;
  name?: string;
  category?: string;
  price?: number | string;
  location?: string;
  image?: string | null;
  images?: string[];
  vendor?:
    | string
    | null
    | {
        name?: string;
        businessName?: string;
        vendorName?: string;
        subscriptionPlan?: string;
      };
  vendorName?: string;
}

export function formatPrice(price?: Service["price"]) {
  if (price === undefined || price === null || price === "") return "Price on request";
  const numeric = typeof price === "number" ? price : Number(price);
  return Number.isFinite(numeric)
    ? `$${numeric.toLocaleString()}`
    : String(price);
}

export function vendorName(service: Service) {
  if (typeof service.vendor === "string") return service.vendor;
  return (
    service.vendor?.businessName ??
    service.vendor?.name ??
    service.vendor?.vendorName ??
    service.vendorName ??
    "Independent vendor"
  );
}

export default function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();
  const { data: session } = useSession();
  const id = service.id ?? service._id ?? "";
  const title = service.serviceName ?? service.name ?? "Wedding service";
  const image =
    service.images?.[0] ?? (typeof service.image === "string" ? service.image : "");
  const detailHref = `/services/${id}`;
  const isPremium =
    typeof service.vendor === "object" &&
    service.vendor?.subscriptionPlan?.toLowerCase() === "premium";

  function handleView(event: MouseEvent<HTMLAnchorElement>) {
    if (!session?.user) {
      event.preventDefault();
      router.push(`/sign-in?redirect=/services/${id}`);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60 dark:border-rose-900/40 dark:bg-card">
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-rose-100 via-white to-amber-100 dark:from-rose-950/50 dark:via-card dark:to-amber-950/40">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-300 dark:text-rose-700">
            <Sparkles className="size-10" />
          </div>
        )}
        {service.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-rose-700 hover:bg-white dark:bg-card/90 dark:text-rose-300">
            {service.category}
          </Badge>
        )}
        {isPremium && (
          <Badge className="absolute top-3 right-3 bg-amber-500 text-white">
            <Crown />
            Premium
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-rose-900 dark:text-rose-100">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
            {formatPrice(service.price)}
          </span>
          {service.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {service.location}
            </span>
          )}
        </div>

        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Store className="size-3.5" />
          {vendorName(service)}
        </p>

        <div className="mt-auto pt-2">
          <Button
            render={<Link href={detailHref} onClick={handleView} />}
            variant="outline"
            className="h-9 w-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
          >
            View Details
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  );
}
