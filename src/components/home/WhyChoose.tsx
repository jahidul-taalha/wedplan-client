"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck2,
  HeartHandshake,
  Wallet,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Trusted Vendors",
    description:
      "Every vendor is reviewed so you can book with confidence and peace of mind.",
  },
  {
    icon: Wallet,
    title: "Clear Pricing",
    description:
      "Compare packages and prices upfront, with no surprising costs later on.",
  },
  {
    icon: HeartHandshake,
    title: "Made for You",
    description:
      "Discover services tailored to your style, budget, and wedding vision.",
  },
  {
    icon: CalendarCheck2,
    title: "Plan with Ease",
    description:
      "Shortlist favorites, connect directly, and keep your planning in one place.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white px-6 py-20 dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
            The WedPlan difference
          </p>
          <h2 className="font-heading text-3xl font-semibold text-rose-900 sm:text-4xl dark:text-rose-100">
            Why Choose WedPlan?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Planning a wedding should feel joyful, not overwhelming. We make it
            simple to find the right people for your celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-rose-100 bg-linear-to-br from-white to-rose-50/70 p-6 text-center shadow-sm dark:border-rose-900/40 dark:from-card dark:to-rose-950/20"
            >
              <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
