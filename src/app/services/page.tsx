"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import ServiceCard, { type Service } from "@/components/ServiceCard";
import ServiceFilters, { type Filters } from "@/components/services/ServiceFilters";
import SkeletonGrid from "@/components/services/SkeletonGrid";
import { Button } from "@/components/ui/button";

const LIMIT = 9;

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    location: searchParams.get("location") ?? "",
    sort: searchParams.get("sort") ?? "",
    page: Number(searchParams.get("page") ?? "1") || 1,
  });
  const [searchText, setSearchText] = useState(filters.search);
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const appliedSearch = useRef(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (appliedSearch.current === searchText) return;
      appliedSearch.current = searchText;
      setLoading(true);
      setFilters((current) => ({ ...current, search: searchText, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", String(filters.page));
    const query = params.toString();
    const url = query ? `/services?${query}` : "/services";
    if (`${window.location.pathname}${window.location.search}` !== url) {
      router.replace(url, { scroll: false });
    }
  }, [filters, router]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      limit: String(LIMIT),
      page: String(filters.page),
    });
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.sort) params.set("sort", filters.sort);

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/services?${params}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load services");
        return response.json();
      })
      .then((payload) => {
        const list = Array.isArray(payload)
          ? payload
          : (payload.services ?? payload.data ?? []);
        setServices(Array.isArray(list) ? (list as Service[]) : []);
        setTotal(
          Number(
            payload?.total ??
              payload?.meta?.total ??
              payload?.pagination?.total ??
              list?.length ??
              0,
          ),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setServices([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters]);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setLoading(true);
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  function clearFilters() {
    setSearchText("");
    appliedSearch.current = "";
    setLoading(true);
    setFilters({ search: "", category: "", location: "", sort: "", page: 1 });
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <main className="min-h-screen bg-rose-50/40 px-4 py-12 dark:bg-background sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
            Find your perfect match
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-rose-900 sm:text-4xl dark:text-rose-100">
            Browse Wedding Services
          </h1>
        </div>

        <ServiceFilters
          filters={filters}
          searchText={searchText}
          onSearchChange={setSearchText}
          onCategoryChange={(value) => update("category", value)}
          onLocationChange={(value) => update("location", value)}
          onSortChange={(value) => update("sort", value)}
        />

        {loading ? (
          <SkeletonGrid count={LIMIT} />
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-rose-200 bg-white/70 px-6 py-20 text-center dark:border-rose-900/50 dark:bg-card/50">
            <SearchX className="size-10 text-rose-300 dark:text-rose-700" />
            <h2 className="mt-4 text-lg font-medium text-rose-900 dark:text-rose-100">
              No services found
            </h2>
            <p className="mt-2 mb-5 text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id ?? service._id ?? index}
                  service={service}
                />
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => {
                  setLoading(true);
                  setFilters((current) => ({ ...current, page: current.page - 1 }));
                }}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= totalPages}
                onClick={() => {
                  setLoading(true);
                  setFilters((current) => ({ ...current, page: current.page + 1 }));
                }}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<SkeletonGrid count={LIMIT} />}>
      <ServicesContent />
    </Suspense>
  );
}
