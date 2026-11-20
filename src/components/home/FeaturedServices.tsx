"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import ServiceCard, { type Service } from "@/components/ServiceCard";
import { buttonVariants } from "@/components/ui/button";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white/70 dark:border-rose-900/40 dark:bg-card/60">
      <div className="h-48 animate-pulse bg-linear-to-br from-rose-100 to-amber-100 dark:from-rose-950/50 dark:to-amber-950/40" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-rose-100 dark:bg-rose-950/60" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-rose-100 dark:bg-rose-950/60" />
      </div>
    </div>
  );
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/services?limit=6`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Failed to load services");
        const payload = await response.json();
        const list = Array.isArray(payload)
          ? payload
          : (payload.services ?? payload.data ?? []);
        setServices(Array.isArray(list) ? (list as Service[]) : []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setServices([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white px-6 py-20 dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
              Handpicked for you
            </p>
            <h2 className="font-heading text-3xl font-semibold text-rose-900 sm:text-4xl dark:text-rose-100">
              Featured Wedding Services
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A small selection of the talented vendors ready to make your day
              unforgettable.
            </p>
          </div>
          <Link
            href="/services"
            className={`${buttonVariants({ variant: "outline" })} border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300`}
          >
            View all services
            <ArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 px-6 py-20 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
            <SearchX className="size-10 text-rose-300 dark:text-rose-700" />
            <h3 className="mt-4 text-lg font-medium text-rose-900 dark:text-rose-100">
              No services available yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Check back soon as our community of wedding vendors grows.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id ?? service._id ?? index}
                service={service}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
