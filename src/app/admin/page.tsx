import React from "react";
import Link from "next/link";
import {
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Server,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getSite, getProjects, getPromos, getTestimonials, getRateCard, getMediaRegistry } from "@/lib/cms/content";
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Panel Kendali
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Sistem Terhubung
            </span>
          </div>

          <h1 className="font-righteous text-2xl sm:text-4xl text-black dark:text-white leading-tight">
            Selamat Datang di CMS Logia Creative
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            Kelola seluruh teks website, portofolio karya, paket harga rate card, testimoni klien, dan
            galeri foto dengan penyimpanan file mandiri tanpa layanan pihak ketiga.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
              {driverName === "github" ? (
                <GitBranch className="w-4 h-4 text-black dark:text-white" />
              ) : (
                <Server className="w-4 h-4 text-black dark:text-white" />
              )}
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 block">Driver Penyimpanan</span>
              <strong className="font-semibold text-black dark:text-white uppercase font-mono">
                {driverName}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400 block">Status Keamanan</span>
              <strong className="font-semibold text-black dark:text-white">
                Sesi HMAC Aktif (12 Jam)
              </strong>
            </div>
          </div>

          <Link
            href="/admin/publikasi"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <span>Pusat Publikasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Selected Work
          </span>
          <p className="text-2xl sm:text-3xl font-righteous text-black dark:text-white mt-1">
            {projects.length}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">Proyek terdaftar</span>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Rate Card
          </span>
          <p className="text-2xl sm:text-3xl font-righteous text-black dark:text-white mt-1">
            {totalPackages}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Paket dari {rateCard.solutions.length} solusi
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Testimoni Klien
          </span>
          <p className="text-2xl sm:text-3xl font-righteous text-black dark:text-white mt-1">
            {testimonials.testimonials.length}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">Ulasan aktif</span>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Galeri Media
          </span>
          <p className="text-2xl sm:text-3xl font-righteous text-black dark:text-white mt-1">
            {media.length}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">Foto terkompresi WebP</span>
        </div>
      </div>

      {/* Main Modules Grid */}
      <div>
        <h2 className="font-righteous text-lg text-black dark:text-white mb-4">
          Modul Pengelolaan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 1: Editor Teks */}
          <Link
            href="/admin/teks"
            className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="font-righteous text-lg text-black dark:text-white">
                Editor Teks Halaman
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Ubah seluruh salinan teks per section: Splash Screen, Navigasi, Hero, Background
                & Target Pasar, Profil Visi Misi, Layanan Kreatif & Teknis, hingga Footer.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Buka Editor Teks</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Module 2: Koleksi */}
          <Link
            href="/admin/koleksi"
            className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="font-righteous text-lg text-black dark:text-white">
                Pengelola Koleksi
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Kelola data terstruktur: kartu Selected Work (kategori, tag, link karya), promo
                diskon musiman, daftar testimoni klien, dan paket katalog harga Rate Card.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Buka Koleksi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Module 3: Galeri Media */}
          <Link
            href="/admin/media"
            className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="font-righteous text-lg text-black dark:text-white">
                Galeri Foto & Upload
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Unggah foto dengan kompresi Canvas otomatis (maks 1600px, WebP &lt; 1MB). Dilengkapi
                proteksi hapus aman agar foto yang masih aktif di halaman tidak terhapus.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Buka Galeri Foto</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Module 4: Publikasi */}
          <Link
            href="/admin/publikasi"
            className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111]/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h3 className="font-righteous text-lg text-black dark:text-white">
                Publikasi & Rilis
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Tinjau ringkasan perubahan, periksa konflik commit Git, dan rilis semua perubahan ke
                website publik secara atomik. Terdapat juga tombol darurat Reset ke Default Pabrik.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Buka Publikasi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Guide Workflow Section */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
        <h3 className="font-righteous text-sm text-black dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Cara Kerja CMS Logia Creative</span>
        </h3>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <li className="p-3 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-bold text-black dark:text-white block">1. Edit atau Tambah</span>
            <p>Ubah teks atau koleksi sesuai kebutuhan. Perubahan tersimpan di sesi editor.</p>
          </li>
          <li className="p-3 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-bold text-black dark:text-white block">2. Unggah Media</span>
            <p>Pilih atau upload foto WebP terkompresi langsung dari uploader terintegrasi.</p>
          </li>
          <li className="p-3 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-bold text-black dark:text-white block">3. Publikasikan</span>
            <p>Buka menu Publikasi dan klik rilis. Driver GitHub akan membuat commit atomik.</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
