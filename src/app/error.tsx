"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for telemetry if needed
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden select-none">
      {/* Subtle brand dark atmosphere overlay using modeGelap.webp */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-overlay">
        <Image
          src="/modeGelap.webp"
          alt="Logia Background Atmosphere"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-red-500/10 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          title="Beranda Logia Creative"
        >
          <div className="relative w-28 h-8 sm:w-32 sm:h-9">
            <Image
              src="/LOGO.webp"
              alt="Logia Creative Logo"
              fill
              className="object-contain dark:invert transition-opacity group-hover:opacity-80"
              priority
            />
          </div>
          <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            System Error
          </span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md text-xs font-mono text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Internal Fault 500</span>
        </div>
      </header>

      {/* Central Hero Stage */}
      <main className="relative z-10 max-w-lg mx-auto px-6 py-6 flex flex-col items-center text-center my-auto">
        {/* 3D Visual with Alert Badge */}
        <div className="relative mb-5 flex flex-col items-center group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/30 via-transparent to-[#ff4114]/20 blur-2xl pointer-events-none" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/logo3d.webp"
              alt="Logia 3D Mark"
              fill
              priority
              className="object-contain drop-shadow-[0_20px_40px_rgba(239,68,68,0.35)]"
            />
          </div>
          <div className="w-11 h-11 -mt-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center shadow-lg backdrop-blur-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-red-600 dark:text-red-400 mb-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/5">
          Terjadi Gangguan Sistem (500)
        </span>

        <h1 className="font-righteous text-2xl sm:text-4xl text-black dark:text-white mb-3">
          Sesuatu Tidak Berjalan Sesuai Rencana
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 max-w-md leading-relaxed">
          Sistem kami mendeteksi kendala tak terduga saat memproses data. Silakan coba muat ulang halaman atau kembali ke beranda.
        </p>

        {error.message && (
          <div className="w-full text-left mb-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto max-h-32 shadow-sm">
            <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Pesan Kesalahan:</p>
            <p>{error.message}</p>
            {error.digest && <p className="text-neutral-500 mt-1">Digest: {error.digest}</p>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Muat Ulang
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/5">
        <p>Logia Creative Agency • Error Recovery</p>
        <p className="text-[11px] text-neutral-400">Logia Core Engine 2026</p>
      </footer>
    </div>
  );
}
