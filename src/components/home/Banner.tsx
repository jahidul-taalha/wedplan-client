"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80";

const stats = [
  { value: "500+", label: "Vendors" },
  { value: "2k+", label: "Happy Couples" },
  { value: "6", label: "Categories" },
];

export default function Banner() {
  return (
    <section className="relative isolate flex min-h-[660px] items-center overflow-hidden px-6 py-28 sm:py-36">
      <img
        src={heroImage}
        alt="A wedding celebration"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-rose-950/85 via-rose-950/60 to-rose-950/85" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-rose-950/70 via-transparent to-rose-950/40" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto w-full max-w-5xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-amber-100 uppercase backdrop-blur-sm">
          <Heart className="size-3.5 fill-rose-300 text-rose-300" />
          Your wedding, beautifully planned
        </span>

        <h1 className="mx-auto mt-7 max-w-4xl font-serif text-4xl leading-tight font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          A love story begins.
          <br />
          <span className="text-amber-200">We help you plan the rest.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-rose-50/90 sm:text-lg">
          Discover trusted vendors, compare services, and bring your perfect day
          to life — all in one calm, curated place.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/services"
            className={`${buttonVariants()} h-12 gap-2 px-7 text-base`}
          >
            Explore Wedding Services
            <ArrowRight />
          </Link>
          <Link
            href="#how-it-works"
            className={`${buttonVariants({ variant: "outline" })} h-12 border-white/40 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white`}
          >
            How it works
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-8 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-amber-100/80 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
