import React from "react";
import type { Metadata } from "next";
import { InvoiceGenerator } from "@/components/admin/InvoiceGenerator";

export const metadata: Metadata = {
  title: "Generator Invoice Figma | Admin Logia Creative",
  description: "Buat dan cetak invoice resmi dengan desain Figma Logia Creative.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminInvoicePage() {
  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4">
      <InvoiceGenerator />
    </div>
  );
}
