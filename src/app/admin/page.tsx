import React from "react";
import Link from "next/link";
import {
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Send,
  ArrowRight,
  Server,
  GitBranch,
  ShieldCheck,
  Receipt,
  ExternalLink,
  Layers,
  Tag,
  MessageSquareQuote,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { getProjects, getPromos, getTestimonials, getRateCard, getMediaRegistry } from "@/lib/cms/content";
import { getStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const store = getStore();
  const driverName = store.driverName;

  const [projects, promos, testimonials, rateCard, media] = await Promise.all([
    getProjects().catch(() => []),
    getPromos().catch(() => []),
    getTestimonials().catch(() => ({ sectionTitle: "", testimonials: [] })),
    getRateCard().catch(() => ({ solutions: [], terms: [] })),
    getMediaRegistry().catch(() => []),
  ]);

  const totalPackages = rateCard.solutions.reduce(
    (acc, s) => acc + (s.packages ? s.packages.length : 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Workspace Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-semibold">
                Panel Kendali
              </span>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Logia Creative CMS
              </span>
            </div>

            <h1 className="font-righteous text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-100 leading-tight">
              Pusat Pengelolaan Konten & Administrasi
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kelola salinan teks website, portofolio karya, paket harga rate card, testimoni klien,
              galeri foto terkompresi WebP, dan cetak invoice resmi Logia Creative.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/publikasi"
              className="inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pusat Publikasi & Rilis</span>
            </Link>
          </div>
        </div>

        {/* System Meta Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              {driverName === "github" ? (
                <GitBranch className="w-4 h-4" />
              ) : (
                <Server className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                Driver Penyimpanan
              </span>
              <strong className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 uppercase">
                {driverName === "github" ? "GitHub API (Produksi)" : "Sistem File Lokal"}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                Keamanan Sesi
              </span>
              <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                HMAC SHA-256 (Masa Aktif 12 Jam)
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 md:col-span-1">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                Penyimpanan Mandiri
              </span>
              <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                Bebas Vendor Lock-in (Zero DB Eksternal)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Summary (Clickable Shortcuts) */}
      <section aria-labelledby="inventory-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="inventory-heading" className="font-righteous text-base text-neutral-900 dark:text-neutral-100">
            Ringkasan Konten & Data
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Klik kartu untuk langsung mengedit bagian terkait
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Selected Work */}
          <Link
            href="/admin/koleksi?tab=projects"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Karya</span>
              <FolderKanban className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                {projects.length}
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Proyek terdaftar
              </span>
            </div>
          </Link>

          {/* Card 2: Rate Card */}
          <Link
            href="/admin/koleksi?tab=rate-card"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Rate Card</span>
              <CreditCard className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                {totalPackages}
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5 truncate">
                {rateCard.solutions.length} Solusi layanan
              </span>
            </div>
          </Link>

          {/* Card 3: Testimoni */}
          <Link
            href="/admin/koleksi?tab=testimonials"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Testimoni</span>
              <MessageSquareQuote className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                {testimonials.testimonials.length}
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Ulasan klien
              </span>
            </div>
          </Link>

          {/* Card 4: Promo */}
          <Link
            href="/admin/koleksi?tab=promos"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Promo</span>
              <Tag className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                {promos.length}
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Penawaran aktif
              </span>
            </div>
          </Link>

          {/* Card 5: Galeri Media */}
          <Link
            href="/admin/media"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Media</span>
              <ImageIcon className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                {media.length}
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Foto WebP
              </span>
            </div>
          </Link>

          {/* Card 6: Invoice */}
          <Link
            href="/admin/invoice"
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Invoice</span>
              <Receipt className="w-4 h-4 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-righteous text-neutral-900 dark:text-neutral-100">
                Figma
              </p>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Format resmi PDF
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Primary Management Modules (Grid 5 Modules) */}
      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="font-righteous text-base text-neutral-900 dark:text-neutral-100 mb-4">
          Modul Pengelolaan Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: Editor Teks */}
          <Link
            href="/admin/teks"
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-righteous text-lg text-neutral-900 dark:text-neutral-100">
                  Editor Teks Halaman
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Perbarui salinan teks per section website: Splash Screen, Navigasi, Hero, Target Pasar,
                  Profil Visi Misi, Layanan Kreatif & Teknis, hingga Footer.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Buka Editor Teks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Koleksi */}
          <Link
            href="/admin/koleksi"
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-righteous text-lg text-neutral-900 dark:text-neutral-100">
                  Pengelola Koleksi
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Kelola data berulang: portofolio Selected Work (kategori, tag, link karya), penawaran
                  promo musiman, ulasan testimoni klien, dan katalog paket harga Rate Card.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Buka Koleksi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Galeri Media */}
          <Link
            href="/admin/media"
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-righteous text-lg text-neutral-900 dark:text-neutral-100">
                  Galeri Foto & Upload
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Unggah foto dengan kompresi Canvas otomatis (maks 1600px, WebP &lt; 1MB). Dilengkapi
                  proteksi hapus aman agar media yang aktif di situs tidak terhapus.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Buka Galeri Foto</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: Invoice Generator */}
          <Link
            href="/admin/invoice"
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-righteous text-lg text-neutral-900 dark:text-neutral-100">
                  Generator Invoice Resmi
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Buat dan cetak invoice resmi klien berstandar desain Figma Logia Creative. Dilengkapi
                  perhitungan otomatis DP 50% atau Lunas, preset bank pembayaran, dan ekspor PDF.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Buka Generator Invoice</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 5: Publikasi & Rilis */}
          <Link
            href="/admin/publikasi"
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group flex flex-col justify-between shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white lg:col-span-2"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-righteous text-lg text-neutral-900 dark:text-neutral-100">
                  Pusat Publikasi & Git Sync
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Tinjau ringkasan perubahan yang belum dirilis, periksa status SHA repository GitHub untuk
                  mencegah penimpaan data (race condition), dan rilis pembaruan ke website publik secara
                  atomik. Tersedia juga opsi reset darurat ke default pabrik jika diperlukan.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Buka Pusat Publikasi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Operational Note */}
      <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">
            Penyimpanan Data Atomik
          </strong>
          Semua perubahan yang disimpan di editor akan dicatat dalam format JSON di content/. Rilis publikasi
          melalui menu Publikasi untuk menerapkannya langsung ke website publik.
        </div>
        <Link
          href="/admin/publikasi"
          className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100 hover:underline shrink-0 min-h-[44px]"
        >
          <span>Tinjau Perubahan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
