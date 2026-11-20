"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useSession } from "@/lib/auth-client";

function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-rose-50/40 dark:bg-background">
      <Loader2 className="size-8 animate-spin text-rose-500" />
      <p className="text-sm text-muted-foreground">Checking your session...</p>
    </div>
  );
}

export default function AuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles?: string[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const role = user?.role ?? "customer";
  const rolesKey = allowedRoles?.join(",") ?? "";
  const isAllowed = !rolesKey || rolesKey.split(",").includes(role);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/sign-in?redirect=${pathname}`);
      return;
    }
    if (user.isBlocked) return;
    if (!isAllowed) {
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, user, pathname, router, isAllowed, role]);

  if (isPending || !user) return <FullPageLoader />;

  if (user.isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rose-50/40 px-4 dark:bg-background">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg dark:border-rose-900/50 dark:bg-card">
          <ShieldAlert className="mx-auto size-10 text-rose-500" />
          <h1 className="mt-4 text-xl font-semibold text-rose-900 dark:text-rose-100">
            Your account is blocked
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact support if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  if (!isAllowed) return <FullPageLoader />;

  return <>{children}</>;
}
