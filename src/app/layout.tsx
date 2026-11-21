import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WedPlan | Plan Your Perfect Wedding",
  description:
    "Discover trusted wedding vendors, venues, and services for your big day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}
