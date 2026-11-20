"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Camera,
  Flower2,
  Palette,
  Shirt,
  UtensilsCrossed,
} from "lucide-react";

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: Building2 },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: UtensilsCrossed },
  { name: "Makeup & Styling", icon: Palette },
  { name: "Wedding Fashion", icon: Shirt },
];

export default function Categories() {
  return (
    <section className="bg-rose-50/60 px-6 py-20 dark:bg-rose-950/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
            Browse by category
          </p>
          <h2 className="font-heading text-3xl font-semibold text-rose-900 sm:text-4xl dark:text-rose-100">
            Everything for your big day
          </h2>
          <p className="mt-3 text-muted-foreground">
            From the first photo to the final dance, find the right people for
            every moment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Link
                href={`/services?category=${encodeURIComponent(name)}`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-rose-100 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/60 dark:border-rose-900/40 dark:bg-card dark:hover:border-rose-800"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-rose-100 to-amber-100 text-rose-600 dark:from-rose-950/60 dark:to-amber-950/40 dark:text-rose-300">
                  <Icon className="size-5" />
                </span>
                <span className="flex-1 text-sm font-medium text-rose-900 dark:text-rose-100">
                  {name}
                </span>
                <ArrowUpRight className="size-4 text-rose-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rose-600 dark:text-rose-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
