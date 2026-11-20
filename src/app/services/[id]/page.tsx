"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceInfo from "@/components/services/ServiceInfo";
import { DetailSkeleton, ErrorCard } from "@/components/services/ServiceStates";
import type { ServiceDetail, Vendor } from "@/components/services/types";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

function ServiceDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: session } = useSession();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const invalidId = !id || !/^[a-zA-Z0-9_-]+$/.test(id);

  useEffect(() => {
    if (invalidId) return;
    let active = true;
    apiFetch(`/api/services/${id}`)
      .then((payload) => {
        if (active) {
          setService((payload?.service ?? payload?.data ?? payload) as ServiceDetail);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Please try again later.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, invalidId]);

  if (invalidId) {
    return <ErrorCard message="This service link is invalid or incomplete." />;
  }
  if (loading) return <DetailSkeleton />;
  if (error || !service) {
    return <ErrorCard message={error ?? "This service is no longer available."} />;
  }

  const title = service.serviceName ?? service.name ?? "Wedding service";
  const vendor: Vendor | null =
    typeof service.vendor === "object" && service.vendor ? service.vendor : null;
  const vendorLabel =
    vendor?.businessName ??
    vendor?.name ??
    (typeof service.vendor === "string" ? service.vendor : "Independent vendor");

  return (
    <main className="min-h-screen bg-rose-50/40 px-4 py-10 dark:bg-background sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-rose-700 hover:underline dark:text-rose-300"
        >
          <ArrowLeft className="size-4" />
          Back to services
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <ServiceGallery service={service} title={title} />
          <ServiceInfo
            service={service}
            title={title}
            vendor={vendor}
            vendorLabel={vendorLabel}
            vendorId={vendor?.id ?? vendor?._id ?? service.vendorId}
            userId={session?.user?.id}
            role={session?.user?.role ?? "customer"}
          />
        </div>
      </div>
    </main>
  );
}

export default function ServiceDetailPage() {
  return (
    <AuthGuard>
      <ServiceDetailContent />
    </AuthGuard>
  );
}
