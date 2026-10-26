"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ShieldCheck,
  Activity,
  Menu,
  X,
  User,
} from "lucide-react";
import {
  api,
  AuthUser,
  getStoredToken,
  getStoredUser,
  clearStoredAuth,
} from "@/lib/api";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { InquiriesTab } from "@/components/admin/InquiriesTab";
import { PortfolioTab } from "@/components/admin/PortfolioTab";
import { ServicesTab } from "@/components/admin/ServicesTab";
import { PricingTab } from "@/components/admin/PricingTab";
import { TestimonialsTab } from "@/components/admin/TestimonialsTab";
import { SiteInfoTab } from "@/components/admin/SiteInfoTab";
import { CompanyProfileTab } from "@/components/admin/CompanyProfileTab";
import { MediaUploadTab } from "@/components/admin/MediaUploadTab";

type TabId =
  | "inquiries"
  | "portfolio"
  | "services"
  | "pricing"
  | "testimonials"
  | "site-info"
  | "company-profile"
  | "media";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "inquiries", label: "Leads Kolaborasi", icon: Inbox },
  { id: "portfolio", label: "Portofolio Karya", icon: FolderKanban },
  { id: "services", label: "Layanan Agensi", icon: Layers },
  { id: "pricing", label: "Paket Harga", icon: Tag },
  { id: "testimonials", label: "Testimoni", icon: MessageSquareQuote },
  { id: "site-info", label: "Info Website & Hero", icon: Globe },
  { id: "company-profile", label: "Profil & Visi Misi", icon: Compass },
  { id: "media", label: "Upload & Media", icon: UploadCloud },
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("inquiries");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth and health on mount
  useEffect(() => {
    const checkAuthAndServer = async () => {
      // Check API Health
      try {
        await api.getHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }

      // Check current auth
      const token = getStoredToken();
      const cachedUser = getStoredUser();

      if (token && cachedUser) {
        setCurrentUser(cachedUser);
        try {
          const res = await api.getMe();
          if (res.data) setCurrentUser(res.data);
        } catch {
          // Token might be invalid if strict auth is on
        }
      } else {
        // If REQUIRE_AUTH=false on backend, we allow guest-admin or prompt login
        try {
          const res = await api.getMe();
          if (res.data) setCurrentUser(res.data);
        } catch {
          // Keep currentUser null to prompt login
        }
      }
      setAuthChecked(true);
    };

    checkAuthAndServer();
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="text-sm font-semibold text-neutral-500 flex items-center gap-2">
          <Activity className="w-4 h-4 animate-spin text-[#ff4114]" />
          Menghubungkan ke CMS Logia Creative...
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login form
  if (!currentUser) {
    return <AdminLogin onSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-xl border border-black/10 dark:border-white/10 lg:hidden text-black dark:text-white"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 select-none">
              <Image
                src="/logo3d.webp"
                alt="Logia 3D Mark"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-righteous text-lg sm:text-xl text-black dark:text-white">
              Logia CMS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff4114]/10 text-[#ff4114] border border-[#ff4114]/25">
              Studio
            </span>
          </Link>

          {/* Server API Health Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === true
                  ? "bg-green-500"
                  : apiOnline === false
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-neutral-500">
              {apiOnline === true
                ? "API Aktif (Port 5000)"
                : apiOnline === false
                ? "API Offline"
                : "Memeriksa..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Website
          </Link>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-black/10 dark:border-white/10">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-tight text-black dark:text-white">
                {currentUser.name || currentUser.username}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono capitalize">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={() => setChangePasswordOpen(true)}
              className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 transition-colors"
              title="Ubah Password Admin"
              aria-label="Ubah Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
              title="Keluar dari Panel Admin"
              aria-label="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 p-6 border-r border-black/10 dark:border-white/10 shrink-0">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 text-[11px] text-neutral-500 space-y-3">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/logo3d.webp"
                  alt="Logia 3D"
                  fill
                  className="object-contain drop-shadow-[0_4px_10px_rgba(255,65,20,0.3)]"
                />
              </div>
              <div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 leading-tight">
                  Logia CMS v1.0
                </p>
                <p className="text-[10px] text-neutral-400">Creative & Tech Studio</p>
              </div>
            </div>
            <p className="px-1 text-neutral-500">Pusat kontrol konten website resmi Logia Creative Agency.</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer / Horizontal scroll */}
        <div className="lg:hidden w-full border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2 overflow-x-auto flex gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 min-w-0 overflow-y-auto">
          {activeTab === "inquiries" && <InquiriesTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "pricing" && <PricingTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
          {activeTab === "site-info" && <SiteInfoTab />}
          {activeTab === "company-profile" && <CompanyProfileTab />}
          {activeTab === "media" && <MediaUploadTab />}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}
