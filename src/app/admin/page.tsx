"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import {
  api,
  AuthUser,
  getStoredToken,
  getStoredUser,
  clearStoredAuth,
} from "@/lib/api";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import {
  AdminLiquidNavbar,
  TabId,
  CMS_NAV_ITEMS,
} from "@/components/admin/AdminLiquidNavbar";
import { InquiriesTab } from "@/components/admin/InquiriesTab";
import { PortfolioTab } from "@/components/admin/PortfolioTab";
import { ServicesTab } from "@/components/admin/ServicesTab";
import { PricingTab } from "@/components/admin/PricingTab";
import { TestimonialsTab } from "@/components/admin/TestimonialsTab";
import { SiteInfoTab } from "@/components/admin/SiteInfoTab";
import { CompanyProfileTab } from "@/components/admin/CompanyProfileTab";
import { MediaUploadTab } from "@/components/admin/MediaUploadTab";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("inquiries");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Periksa otentikasi dan status API server saat mount
  useEffect(() => {
    const checkAuthAndServer = async () => {
      // Cek API Health
      try {
        await api.getHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }

      // Cek sesi login saat ini
      const token = getStoredToken();
      const cachedUser = getStoredUser();

      if (token && cachedUser) {
        try {
          const res = await api.getMe();
          if (res.data) {
            setCurrentUser(res.data);
          } else {
            clearStoredAuth();
            setCurrentUser(null);
          }
        } catch {
          // Token tidak valid atau kedaluwarsa
          clearStoredAuth();
          setCurrentUser(null);
        }
      } else {
        clearStoredAuth();
        setCurrentUser(null);
      }
      setAuthChecked(true);
    };

    checkAuthAndServer();
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* 
        Navbar Dynamic Island khusus CMS:
        - Desain UI mengadopsi liquid notch identik web utama.
        - Memuat seluruh toolbar dari Foto 1 (Logo, Status API, Lihat Web, Profil Admin, Ganti Password, Logout).
        - Memuat seluruh tab navigasi dari Foto 2 (8 Tab CMS: Leads, Portfolio, Layanan, Harga, Testimoni, Hero, Profil, Media).
      */}
      <AdminLiquidNavbar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        apiOnline={apiOnline}
        onOpenChangePassword={() => setChangePasswordOpen(true)}
        onLogout={handleLogout}
      />

      {/* Konten Halaman CMS tanpa background image (polos bersih di light & dark mode, tanpa chatbot) */}
      <div className="relative z-10 flex-1 flex flex-col pt-24 lg:pt-36 sm:pt-32 pb-12">
        {!authChecked ? (
          /* Loading State saat memeriksa otentikasi */
          <div className="flex-1 flex items-center justify-center p-6 my-auto">
            <div className="px-5 py-3 rounded-2xl bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-2.5 shadow-sm">
              <Activity className="w-4 h-4 animate-spin text-[#A08C6A]" />
              <span>Menghubungkan ke CMS Logia Creative...</span>
            </div>
          </div>
        ) : !currentUser ? (
          /* Form Login CMS jika belum masuk */
          <AdminLogin onSuccess={(u) => setCurrentUser(u)} />
        ) : (
          /* Canvas Konten CMS Studio Lebar Penuh (Sidebar & Header terintegrasi di Navbar) */
          <main className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col animate-fadeIn">
            <div className="w-full rounded-3xl bg-white/80 dark:bg-neutral-950/60 backdrop-blur-sm border border-black/10 dark:border-white/10 p-4 sm:p-7 lg:p-8 shadow-sm">
              {activeTab === "inquiries" && <InquiriesTab />}
              {activeTab === "portfolio" && <PortfolioTab />}
              {activeTab === "services" && <ServicesTab />}
              {activeTab === "pricing" && <PricingTab />}
              {activeTab === "testimonials" && <TestimonialsTab />}
              {activeTab === "site-info" && <SiteInfoTab />}
              {activeTab === "company-profile" && <CompanyProfileTab />}
              {activeTab === "media" && <MediaUploadTab />}
            </div>
          </main>
        )}
      </div>

      {/* Modal Ubah Password Admin */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}
