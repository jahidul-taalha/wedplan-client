"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { ServiceDetail } from "./types";

export default function ServiceGallery({
  service,
  title,
}: {
  service: ServiceDetail;
  title: string;
}) {
  const [active, setActive] = useState(0);
  const images = service.images?.filter(Boolean)?.length
    ? (service.images.filter(Boolean) as string[])
    : service.image
      ? [service.image]
      : [];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-rose-100 bg-linear-to-br from-rose-100 to-amber-100 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-amber-950/30">
        {images[active] ? (
          <Image
            src={images[active]}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-300 dark:text-rose-700">
            <Sparkles className="size-16" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`View image ${index + 1}`}
              onClick={() => setActive(index)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                active === index
                  ? "border-rose-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
