"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Send,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Layers,
  ArrowLeft,
  ChevronRight,
  Home,
  Receipt,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { name: "Ringkasan", href: "/admin", icon: Layers },
  { name: "Editor Teks", href: "/admin/teks", icon: FileText },
  { name: "Koleksi", href: "/admin/koleksi", icon: FolderKanban },
  { name: "Galeri Foto", href: "/admin/media", icon: ImageIcon },
  { name: "Invoice", href: "/admin/invoice", icon: Receipt },
  { name: "Publikasi", href: "/admin/publikasi", icon: Send },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Jangan tampilkan navbar pada halaman login
  if (pathname === "/admin/login") {
    return null;
  }

  const isRootDashboard = pathname === "/admin";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/admin");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
    }
  };

  // Identifikasi section aktif
  const currentItem = NAV_ITEMS.find(
    (item) => item.href !== "/admin" && (pathname === item.href || pathname.startsWith(item.href))
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Back Button + Brand Logo + Nav Links */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {/* Back Action Button */}
          {isRootDashboard ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 shrink-0"
              title="Kembali ke website utama Logia Creative"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ke Web Utama</span>
              <span className="sm:hidden">Web</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Kembali ke halaman sebelumnya"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          )}

          <div className="h-4 w-px bg-black/10 dark:border-white/10 hidden min-[480px]:block" />

          {/* Logo & Brand */}
          <Link href="/admin" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-20 sm:w-24 h-6 sm:h-7">
              <Image
                src="/Group 3.webp"
                alt="Logia Logo"
                fill
                sizes="96px"
                className="object-contain brightness-0 dark:invert transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 font-bold tracking-wider">
              CMS
            </span>
          </Link>

          {/* Active section breadcrumb badge (small to tablet screens) */}
          {currentItem && (
            <div className="hidden min-[520px]:flex lg:hidden items-center gap-1 text-xs text-neutral-500 truncate">
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="font-semibold text-black dark:text-white truncate">
                {currentItem.name}
              </span>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-2" aria-label="Menu Admin">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka website publik di tab baru"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl border border-black/10 dark:border-white/15 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span>Lihat Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Keluar dari admin"
            title="Logout"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl border border-black/10 dark:border-white/15 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-black/10 dark:border-white/15 text-neutral-800 dark:text-neutral-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#0e0e0e] px-4 pt-3 pb-5 space-y-1.5">
          {!isRootDashboard && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleBack();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Kembali ke Halaman Sebelumnya</span>
            </button>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Website</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
