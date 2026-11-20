import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Sign In", href: "/sign-in" },
];

const socials = [
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.26.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07ZM12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.41a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
  },
  {
    label: "Facebook",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
  {
    label: "Twitter",
    path: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.5 22H3.4l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 18h1.73L7.35 3.89H5.5L17.8 20Z",
  },
];

function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-linear-to-b from-rose-50/80 to-amber-50/70 px-4 py-14 dark:border-rose-900/40 dark:from-rose-950/20 dark:to-amber-950/10">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            WedPlan connects couples with trusted wedding vendors, making it
            simple to plan a celebration as unique as your love story.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-rose-900 dark:text-rose-100">
            Explore
          </h3>
          <ul className="space-y-2.5">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-rose-700 dark:hover:text-rose-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-rose-900 dark:text-rose-100">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-rose-500" />
              hello@wedplan.com
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-rose-500" />
              +1 (555) 012-3456
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
              123 Rose Lane, Wedding Avenue
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-rose-900 dark:text-rose-100">
            Follow the love
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Inspiration, tips, and real weddings.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ label, path }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-full border border-rose-200 bg-white/70 text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-card/70 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                <SocialIcon path={path} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-rose-200/70 pt-6 text-center text-xs text-muted-foreground dark:border-rose-900/40">
        © {new Date().getFullYear()} WedPlan. All rights reserved. Made with care
        for your perfect day.
      </div>
    </footer>
  );
}
