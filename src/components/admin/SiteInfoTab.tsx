"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Save,
  RefreshCw,
  AlertCircle,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
} from "lucide-react";
import { api, SiteInfo } from "@/lib/api";

export function SiteInfoTab() {
  const [data, setData] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSiteInfo();
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat informasi website.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field: keyof SiteInfo, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleContactChange = (field: keyof SiteInfo["contact"], value: string) => {
    if (!data) return;
    setData({
      ...data,
      contact: {
        ...data.contact,
        [field]: value,
      },
    });
  };

  const handleSocialChange = (field: keyof SiteInfo["socials"], value: string) => {
    if (!data) return;
    setData({
      ...data,
      socials: {
        ...data.socials,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.updateSiteInfo(data);
      setData(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan perubahan informasi website.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <p className="text-sm text-neutral-500">Memuat informasi website...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
        <button onClick={loadData} className="underline text-sm font-semibold">Coba lagi</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Informasi Website, Hero & Kontak
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Konfigurasi teks brand, hero headline, info narahubung, dan tautan sosial media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {success && (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-semibold">
              <Check className="w-4 h-4" />
              Tersimpan
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Brand & Hero Section */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <h3 className="text-base font-bold text-black dark:text-white pb-2 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#ff4114]" />
          Identitas Brand & Hero Header
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Nama Brand
            </label>
            <input
              type="text"
              value={data.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              required
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Tagline Singkat
            </label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Hero Headline (Teks Utama)
            </label>
            <input
              type="text"
              value={data.heroHeadline}
              onChange={(e) => handleChange("heroHeadline", e.target.value)}
              required
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Hero Subheadline
            </label>
            <input
              type="text"
              value={data.heroSubheadline}
              onChange={(e) => handleChange("heroSubheadline", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Deskripsi Singkat Hero
            </label>
            <textarea
              value={data.heroDescription}
              onChange={(e) => handleChange("heroDescription", e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Label Tombol Kolaborasi (CTA Primary)
            </label>
            <input
              type="text"
              value={data.ctaPrimaryText}
              onChange={(e) => handleChange("ctaPrimaryText", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Label Tombol Portofolio (CTA Secondary)
            </label>
            <input
              type="text"
              value={data.ctaSecondaryText}
              onChange={(e) => handleChange("ctaSecondaryText", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <h3 className="text-base font-bold text-black dark:text-white pb-2 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#ff4114]" />
          Kontak & Alamat Agensi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Email Resmi
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              WhatsApp Resmi (Format Angka Internasional, contoh: 6281234567890)
            </label>
            <input
              type="text"
              value={data.contact.whatsapp}
              onChange={(e) => handleContactChange("whatsapp", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Nomor Telepon Tampilan
            </label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Jam Operasional
            </label>
            <input
              type="text"
              value={data.contact.officeHours}
              onChange={(e) => handleContactChange("officeHours", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Alamat Studio / Lokasi
            </label>
            <input
              type="text"
              value={data.contact.address}
              onChange={(e) => handleContactChange("address", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>
        </div>
      </div>

      {/* Social Media & Footer */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
        <h3 className="text-base font-bold text-black dark:text-white pb-2 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#ff4114]" />
          Tautan Sosial Media & Footer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Instagram URL
            </label>
            <input
              type="url"
              value={data.socials.instagram}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={data.socials.linkedin}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              GitHub URL
            </label>
            <input
              type="url"
              value={data.socials.github}
              onChange={(e) => handleSocialChange("github", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              value={data.socials.website}
              onChange={(e) => handleSocialChange("website", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Teks Hak Cipta Footer
            </label>
            <input
              type="text"
              value={data.footerText}
              onChange={(e) => handleChange("footerText", e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
