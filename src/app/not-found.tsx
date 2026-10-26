import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Compass, PhoneCall } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden select-none">
      {/* Background artwork overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-overlay">
        <Image
          src="/modeGelap.webp"
          alt="Logia Background Texture"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Ambient glowing radial orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#ff4114]/12 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute w-72 h-72 rounded-full bg-[#A08C6A]/10 blur-[100px] pointer-events-none -top-12 -left-12"
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
            Creative & Tech
          </span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md text-xs font-mono text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-[#ff4114] animate-pulse" />
          <span>Error 404: Not Found</span>
        </div>
      </header>

      {/* Central Hero Stage */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8 flex flex-col items-center text-center my-auto">
        {/* Floating 3D Mark with glowing aura */}
        <div className="relative mb-6 group cursor-default">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff4114]/30 via-transparent to-[#A08C6A]/20 blur-2xl group-hover:blur-3xl transition-all duration-700 pointer-events-none" />
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src="/logo3d.webp"
              alt="Logia 3D Mark"
              fill
              priority
              className="object-contain drop-shadow-[0_25px_45px_rgba(255,65,20,0.35)]"
            />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[#ff4114]/25 bg-[#ff4114]/10 backdrop-blur-md">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#ff4114]">
            Halaman Tidak Ditemukan
          </span>
        </div>

        {/* Kinetic Title */}
        <h1 className="font-righteous text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-tight text-black dark:text-white mb-4">
          Kehilangan Arah Digital
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg leading-relaxed">
          Alamat yang Anda tuju mungkin telah dipindahkan, diarsipkan, atau tautan yang dimasukkan kurang tepat.
        </p>

        {/* Action Button Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[46px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <Link
            href="/#portfolio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[46px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            <Compass className="w-4 h-4" />
            Eksplorasi Karya
          </Link>

          <Link
            href="/#layanan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[46px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4114]"
          >
            <PhoneCall className="w-4 h-4" />
            Layanan Kami
          </Link>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/5">
        <p>Logia Creative Agency • Surabaya, Jawa Timur, Indonesia</p>
        <p className="text-[11px] text-neutral-400">Crafting Vision into Modern Digital Reality</p>
      </footer>
    </div>
  );
}
