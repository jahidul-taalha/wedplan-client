"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  ClipboardList,
  CreditCard,
  Crown,
  LayoutDashboard,
  ListChecks,
  Menu,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavLink = { label: string; href: string; icon: typeof LayoutDashboard };

const linksByRole: Record<string, NavLink[]> = {
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Services", href: "/dashboard/vendor/services", icon: ListChecks },
    { label: "Add Service", href: "/dashboard/vendor/add-service", icon: PlusCircle },
    { label: "Booking Requests", href: "/dashboard/vendor/bookings", icon: CalendarCheck2 },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Crown },
    { label: "Profile Settings", href: "/dashboard/vendor/profile", icon: Settings },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Profile Settings", href: "/dashboard/customer/profile", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: ListChecks },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

function NavLinks({
  links,
  onNavigate,
}: {
  links: NavLink[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                : "text-muted-foreground hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "customer";
  const links = linksByRole[role] ?? linksByRole.customer;
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-rose-100 bg-rose-50/50 px-4 py-6 md:flex dark:border-rose-900/40 dark:bg-rose-950/10">
        <div className="px-2 pb-6">
          <Logo className="text-xl" />
        </div>
        <NavLinks links={links} />
      </aside>

      <div className="flex items-center gap-3 border-b border-rose-100 bg-white px-4 py-3 md:hidden dark:border-rose-900/40 dark:bg-card">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo className="text-xl" />
              </SheetTitle>
            </SheetHeader>
            <NavLinks links={links} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-rose-800 dark:text-rose-200">Dashboard</span>
      </div>
    </>
  );
}
