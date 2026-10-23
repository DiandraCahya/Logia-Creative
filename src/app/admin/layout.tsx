import type { Metadata } from "next";
import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin CMS | Logia Creative",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 antialiased font-sans flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:rounded-lg focus:font-semibold focus:text-xs focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
      >
        Lompat ke Konten Utama
      </a>
      <AdminNav />
      <main id="admin-main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
