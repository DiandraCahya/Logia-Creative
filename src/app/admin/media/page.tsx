"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Check,
  Copy,
  Trash2,
  AlertCircle,
  Loader2,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  Crop,
  ArrowLeft,
} from "lucide-react";
import { processImageForUpload, type ProcessedImageResult } from "@/lib/cms/client-image";
import type { MediaItem } from "@/lib/cms/types";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [croppingMedia, setCroppingMedia] = useState<MediaItem | null>(null);

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processed, setProcessed] = useState<ProcessedImageResult | null>(null);
  const [altText, setAltText] = useState("");
  const [slugText, setSlugText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = async (file: File) => {
    setUploadError("");
    setUploadSuccess("");
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const res = await processImageForUpload(file);
      setProcessed(res);
      // Auto-populate slug from file name
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
      setSlugText(cleanName);
    } catch (err: any) {
      setUploadError(err.message || "Gagal memproses gambar.");
      setProcessed(null);
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processed || !selectedFile) {
      setUploadError("Pilih file gambar terlebih dahulu.");
      return;
    }
    if (!altText.trim()) {
      setUploadError("Teks alternatif (Alt text) wajib diisi untuk aksesibilitas.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", processed.blob, `${slugText || "photo"}.webp`);
      formData.append("alt", altText.trim());
      formData.append("slug", slugText.trim());
      formData.append("width", String(processed.width));
      formData.append("height", String(processed.height));

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadError(data.error || "Gagal mengunggah foto.");
        return;
      }

      setUploadSuccess("Foto berhasil dikompres dan diunggah!");
      // Reset form
      setSelectedFile(null);
      setProcessed(null);
      setAltText("");
      setSlugText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMedia();
    } catch {
      setUploadError("Terjadi kesalahan jaringan saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => {
      setCopiedPath((curr) => (curr === path ? null : curr));
    }, 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id, path: deleteTarget.path }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus foto.");
        return;
      }

      setDeleteTarget(null);
      fetchMedia();
    } catch {
      setDeleteError("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const q = search.toLowerCase();
    return (m.alt && m.alt.toLowerCase().includes(q)) || (m.path && m.path.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Galeri Foto &amp; Media
          </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Upload foto dengan optimasi WebP otomatis (maks 1600px, kualitas 0.8, batas 1MB).
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141414] self-start sm:self-auto">
            {mediaList.length} / 300 Foto
          </div>
        </div>

        {/* Uploader Section */}
        <div className="bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            <span>Unggah Foto Baru</span>
          </h2>

          {uploadError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {!processed ? (
            /* Drag and drop area */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {isProcessing ? "Mengompres gambar..." : "Klik atau seret file gambar ke sini"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Format: JPG, PNG, WebP, AVIF. Maksimal 1MB setelah dikompres. SVG dilarang.
              </p>
            </div>
          ) : (
            /* Preview & Details Form */
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Image Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={processed.previewUrl}
                    alt="Preview upload"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/75 text-white text-[11px] font-mono rounded">
                    {processed.width} &times; {processed.height} px &bull; {Math.round(processed.size / 1024)} KB
                  </div>
                </div>

                {/* Form Fields */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Alt Text (Wajib) *
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Jelaskan isi foto untuk aksesibilitas dan SEO"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Nama File / Slug (Opsional)
                    </label>
                    <input
                      type="text"
                      value={slugText}
                      onChange={(e) => setSlugText(e.target.value)}
                      placeholder="contoh: hero-banner"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Simpan Foto</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => {
                        setProcessed(null);
                        setSelectedFile(null);
                        setAltText("");
                        setSlugText("");
                      }}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari foto berdasarkan nama atau alt text..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400" />
            <p className="text-sm text-neutral-500 mt-2">Memuat galeri foto...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-2xl p-12 text-center">
            <ImageIcon className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {search ? "Tidak ada foto yang cocok dengan pencarian." : "Belum ada foto yang diunggah."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 border-b border-black/5 dark:border-white/10">
                  <Image
                    src={item.path}
                    alt={item.alt || "Foto"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>

                {/* Info & Actions */}
                <div className="p-3.5 flex flex-col flex-grow">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1" title={item.alt}>
                    {item.alt}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate mt-0.5" title={item.path}>
                    {item.path}
                  </p>

                  <div className="mt-2 text-[10px] text-neutral-400 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
                    <span>{item.width && item.height ? `${item.width}×${item.height}px` : "Foto"}</span>
                    <span>{item.size ? `${Math.round(item.size / 1024)} KB` : ""}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.path)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedPath === item.path ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Path</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCroppingMedia(item)}
                      title="Potong / Sesuaikan foto ini"
                      aria-label={`Potong foto ${item.alt}`}
                      className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Crop className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeleteTarget(item);
                      }}
                      title="Hapus foto"
                      aria-label={`Hapus foto ${item.alt}`}
                      className="p-1.5 rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up"
          >
            <div className="bg-white dark:bg-[#161616] border border-black/10 dark:border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Konfirmasi Hapus Foto
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                Apakah Anda yakin ingin menghapus foto <span className="font-semibold">{deleteTarget.alt}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setDeleteTarget(null);
                    setDeleteError("");
                  }}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-semibold hover:bg-red-700 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>{isDeleting ? "Menghapus..." : "Hapus Foto"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Cropper Modal */}
        {croppingMedia && (
          <ImageCropperModal
            isOpen={Boolean(croppingMedia)}
            onClose={() => setCroppingMedia(null)}
            imageUrl={croppingMedia.path}
            title={`Potong Foto: ${croppingMedia.alt}`}
            defaultAspect="16:9"
            onCropComplete={() => {
              setCroppingMedia(null);
              fetchMedia();
            }}
          />
        )}
    </div>
  );
}
