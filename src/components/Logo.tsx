import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-rose-700 dark:text-rose-300",
        className,
      )}
    >
      <Heart className="size-5 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" />
      WedPlan
    </Link>
  );
}
