"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ServerOff, ShieldAlert, AlertCircle, CheckCircle2, RefreshCw, Home, Terminal, Sparkles } from "lucide-react";
import { api, API_BASE_URL } from "@/lib/api";

function ErrorContent() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status") || searchParams.get("code") || "502";
  const customMessage = searchParams.get("message");

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const statusCode = parseInt(rawStatus, 10) || 502;

  const testConnection = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await api.getHealth();
      setCheckResult({
        ok: true,
        msg: `Koneksi berhasil: ${res.message || "Server API normal"} (Uptime: ${Math.round(res.uptime)}s)`,
      });
    } catch (err) {
      setCheckResult({
        ok: false,
        msg: err instanceof Error ? err.message : "Server belum merespons pada port 5000.",
      });
    } finally {
      setChecking(false);
    }
  };

  const getDetails = () => {
    switch (statusCode) {
      case 502:
        return {
          badge: "Kesalahan 502",
          title: "Bad Gateway: API Server Terputus",
          icon: ServerOff,
          desc:
            customMessage ||
            "Aplikasi frontend tidak dapat berkomunikasi dengan backend server Express CMS di " +
              API_BASE_URL +
              ". Layanan mungkin sedang dihentikan atau belum dinyalakan.",
          guide: "Pastikan folder API-Logia dijalankan dengan perintah: npm run dev atau node src/server.js",
        };
      case 403:
        return {
          badge: "Kesalahan 403",
          title: "Akses Ditolak (Forbidden)",
          icon: ShieldAlert,
          desc:
            customMessage ||
            "Sesi login Anda telah kedaluwarsa atau Anda tidak memiliki izin untuk mengakses direktori ini.",
          guide: "Silakan login ulang dengan akun administrator yang valid.",
        };
      case 500:
      default:
        return {
          badge: `Kesalahan ${statusCode}`,
          title: "Internal Server Error",
          icon: AlertCircle,
          desc:
            customMessage ||
            "Terjadi kesalahan pemrosesan pada internal server saat mengeksekusi permintaan Anda.",
          guide: "Periksa kembali log server API untuk meninjau rincian stack trace kesalahan.",
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center my-auto">
      {/* 3D Visual with Error Indicator */}
      <div className="relative mb-5 flex flex-col items-center group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff4114]/25 via-transparent to-red-500/20 blur-2xl pointer-events-none" />
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 transition-transform duration-500 group-hover:scale-105 select-none">
          <Image
            src="/logo3d.webp"
            alt="Logia 3D Mark"
            fill
            priority
            className="object-contain drop-shadow-[0_20px_40px_rgba(255,65,20,0.35)]"
          />
        </div>
        <div className="w-11 h-11 -mt-4 rounded-2xl bg-[#ff4114]/15 border border-[#ff4114]/30 text-[#ff4114] flex items-center justify-center shadow-lg backdrop-blur-md">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#ff4114] mb-3 px-3.5 py-1 rounded-full border border-[#ff4114]/25 bg-[#ff4114]/5">
        {details.badge}
      </span>

      <h1 className="font-righteous text-2xl sm:text-4xl text-black dark:text-white mb-3 text-center">
        {details.title}
      </h1>

      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 text-center max-w-lg leading-relaxed">
        {details.desc}
      </p>

      {/* Diagnostic & Troubleshooting card */}
      <div className="w-full text-left mb-6 p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
          <Terminal className="w-4 h-4 text-[#ff4114]" />
          Petunjuk Diagnostik Sistem
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
          {details.guide}
        </p>

        {statusCode === 502 && (
          <div className="pt-2 border-t border-black/10 dark:border-white/10">
            <button
              onClick={testConnection}
              disabled={checking}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-xs font-semibold text-black dark:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Memeriksa..." : "Uji Koneksi ke API"}
            </button>

            {checkResult && (
              <div
                className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                  checkResult.ok
                    ? "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20"
                    : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
                }`}
              >
                {checkResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                )}
                <span>{checkResult.msg}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <Link
          href="/admin"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
        >
          Buka Panel CMS
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
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

      {/* Ambient background glow accents */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#ff4114]/10 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
          <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#ff4114]/10 text-[#ff4114] border border-[#ff4114]/20">
            System Guard
          </span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md text-xs font-mono text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Gateway Diagnostic</span>
        </div>
      </header>

      {/* Main Diagnostic Body */}
      <main className="relative z-10 px-6 py-6 flex flex-col items-center text-center my-auto">
        <Suspense fallback={<div className="text-sm text-neutral-500">Memuat rincian kesalahan...</div>}>
          <ErrorContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/5">
        <p>Logia Creative Agency • Diagnostic Center</p>
        <p className="text-[11px] text-neutral-400">API Port: 5000 • Frontend Port: 3000</p>
      </footer>
    </div>
  );
}
