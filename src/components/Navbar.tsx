"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import Logo from "@/components/Logo";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;
  const role = user?.role ?? "customer";

  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/85 backdrop-blur-md dark:border-rose-900/40 dark:bg-background/85">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-rose-900/80 transition-colors hover:text-rose-700 dark:text-rose-100/80 dark:hover:text-rose-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="size-8 animate-pulse rounded-full bg-rose-100 dark:bg-rose-900/40" />
              <div className="h-4 w-20 animate-pulse rounded bg-rose-100 dark:bg-rose-900/40" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-400 dark:hover:bg-rose-950/40"
                  />
                }
              >
                <Avatar>
                  {user.image && <AvatarImage src={user.image} alt={user.name ?? "User"} />}
                  <AvatarFallback className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                    {(user.name ?? "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate text-sm font-medium text-rose-900 dark:text-rose-100">
                  {user.name ?? "Account"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="truncate">{user.name ?? "Account"}</span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user.email ?? ""}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={`/dashboard/${role}`} />}>
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href={`/dashboard/${role}/profile`} />}>
                    <Settings />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/sign-in" />}>
                Sign In
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:text-white"
              >
                Sign Up
              </Button>
            </>
          )}
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
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-rose-900/80 hover:bg-rose-50 dark:text-rose-100/80 dark:hover:bg-rose-950/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!isPending && !user && (
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" render={<Link href="/sign-in" />}>Sign In</Button>
              <Button render={<Link href="/sign-up" />} className="bg-rose-600 text-white hover:bg-rose-700">
                Sign Up
              </Button>
            </div>
          )}
          {!isPending && user && (
            <Button variant="outline" onClick={logout} className="mt-4 w-full">
              <LogOut />
              Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
