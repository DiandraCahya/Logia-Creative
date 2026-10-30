"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileImage,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  FileText,
  ExternalLink,
  Sparkles,
  Search,
} from "lucide-react";
import { api, UploadResult, API_MEDIA_URL, getMediaUrl } from "@/lib/api";

interface BuiltInAsset {
  name: string;
  path: string;
  category: "Brand & Logo" | "Showcase" | "Testimoni" | "Visual Art";
  description: string;
}

const BUILT_IN_ASSETS: BuiltInAsset[] = [
  {
    name: "Logo 3D Logia",
    path: "/logo3d.webp",
    category: "Brand & Logo",
    description: "Ikon 3D utama Logia dengan pencahayaan oranye dan emas",
  },
  {
    name: "Logo Utama (Wordmark)",
    path: "/LOGO.webp",
    category: "Brand & Logo",
    description: "Logo tipografi resmi Logia Creative Agency",
  },
  {
    name: "Justicia (KWN Kelompok 2)",
    path: "/uploads/justicia.webp",
    category: "Showcase",
    description: "Cover proyek website kelompok KWN ruang digital (Tersimpan di Backend API)",
  },
  {
    name: "Miyawaki Sakura",
    path: "/uploads/miyawaki sakura.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien Bloom Cosmetics (Tersimpan di Backend API)",
  },
  {
    name: "Kim Chaewon",
    path: "/uploads/kim chaewon.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien Fim House (Tersimpan di Backend API)",
  },
  {
    name: "Pham Hanni",
    path: "/uploads/pham hanni.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien NewJean Studio (Tersimpan di Backend API)",
  },
  {
    name: "Hong Eunchae",
    path: "/uploads/hong eunchae.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien Starlet Agency (Tersimpan di Backend API)",
  },
  {
    name: "Hwang Ye-Ji",
    path: "/uploads/hwang ye-ji.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien ITZY Tech (Tersimpan di Backend API)",
  },
  {
    name: "Enami Asa",
    path: "/uploads/enami asa.webp",
    category: "Testimoni",
    description: "Avatar foto testimoni klien Monster Media (Tersimpan di Backend API)",
  },
  {
    name: "Luogia Art 2",
    path: "/LUOGIA2.webp",
    category: "Visual Art",
    description: "Artwork visual futuristik Logia Creative",
  },
  {
    name: "Luogia Art Banner",
    path: "/LUOGIA.webp",
    category: "Visual Art",
    description: "Header visual banner studio Logia",
  },
  {
    name: "Mode Gelap (Dark Wallpaper)",
    path: "/modeGelap.webp",
    category: "Visual Art",
    description: "Latar artistik bertema gelap dengan gradasi hangat",
  },
  {
    name: "Mode Terang (Light Wallpaper)",
    path: "/modeTerang.webp",
    category: "Visual Art",
    description: "Latar visual cerah bertema terang",
  },
];

export function MediaUploadTab() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assetCategory, setAssetCategory] = useState<string>("Semua");
  const [assetSearch, setAssetSearch] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      if (files.length === 1) {
        const res = await api.uploadFile(files[0]);
        setUploadedFiles((prev) => [res.data, ...prev]);
      } else {
        const fileArr = Array.from(files).slice(0, 10);
        const res = await api.uploadMultiple(fileArr);
        setUploadedFiles((prev) => [...(res.data || []), ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah file media.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredBuiltInAssets = BUILT_IN_ASSETS.filter((item) => {
    const matchesCat = assetCategory === "Semua" || item.category === assetCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      item.path.toLowerCase().includes(assetSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(assetSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-10 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
          Pusat Unggah File & Koleksi Media
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Unggah file baru ke backend Express atau gunakan koleksi aset bawaan Logia Creative.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all bg-black/[0.02] dark:bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer text-center group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.svg"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {uploading ? (
            <RefreshCw className="w-6 h-6 animate-spin text-[#ff4114]" />
          ) : (
            <UploadCloud className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
          )}
        </div>

        <p className="text-sm font-bold text-black dark:text-white mb-1">
          {uploading ? "Mengunggah berkas ke server..." : "Klik atau Seret Berkas ke Area Ini"}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
          Mendukung JPG, PNG, WEBP, GIF, SVG, dan PDF hingga 10MB per berkas. Dapat memilih hingga 10 berkas sekaligus.
        </p>
      </div>

      {/* Newly Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#ff4114]" />
            Berkas Baru Diunggah ({uploadedFiles.length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((f, i) => {
              const isCopied = copiedUrl === f.url;
              const isImg = f.mimetype.startsWith("image/");
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 flex items-center justify-center relative">
                      {isImg ? (
                        <img
                          src={f.url}
                          alt={f.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">
                        {f.originalName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                        <span>{formatSize(f.size)}</span>
                        <span>•</span>
                        <span>{f.mimetype}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 flex items-center justify-center"
                      title="Buka Berkas di Tab Baru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(f.url)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-xs font-semibold transition-colors ${
                        isCopied
                          ? "bg-green-500 text-white"
                          : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Salin URL
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Built-in Existing Assets Gallery Section */}
      <div className="space-y-5 pt-4 border-t border-black/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-black dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4114]" />
              Koleksi Aset Bawaan Logia Creative
            </h3>
            <p className="text-xs text-neutral-500">
              Aset lokal siap pakai di direktori <code className="font-mono text-neutral-700 dark:text-neutral-300">/public</code>. Klik tombol salin untuk menggunakan path pada formulir portofolio atau testimoni.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              placeholder="Cari aset bawaan..."
              className="w-full pl-9 pr-3 py-2 min-h-[38px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs text-black dark:text-white focus:outline-none focus:border-[#ff4114]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["Semua", "Brand & Logo", "Showcase", "Testimoni", "Visual Art"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setAssetCategory(cat)}
              className={`px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                assetCategory === cat
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBuiltInAssets.map((asset, idx) => {
            const isCopied = copiedUrl === asset.path;
            return (
              <div
                key={idx}
                className="group p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative mb-3 flex items-center justify-center p-2">
                    <img
                      src={getMediaUrl(asset.path)}
                      alt={asset.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/LOGO.png";
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">
                      {asset.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                      {asset.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 mb-2 line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 font-mono text-[10px] text-neutral-600 dark:text-neutral-400 truncate mb-3">
                    {asset.path}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.path)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-xs font-semibold transition-colors ${
                      isCopied
                        ? "bg-green-500 text-white"
                        : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Path Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Path
                      </>
                    )}
                  </button>

                  <a
                    href={getMediaUrl(asset.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 flex items-center justify-center"
                    title="Buka Berkas di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
