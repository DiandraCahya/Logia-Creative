"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  KeyRound,
  AlertCircle,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { api, AuthUser } from "@/lib/api";

interface AdminLoginProps {
  onSuccess: (user: AuthUser) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk animasi transisi setelah login berhasil
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ username: username.trim(), password });
      if (res.data?.user) {
        const user = res.data.user;
        setSuccessUser(user);
        setIsSuccess(true);

        // Picu animasi progress bar mengisi halus
        setTimeout(() => {
          setProgressWidth(100);
        }, 60);

        // Tunggu animasi transisi selesai sebelum masuk ke menu dashboard CMS
        setTimeout(() => {
          onSuccess(user);
        }, 1450);
      } else {
        setError("Autentikasi gagal. Mohon periksa kembali kredensial Anda.");
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal login. Periksa kembali username dan password."
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 my-auto relative z-10">
      <div className="w-full max-w-[440px] rounded-3xl p-6 sm:p-9 bg-white/75 dark:bg-black/60 border border-black/10 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden transition-all duration-500">
        {/* Dekorasi hairline di atas card */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#A08C6A] to-transparent opacity-60"
          aria-hidden="true"
        />

        {isSuccess ? (
          /* ==============================================================
             ANIMASI SUKSES SETELAH BERHASIL LOGIN SEBELUM MASUK CMS
             ============================================================== */
          <div className="py-6 flex flex-col items-center text-center animate-fadeIn">
            {/* Animated Icon Check / Logo */}
            <div className="relative mb-5 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/15 flex items-center justify-center shadow-lg relative overflow-hidden"
              >
                <div className="relative w-12 h-12 select-none animate-pulse">
                  <Image
                    src="/logo3d.webp"
                    alt="Logia Mark"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Autentikasi Berhasil</span>
            </div>

            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-black dark:text-white mb-1.5 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              {successUser?.name || successUser?.username}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Mempersiapkan workspace CMS Logia Creative...
            </p>

            {/* Smooth Progress Bar */}
            <div className="w-full max-w-[280px] bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden relative mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#A08C6A] via-black to-[#A08C6A] dark:from-[#A08C6A] dark:via-white dark:to-[#A08C6A] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              Mengalihkan ke panel kontrol...
            </span>
          </div>
        ) : (
          /* ==============================================================
             FORM LOGIN CMS DENGAN TAMPILAN TERBARU DAN LEBIH BERSIH
             ============================================================== */
          <>
            {/* Header Identitas Studio */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 select-none shrink-0">
                  <Image
                    src="/logo3d.webp"
                    alt="Logia 3D Mark"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-base sm:text-lg text-black dark:text-white leading-tight tracking-tight">
                      Logia CMS
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Creative &amp; Technology Panel
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                title="Buka Website Utama"
              >
                <span>Web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-black dark:text-white mb-1.5 tracking-tight">
                Masuk ke Logia CMS
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Kelola portofolio karya, paket harga, layanan, testimoni, dan leads kolaborasi agensi.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-white/50 dark:bg-black/40 border border-black/15 dark:border-white/15 text-sm font-medium text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <KeyRound
                    className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-11 py-3 min-h-[44px] rounded-xl bg-white/50 dark:bg-black/40 border border-black/15 dark:border-white/15 text-sm font-medium text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Informasi Akses */}
            <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A08C6A]" />
                <span>Akses aman terenkripsi</span>
              </span>
              <Link
                href="/"
                className="hover:text-black dark:hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
