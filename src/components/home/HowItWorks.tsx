"use client";

import { motion } from "framer-motion";
import { CalendarHeart, MessageCircle, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up as a couple or a vendor in just a few moments.",
  },
  {
    icon: Search,
    title: "Explore & Compare",
    description: "Browse services, filter by category, and find your favorites.",
  },
  {
    icon: MessageCircle,
    title: "Connect with Vendors",
    description: "Reach out, ask questions, and find the perfect match.",
  },
  {
    icon: CalendarHeart,
    title: "Celebrate Your Day",
    description: "Book with confidence and enjoy every moment of your wedding.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-linear-to-b from-rose-50/70 to-amber-50/60 px-6 py-20 dark:from-rose-950/15 dark:to-amber-950/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
            Four simple steps
          </p>
          <h2 className="font-heading text-3xl font-semibold text-rose-900 sm:text-4xl dark:text-rose-100">
            How WedPlan Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            From dreaming to saying &ldquo;I do&rdquo;, we are with you every step
            of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-5 w-fit">
                <span className="flex size-14 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm dark:border-rose-900/50 dark:bg-card dark:text-rose-300">
                  <Icon className="size-6" />
                </span>
                <span className="absolute -top-1 -right-2 flex size-6 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-100">
                {title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
