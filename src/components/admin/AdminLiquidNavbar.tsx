"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Inbox,
  FolderKanban,
  Layers,
  Tag,
  MessageSquareQuote,
  Globe,
  Compass,
  UploadCloud,
  LogOut,
  KeyRound,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { AuthUser } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

export type TabId =
  | "inquiries"
  | "portfolio"
  | "services"
  | "pricing"
  | "testimonials"
  | "site-info"
  | "company-profile"
  | "media";

export interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

export const CMS_NAV_ITEMS: NavItem[] = [
  { id: "inquiries", label: "Leads Kolaborasi", icon: Inbox },
  { id: "portfolio", label: "Portofolio Karya", icon: FolderKanban },
  { id: "services", label: "Layanan Agensi", icon: Layers },
  { id: "pricing", label: "Paket Harga", icon: Tag },
  { id: "testimonials", label: "Testimoni", icon: MessageSquareQuote },
  { id: "site-info", label: "Info Website & Hero", icon: Globe },
  { id: "company-profile", label: "Profil & Visi Misi", icon: Compass },
  { id: "media", label: "Upload & Media", icon: UploadCloud },
];

interface AdminLiquidNavbarProps {
  currentUser: AuthUser | null;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  apiOnline?: boolean | null;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
}

export function AdminLiquidNavbar({
  currentUser,
  activeTab = "inquiries",
  onTabChange,
  apiOnline,
  onOpenChangePassword,
  onLogout,
}: AdminLiquidNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // Keyboard shortcut: Escape to close expanded Dynamic Island
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  // Auto-close expanded island if resized to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeNavItem = CMS_NAV_ITEMS.find((item) => item.id === activeTab);

  return (
    <>
      {/* Backdrop overlay saat Dynamic Island terbuka di mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsExpanded(false)}
        aria-hidden={!isExpanded}
      />

      {/* Header Container pinned flush to top: 0 */}
      <header className="fixed top-0 inset-x-0 z-[10001] flex justify-center pointer-events-none overflow-x-clip transition-all duration-500">
        {/* Dynamic Island Glass Notch dengan styling identik web utama */}
        <nav
          ref={navRef}
          id="macbook-island-nav"
          aria-label="Navigasi Dynamic Island CMS Logia Creative"
          className={`macbook-island pointer-events-auto relative select-none flex flex-col mx-auto overflow-hidden hide-scrollbar transition-all duration-350 ease-out ${
            !currentUser
              ? "w-[min(540px,calc(100vw-1.5rem))] rounded-b-[22px] px-4 sm:px-6 py-2 min-h-[50px] justify-center"
              : isExpanded
              ? "w-[min(620px,calc(100vw-1.25rem))] rounded-b-[26px] pt-2.5 pb-4 px-4 sm:px-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] justify-start"
              : "w-[min(1480px,calc(100vw-1.5rem))] rounded-b-[24px] px-3.5 sm:px-6 pt-2 pb-2.5 min-h-[52px] lg:min-h-[92px] justify-center"
          }`}
        >
          {/* Top-Left Concave Ear (Menyambungkan notch ke bezel layar atas) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="macbook-ear absolute top-0 right-full w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5 pointer-events-none"
          >
            <path d="M 0 0 L 16 0 L 16 16 C 16 7.163 8.837 0 0 0 Z" />
          </svg>

          {/* Top-Right Concave Ear (Menyambungkan notch ke bezel layar atas) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="macbook-ear absolute top-0 left-full w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5 pointer-events-none"
          >
            <path d="M 0 16 C 0 7.163 7.163 0 16 0 L 0 0 Z" />
          </svg>

          {/* ==============================================================
             KONDISI 1: PRE-LOGIN (Saat belum login di halaman CMS)
             ============================================================== */}
          {!currentUser ? (
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0">
                  <ThemeToggle className="!w-8 !h-8" />
                </div>
                <div className="relative w-7 h-7 select-none shrink-0">
                  <Image
                    src="/logo3d.webp"
                    alt="Logia 3D Mark"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-base sm:text-lg text-black dark:text-white leading-tight tracking-tight">
                    Logia CMS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/15 transition-all"
                  title="Kembali ke Beranda Website Utama"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Web Utama</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ==============================================================
               KONDISI 2: LOGGED IN (Dashboard CMS dengan isi Foto 1 & Foto 2)
               ============================================================== */
            <div className="flex flex-col w-full">
              {/* BARIS 1: Konten dari Foto 1 (Logo, Status API, User, Ubah Password, Logout) */}
              <div className="flex items-center justify-between w-full gap-2 sm:gap-3">
                {/* Sisi Kiri: ThemeToggle + Identitas Logia CMS Studio + Status API */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="shrink-0">
                    <ThemeToggle className="!w-8 !h-8" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 select-none shrink-0">
                      <Image
                        src="/logo3d.webp"
                        alt="Logia 3D Mark"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <span className="font-sans font-bold text-sm sm:text-base text-black dark:text-white leading-tight tracking-tight">
                        Logia CMS
                      </span>
                      <p className="text-[10px] text-neutral-500 hidden xl:block leading-none mt-0.5 font-sans">
                        Pusat Manajemen Konten Website
                      </p>
                    </div>
                  </div>

                  {/* Indikator Status API Server dari Foto 1 */}
                  <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        apiOnline === true
                          ? "bg-emerald-500"
                          : apiOnline === false
                          ? "bg-red-500"
                          : "bg-amber-500 animate-pulse"
                      }`}
                    />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {apiOnline === true
                        ? "API Aktif (Port 5000)"
                        : apiOnline === false
                        ? "API Offline"
                        : "Memeriksa..."}
                    </span>
                  </div>
                </div>

                {/* Sisi Kanan: Aksi Lihat Web, Profil Admin, Ubah Password, Logout */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Active Tab Preview on Mobile */}
                  <div className="lg:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/15 text-[11px] font-bold text-black dark:text-white">
                    {activeNavItem && (
                      <>
                        <activeNavItem.icon className="w-3.5 h-3.5" />
                        <span className="max-w-[100px] truncate">{activeNavItem.label}</span>
                      </>
                    )}
                  </div>

                  {/* Tombol Lihat Web */}
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-full text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/15 transition-all"
                    title="Buka Website Utama di Tab Baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat Web</span>
                  </Link>

                  {/* Pemisah Garis Halus */}
                  <div className="hidden sm:block h-4 w-px bg-black/15 dark:bg-white/15" />

                  {/* Informasi Pengguna dari Foto 1 */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/20 flex items-center justify-center text-xs font-bold text-black dark:text-white shrink-0">
                      {(currentUser.name || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-bold leading-tight text-black dark:text-white">
                        {currentUser.name || currentUser.username}
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Ubah Password (Ikon Kunci dari Foto 1) */}
                  {onOpenChangePassword && (
                    <button
                      onClick={onOpenChangePassword}
                      className="p-1.5 sm:p-2 min-h-[34px] min-w-[34px] rounded-full hover:bg-black/10 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                      title="Ubah Password Admin"
                      aria-label="Ubah Password Admin"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  )}

                  {/* Tombol Keluar (Ikon Logout dari Foto 1) */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="p-1.5 sm:p-2 min-h-[34px] min-w-[34px] rounded-full hover:bg-red-500/15 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title="Keluar dari Panel Admin"
                      aria-label="Keluar dari Panel Admin"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}

                  {/* Mobile Hamburger Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    aria-label={isExpanded ? "Tutup Menu Tab CMS" : "Buka Menu Tab CMS"}
                    aria-expanded={isExpanded}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-black dark:text-white cursor-pointer ml-1"
                  >
                    {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* BARIS 2: Konten dari Foto 2 (Tab Navigasi CMS) untuk Desktop (lg:flex) */}
              <div className="hidden lg:flex items-center justify-center gap-1.5 mt-2 pt-2 border-t border-black/10 dark:border-white/10 overflow-x-auto hide-scrollbar w-full">
                {CMS_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange && onTabChange(item.id)}
                      className={`px-3 py-1.5 text-[12.5px] font-medium rounded-full transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer min-h-[34px] ${
                        isActive
                          ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/15"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* EXPANDED CONTENT: Dynamic Island Menu on Mobile / Tablet */}
              {isExpanded && (
                <div className="lg:hidden w-full mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-2.5 animate-fadeIn">
                  {/* Status API dan Tautan Web Utama pada Mobile */}
                  <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          apiOnline === true
                            ? "bg-emerald-500"
                            : apiOnline === false
                            ? "bg-red-500"
                            : "bg-amber-500 animate-pulse"
                        }`}
                      />
                      <span>
                        {apiOnline === true ? "API Aktif (Port 5000)" : "API Offline"}
                      </span>
                    </span>

                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-black dark:text-white font-semibold hover:underline"
                    >
                      <span>Kunjungi Website Utama</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Grid 8 Tab dari Foto 2 (2 kolom di mobile) */}
                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    {CMS_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (onTabChange) onTabChange(item.id);
                            setIsExpanded(false);
                          }}
                          className={`min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 text-left cursor-pointer ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                              : "bg-black/[0.04] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/[0.15] border border-black/5 dark:border-white/10"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bagian Bawah: Profil & Kontrol Logout di Mobile */}
                  <div className="mt-1 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center font-bold text-xs">
                        {(currentUser.name || currentUser.username).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-black dark:text-white">
                        {currentUser.name || currentUser.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {onOpenChangePassword && (
                        <button
                          onClick={() => {
                            setIsExpanded(false);
                            onOpenChangePassword();
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        >
                          Ganti Password
                        </button>
                      )}
                      {onLogout && (
                        <button
                          onClick={() => {
                            setIsExpanded(false);
                            onLogout();
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10"
                        >
                          Keluar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
