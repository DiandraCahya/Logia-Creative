"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, KeyRound, AlertCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { api, AuthUser } from "@/lib/api";

interface AdminLoginProps {
  onSuccess: (user: AuthUser) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        onSuccess(res.data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal login. Periksa kembali username dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
      {/* Background artwork with modeGelap.webp */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-35 mix-blend-overlay">
        <Image
          src="/modeGelap.webp"
          alt="Logia Backdrop"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#ff4114]/15 blur-3xl pointer-events-none -top-12 -left-12"
        aria-hidden="true"
      />
      <div
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#A08C6A]/15 blur-3xl pointer-events-none -bottom-12 -right-12"
        aria-hidden="true"
      />

      <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Top brand identity with LOGO and 3D Icon */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
          <Link href="/" className="inline-flex items-center gap-2.5" title="Kembali ke Website Utama">
            <div className="relative w-24 h-7">
              <Image
                src="/LOGO.webp"
                alt="Logia Logo"
                fill
                className="object-contain dark:invert"
                priority
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff4114]/10 text-[#ff4114] border border-[#ff4114]/25">
              CMS Studio
            </span>
          </Link>

          <div className="relative w-10 h-10 select-none">
            <Image
              src="/logo3d.webp"
              alt="Logia 3D Mark"
              fill
              className="object-contain drop-shadow-[0_4px_12px_rgba(255,65,20,0.35)]"
            />
          </div>
        </div>

        <h1 className="font-righteous text-2xl sm:text-3xl text-black dark:text-white mb-2">
          CMS Logia Creative
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          Silakan masuk untuk mengelola portofolio, layanan, paket harga, testimoni, dan leads kolaborasi.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username admin"
                required
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-transparent border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-black dark:text-white focus:outline-none focus:border-[#ff4114] focus:ring-1 focus:ring-[#ff4114] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                required
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-transparent border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-black dark:text-white focus:outline-none focus:border-[#ff4114] focus:ring-1 focus:ring-[#ff4114] transition-colors"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Kredensial Default:</span>
            <br />
            admin / admin123 atau Logiaaa / rakhakucrut
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[46px] rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
