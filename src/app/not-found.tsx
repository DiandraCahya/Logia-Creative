import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <h2 className="text-3xl font-bold mb-2">404</h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">Halaman tidak ditemukan.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
