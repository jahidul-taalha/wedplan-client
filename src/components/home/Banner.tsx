"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-rose-50 via-white to-amber-50 px-6 py-24 sm:py-32 dark:from-rose-950/40 dark:via-background dark:to-amber-950/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -left-24 size-96 rounded-full border border-rose-200/60 bg-rose-100/40 dark:border-rose-900/40 dark:bg-rose-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 size-[28rem] rounded-full border border-amber-200/60 bg-amber-100/40 dark:border-amber-900/40 dark:bg-amber-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 size-24 rotate-45 rounded-3xl border border-rose-200/50 dark:border-rose-900/30"
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wide text-rose-700 uppercase dark:border-rose-900/50 dark:bg-card/70 dark:text-rose-300">
          <Sparkles className="size-3.5" />
          Plan the day you have always imagined
        </span>

        <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-rose-900 sm:text-5xl md:text-6xl dark:text-rose-100">
          Love begins here.
          <br />
          <span className="bg-linear-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent dark:from-rose-400 dark:to-amber-400">
            Let WedPlan plan the rest.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover trusted photographers, beautiful venues, florists, and every
          detail in between. Compare, connect, and create a celebration that is
          uniquely yours.
        </p>

        <Link
          href="/services"
          className={`${buttonVariants()} mt-9 h-11 gap-2 px-7 text-base shadow-lg shadow-rose-200/60 dark:shadow-none`}
        >
          Explore Wedding Services
          <ArrowRight />
        </Link>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Heart className="size-3.5 fill-rose-400 text-rose-400" />
          Loved by couples and vendors alike
        </p>
      </motion.div>
    </section>
  );
}
