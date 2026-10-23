"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ExternalLink,
  Save,
  RotateCcw,
  Info,
  Check,
  AlertCircle,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import type { SiteContent } from "@/lib/cms/types";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

interface ToastState {
  type: "success" | "error" | "info";
  message: string;
}

export default function AdminTeksPage() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [originalData, setOriginalData] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState | null>(null);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    seo: false,
    splash: false,
    navbar: false,
    targetPasar: false,
    about: false,
    services: false,
    footer: false,
  });

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<{
    section: string;
    field: string;
    subIndex?: number;
    subField?: string;
  } | null>(null);

  // Check if draft exists in localStorage
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const fetchSiteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site");
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const json = await res.json();
      if (json.data) {
        setOriginalData(json.data);

        // Check if there's a draft in localStorage
        const savedDraft = localStorage.getItem("cms_site_draft");
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setData(parsed);
            setHasLocalDraft(true);
            showToast("info", "Ditemukan draf tersimpan di browser Anda.");
          } catch {
            setData(json.data);
          }
        } else {
          setData(json.data);
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Gagal memuat konten teks.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (section: keyof SiteContent, field: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value,
        },
      };
      // Auto-save draft to localStorage
      localStorage.setItem("cms_site_draft", JSON.stringify(updated));
      setHasLocalDraft(true);
      return updated;
    });
  };

  const openMediaPickerFor = (
    section: string,
    field: string,
    subIndex?: number,
    subField?: string
  ) => {
    setMediaTargetField({ section, field, subIndex, subField });
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (path: string, _alt?: string) => {
    if (!mediaTargetField || !data) return;
    const { section, field, subIndex, subField } = mediaTargetField;

    if (subIndex !== undefined && subField) {
      // Sub collection item image update
      const secData = { ...(data as any)[section] };
      const arr = [...secData[field]];
      arr[subIndex] = { ...arr[subIndex], [subField]: path };
      updateField(section as keyof SiteContent, field, arr);
    } else {
      updateField(section as keyof SiteContent, field, path);
    }
    setMediaPickerOpen(false);
    setMediaTargetField(null);
  };

  const handleSaveToServer = () => {
    if (!data) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal menyimpan ke server");

        setOriginalData(data);
        localStorage.removeItem("cms_site_draft");
        setHasLocalDraft(false);
        showToast("success", "Perubahan teks berhasil disimpan ke server.");
      } catch (err: any) {
        showToast("error", err.message || "Gagal menyimpan teks.");
      }
    });
  };

  const handleDiscardDraft = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan semua draf dan kembali ke versi server?")) {
      localStorage.removeItem("cms_site_draft");
      setHasLocalDraft(false);
      setData(originalData);
      showToast("info", "Draf telah dibatalkan.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-500">Memuat teks website...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-red-500 mb-4">Gagal memuat teks website.</p>
        <button
          onClick={fetchSiteData}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm animate-fadeIn ${
            toast.type === "success"
              ? "bg-neutral-900 text-white border-neutral-700"
              : toast.type === "error"
              ? "bg-red-950 text-red-200 border-red-800"
              : "bg-neutral-800 text-neutral-200 border-neutral-700"
          }`}
        >
          {toast.type === "success" && <Check className="w-4 h-4 text-emerald-400" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
          {toast.type === "info" && <Info className="w-4 h-4 text-amber-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-100 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
        <div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/admin";
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-1.5 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Ringkasan</span>
          </button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Editor Teks Website
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Sunting seluruh teks di setiap section. Perubahan disimpan ke draf secara otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {hasLocalDraft && (
            <button
              onClick={handleDiscardDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal Draf</span>
            </button>
          )}

          <button
            onClick={handleSaveToServer}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {hasLocalDraft && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
          <span>Perubahan draf ada di browser Anda dan belum tersimpan permanen ke server.</span>
          <span className="font-semibold underline cursor-pointer" onClick={handleSaveToServer}>
            Simpan Sekarang
          </span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <SectionCard
        title="1. Hero Section"
        locationBadge="Halaman Utama → Paling Atas"
        anchorHref="/#top"
        isOpen={openSections.hero}
        onToggle={() => toggleSection("hero")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Judul Utama Baris 1"
              location="Hero → Headline Line 1"
              value={data.hero.headlineLine1}
              maxLength={40}
              onChange={(val) => updateField("hero", "headlineLine1", val)}
            />
            <FieldText
              label="Judul Utama Baris 2"
              location="Hero → Headline Line 2"
              value={data.hero.headlineLine2}
              maxLength={40}
              onChange={(val) => updateField("hero", "headlineLine2", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Teks Tombol Utama (Primary CTA)"
              location="Hero → Tombol Kolaborasi"
              value={data.hero.primaryCta}
              maxLength={30}
              onChange={(val) => updateField("hero", "primaryCta", val)}
            />
            <FieldText
              label="Teks Tombol Sekunder"
              location="Hero → Tombol Portfolio"
              value={data.hero.secondaryCta}
              maxLength={30}
              onChange={(val) => updateField("hero", "secondaryCta", val)}
            />
          </div>

          <FieldImage
            label="Foto Potret Kreator (Hero 3D Card)"
            location="Hero → Gambar 3D Card"
            value={data.hero.heroImage}
            altValue={data.hero.heroImageAlt}
            onSelectImage={() => openMediaPickerFor("hero", "heroImage")}
            onAltChange={(alt) => updateField("hero", "heroImageAlt", alt)}
          />

          {/* Quick Preview */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
            <span className="font-semibold uppercase tracking-wider text-neutral-400">
              Pratinjau Ringkas Teks Hero
            </span>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {data.hero.headlineLine1} {data.hero.headlineLine2}
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold">
                {data.hero.primaryCta}
              </span>
              <span className="px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700">
                {data.hero.secondaryCta}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 2. SEO & METADATA */}
      <SectionCard
        title="2. SEO & Metadata Sosial"
        locationBadge="Seluruh Halaman → Head & OpenGraph"
        anchorHref="/"
        isOpen={openSections.seo}
        onToggle={() => toggleSection("seo")}
      >
        <div className="space-y-4">
          <FieldText
            label="Meta Title (Judul Tab Browser)"
            location="Head → Title"
            value={data.seo.title}
            maxLength={70}
            onChange={(val) => updateField("seo", "title", val)}
          />
          <FieldTextarea
            label="Meta Description (Hasil Pencarian Google)"
            location="Head → Meta Description"
            value={data.seo.description}
            maxLength={180}
            onChange={(val) => updateField("seo", "description", val)}
          />
          <FieldText
            label="Keywords (Dipisah Koma)"
            location="Head → Meta Keywords"
            value={data.seo.keywords}
            maxLength={300}
            onChange={(val) => updateField("seo", "keywords", val)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="OG Title (Saat Link Dishare ke WA/Medsos)"
              location="OpenGraph → og:title"
              value={data.seo.ogTitle}
              maxLength={80}
              onChange={(val) => updateField("seo", "ogTitle", val)}
            />
            <FieldText
              label="OG Description (Deskripsi Share Sosmed)"
              location="OpenGraph → og:description"
              value={data.seo.ogDescription}
              maxLength={180}
              onChange={(val) => updateField("seo", "ogDescription", val)}
            />
          </div>
          <FieldImage
            label="OG Image (Thumbnail saat Dishare)"
            location="OpenGraph → og:image"
            value={data.seo.ogImage}
            onSelectImage={() => openMediaPickerFor("seo", "ogImage")}
          />
        </div>
      </SectionCard>

      {/* 3. SPLASH SCREEN */}
      <SectionCard
        title="3. Splash Screen"
        locationBadge="Animasi Intro Pembuka Website"
        anchorHref="/"
        isOpen={openSections.splash}
        onToggle={() => toggleSection("splash")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldText
            label="Teks Animasi Mengetik"
            location="Splash → Teks Utama"
            value={data.splash.text}
            maxLength={30}
            onChange={(val) => updateField("splash", "text", val)}
          />
          <FieldText
            label="Teks Tombol Lewati (Skip)"
            location="Splash → Tombol Lewati"
            value={data.splash.skipText}
            maxLength={20}
            onChange={(val) => updateField("splash", "skipText", val)}
          />
        </div>
      </SectionCard>

      {/* 4. NAVBAR */}
      <SectionCard
        title="4. Navbar (Dynamic Island)"
        locationBadge="Header Navigasi Melayang"
        anchorHref="/"
        isOpen={openSections.navbar}
        onToggle={() => toggleSection("navbar")}
      >
        <div className="space-y-4">
          <FieldImage
            label="Gambar Logo Navbar"
            location="Navbar → Logo"
            value={data.navbar.logoImage}
            altValue={data.navbar.logoAlt}
            onSelectImage={() => openMediaPickerFor("navbar", "logoImage")}
            onAltChange={(alt) => updateField("navbar", "logoAlt", alt)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldText
              label="Label Tombol Kolaborasi"
              location="Navbar → Tombol Desktop"
              value={data.navbar.collabButton}
              maxLength={25}
              onChange={(val) => updateField("navbar", "collabButton", val)}
            />
            <FieldText
              label="Label Kolaborasi (Expanded Mobile)"
              location="Navbar → Tombol Mobile"
              value={data.navbar.collabExpanded}
              maxLength={30}
              onChange={(val) => updateField("navbar", "collabExpanded", val)}
            />
            <FieldText
              label="Subjudul Tombol Mobile"
              location="Navbar → Subjudul Mobile"
              value={data.navbar.collabSubtitle}
              maxLength={30}
              onChange={(val) => updateField("navbar", "collabSubtitle", val)}
            />
          </div>
        </div>
      </SectionCard>

      {/* 5. TARGET PASAR */}
      <SectionCard
        title="5. Target Pasar & Problem Solution"
        locationBadge="Halaman Utama → Section Target Pasar"
        anchorHref="/#target-pasar"
        isOpen={openSections.targetPasar}
        onToggle={() => toggleSection("targetPasar")}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Judul Section"
              location="Target Pasar → Judul Utama"
              value={data.targetPasar.title}
              maxLength={60}
              onChange={(val) => updateField("targetPasar", "title", val)}
            />
            <FieldText
              label="Teks Tombol Konsultasi"
              location="Target Pasar → CTA Button"
              value={data.targetPasar.ctaText}
              maxLength={35}
              onChange={(val) => updateField("targetPasar", "ctaText", val)}
            />
          </div>
          <FieldTextarea
            label="Subjudul Section"
            location="Target Pasar → Subjudul"
            value={data.targetPasar.subtitle}
            maxLength={180}
            onChange={(val) => updateField("targetPasar", "subtitle", val)}
          />

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Kategori Segmen Pasar ({data.targetPasar.markets.length})
            </span>
            {data.targetPasar.markets.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500">
                    Segmen #{idx + 1}: {m.stepNumber}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    ID: {m.id}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldText
                    label="Nama Segmen"
                    location={`Target Pasar → Segmen #${idx + 1} Judul`}
                    value={m.title}
                    maxLength={50}
                    onChange={(val) => {
                      const updated = [...data.targetPasar.markets];
                      updated[idx].title = val;
                      updateField("targetPasar", "markets", updated);
                    }}
                  />
                  <FieldText
                    label="Tag Sektor"
                    location={`Target Pasar → Segmen #${idx + 1} Tag`}
                    value={m.sectorTag}
                    maxLength={50}
                    onChange={(val) => {
                      const updated = [...data.targetPasar.markets];
                      updated[idx].sectorTag = val;
                      updateField("targetPasar", "markets", updated);
                    }}
                  />
                </div>
                <FieldTextarea
                  label="Teks Tantangan / Problem"
                  location={`Target Pasar → Segmen #${idx + 1} Masalah`}
                  value={m.problemText}
                  maxLength={300}
                  onChange={(val) => {
                    const updated = [...data.targetPasar.markets];
                    updated[idx].problemText = val;
                    updateField("targetPasar", "markets", updated);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* 6. ABOUT (PROFIL, VISI, MISI, FILOSOFI) */}
      <SectionCard
        title="6. About (Profil, Visi, Misi, Filosofi)"
        locationBadge="Halaman Utama → Section About"
        anchorHref="/#about"
        isOpen={openSections.about}
        onToggle={() => toggleSection("about")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Judul Section About"
              location="About → Judul Utama"
              value={data.about.title}
              maxLength={60}
              onChange={(val) => updateField("about", "title", val)}
            />
            <FieldText
              label="Penulis / Atribusi Kutipan Visi"
              location="About → Visi Author"
              value={data.about.visiAuthor}
              maxLength={40}
              onChange={(val) => updateField("about", "visiAuthor", val)}
            />
          </div>
          <FieldTextarea
            label="Kutipan Visi Perusahaan"
            location="About → Kutipan Visi"
            value={data.about.visiQuote}
            maxLength={300}
            onChange={(val) => updateField("about", "visiQuote", val)}
          />

          {/* Misi items */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Pilar Misi (3 Butir)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.about.missions.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2"
                >
                  <FieldText
                    label={`Misi #${idx + 1} Judul`}
                    location={`About → Misi #${idx + 1}`}
                    value={m.title}
                    maxLength={40}
                    onChange={(val) => {
                      const updated = [...data.about.missions];
                      updated[idx].title = val;
                      updateField("about", "missions", updated);
                    }}
                  />
                  <FieldTextarea
                    label="Deskripsi"
                    location={`About → Misi #${idx + 1} Deskripsi`}
                    value={m.desc}
                    maxLength={150}
                    onChange={(val) => {
                      const updated = [...data.about.missions];
                      updated[idx].desc = val;
                      updateField("about", "missions", updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Filosofi Logos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <FieldImage
              label="Logo Filosofi 1"
              location="About → Logo Filosofi 1"
              value={data.about.filosofiLogo1}
              onSelectImage={() => openMediaPickerFor("about", "filosofiLogo1")}
            />
            <FieldImage
              label="Logo Filosofi 2"
              location="About → Logo Filosofi 2"
              value={data.about.filosofiLogo2}
              onSelectImage={() => openMediaPickerFor("about", "filosofiLogo2")}
            />
          </div>
        </div>
      </SectionCard>

      {/* 7. SERVICES */}
      <SectionCard
        title="7. Layanan Kami (Services)"
        locationBadge="Halaman Utama → Section Layanan"
        anchorHref="/#layanan"
        isOpen={openSections.services}
        onToggle={() => toggleSection("services")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Judul Section Layanan"
              location="Layanan → Judul Utama"
              value={data.services.title}
              maxLength={60}
              onChange={(val) => updateField("services", "title", val)}
            />
            <FieldText
              label="Subjudul Section Layanan"
              location="Layanan → Subjudul"
              value={data.services.subtitle}
              maxLength={150}
              onChange={(val) => updateField("services", "subtitle", val)}
            />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Daftar Layanan ({data.services.items.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.services.items.map((svc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2"
                >
                  <FieldText
                    label={`Layanan #${idx + 1}`}
                    location={`Layanan → Item #${idx + 1}`}
                    value={svc.title}
                    maxLength={40}
                    onChange={(val) => {
                      const updated = [...data.services.items];
                      updated[idx].title = val;
                      updateField("services", "items", updated);
                    }}
                  />
                  <FieldTextarea
                    label="Deskripsi Layanan"
                    location={`Layanan → Deskripsi #${idx + 1}`}
                    value={svc.desc}
                    maxLength={150}
                    onChange={(val) => {
                      const updated = [...data.services.items];
                      updated[idx].desc = val;
                      updateField("services", "items", updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 8. FOOTER & KONTAK */}
      <SectionCard
        title="8. Footer & Kontak"
        locationBadge="Halaman Utama → Bagian Bawah"
        anchorHref="/#kontak"
        isOpen={openSections.footer}
        onToggle={() => toggleSection("footer")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldText
              label="Judul Banner CTA Penutup"
              location="Footer → Judul Banner CTA"
              value={data.footer.ctaHeading}
              maxLength={70}
              onChange={(val) => updateField("footer", "ctaHeading", val)}
            />
            <FieldText
              label="Teks Tombol CTA Footer"
              location="Footer → Tombol CTA"
              value={data.footer.ctaButton}
              maxLength={35}
              onChange={(val) => updateField("footer", "ctaButton", val)}
            />
          </div>

          <FieldTextarea
            label="Subjudul Banner CTA Penutup"
            location="Footer → Subjudul Banner CTA"
            value={data.footer.ctaSubtitle}
            maxLength={200}
            onChange={(val) => updateField("footer", "ctaSubtitle", val)}
          />

          <FieldTextarea
            label="Deskripsi Agensi di Footer"
            location="Footer → Deskripsi Agensi"
            value={data.footer.description}
            maxLength={250}
            onChange={(val) => updateField("footer", "description", val)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FieldText
              label="Email Kontak"
              location="Footer → Email"
              value={data.footer.email}
              maxLength={60}
              onChange={(val) => updateField("footer", "email", val)}
            />
            <FieldText
              label="Nomor Telepon / WA"
              location="Footer → Telepon Tampil"
              value={data.footer.phone}
              maxLength={30}
              onChange={(val) => updateField("footer", "phone", val)}
            />
            <FieldText
              label="Link WhatsApp (https://wa.me/...)"
              location="Footer → URL WA"
              value={data.footer.phoneWaLink}
              maxLength={150}
              onChange={(val) => updateField("footer", "phoneWaLink", val)}
            />
            <FieldText
              label="Lokasi Studio"
              location="Footer → Lokasi"
              value={data.footer.location}
              maxLength={50}
              onChange={(val) => updateField("footer", "location", val)}
            />
            <FieldText
              label="Link Instagram"
              location="Footer → Instagram URL"
              value={data.footer.instagram}
              maxLength={150}
              onChange={(val) => updateField("footer", "instagram", val)}
            />
            <FieldText
              label="Teks Hak Cipta (Copyright)"
              location="Footer → Copyright"
              value={data.footer.copyright}
              maxLength={80}
              onChange={(val) => updateField("footer", "copyright", val)}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ── HELPER ACCORDION COMPONENT ── */

function SectionCard({
  title,
  locationBadge,
  anchorHref,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  locationBadge: string;
  anchorHref: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121212] shadow-sm">
      <div
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-neutral-50/50 dark:bg-neutral-900/30 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-left">
          <h2 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-fit">
            {locationBadge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={anchorHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            title="Buka dan lihat section ini di halaman publik"
          >
            <span>Lihat di web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            aria-label={isOpen ? "Tutup accordion" : "Buka accordion"}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800">{children}</div>}
    </div>
  );
}

/* ── FORM FIELD COMPONENTS WITH CHARACTER COUNTERS ── */

function FieldText({
  label,
  location,
  value,
  maxLength = 100,
  onChange,
}: {
  label: string;
  location: string;
  value: string;
  maxLength?: number;
  onChange: (val: string) => void;
}) {
  const currentLen = (value || "").length;
  const isOver = currentLen > maxLength;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        <span
          className={`text-[11px] font-mono ${
            isOver ? "text-red-500 font-bold" : "text-neutral-400"
          }`}
        >
          {currentLen} / {maxLength}
        </span>
      </div>
      <input
        type="text"
        value={value || ""}
        maxLength={maxLength + 10}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
      />
      <p className="text-[10px] text-neutral-400">Lokasi: {location}</p>
    </div>
  );
}

function FieldTextarea({
  label,
  location,
  value,
  maxLength = 300,
  rows = 3,
  onChange,
}: {
  label: string;
  location: string;
  value: string;
  maxLength?: number;
  rows?: number;
  onChange: (val: string) => void;
}) {
  const currentLen = (value || "").length;
  const isOver = currentLen > maxLength;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        <span
          className={`text-[11px] font-mono ${
            isOver ? "text-red-500 font-bold" : "text-neutral-400"
          }`}
        >
          {currentLen} / {maxLength}
        </span>
      </div>
      <textarea
        rows={rows}
        value={value || ""}
        maxLength={maxLength + 20}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white resize-y"
      />
      <p className="text-[10px] text-neutral-400">Lokasi: {location}</p>
    </div>
  );
}

function FieldImage({
  label,
  location,
  value,
  altValue,
  onSelectImage,
  onAltChange,
}: {
  label: string;
  location: string;
  value: string;
  altValue?: string;
  onSelectImage: () => void;
  onAltChange?: (alt: string) => void;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        <span className="text-[10px] text-neutral-400">Lokasi: {location}</span>
      </div>

      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 shrink-0">
            <Image
              src={value}
              alt={altValue || label}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 text-neutral-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
            {value || "Belum ada foto yang dipilih"}
          </div>
          <button
            type="button"
            onClick={onSelectImage}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Pilih dari Media Library</span>
          </button>
        </div>
      </div>

      {onAltChange && altValue !== undefined && (
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
          <label className="block text-[11px] text-neutral-500 mb-1">
            Alt Text Gambar (Aksesibilitas & SEO)
          </label>
          <input
            type="text"
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 text-neutral-900 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
