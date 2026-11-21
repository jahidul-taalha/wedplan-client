"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending || !session?.user) return;
    router.replace(`/dashboard/${session.user.role ?? "customer"}`);
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-8 animate-spin text-rose-500" />
      <p className="text-sm text-muted-foreground">Opening your dashboard...</p>
    </div>
  );
}
