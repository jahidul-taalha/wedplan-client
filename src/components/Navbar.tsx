"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why WedPlan", href: "/#why-choose" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/85 backdrop-blur-md dark:border-rose-900/40 dark:bg-background/85">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-rose-900/80 transition-colors hover:text-rose-700 dark:text-rose-100/80 dark:hover:text-rose-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" render={<Link href="/sign-in" />}>
            Sign In
          </Button>
          <Button
            render={<Link href="/sign-up" />}
            className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:text-white"
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-9 items-center justify-center rounded-lg text-rose-700 hover:bg-rose-50 md:hidden dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-rose-100 bg-white px-4 py-4 md:hidden dark:border-rose-900/40 dark:bg-background">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-rose-900/80 hover:bg-rose-50 dark:text-rose-100/80 dark:hover:bg-rose-950/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" render={<Link href="/sign-in" />}>
              Sign In
            </Button>
            <Button render={<Link href="/sign-up" />} className="bg-rose-600 text-white hover:bg-rose-700">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
