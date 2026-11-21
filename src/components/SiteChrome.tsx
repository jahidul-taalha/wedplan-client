"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex flex-1 flex-col">{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
