"use client";

import type { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-rose-50/30 md:flex-row dark:bg-background">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
