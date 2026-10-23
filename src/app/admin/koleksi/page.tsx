"use client";

import React, { useCallback, useEffect, useState, useTransition, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  FolderKanban,
  Tag,
  MessageSquareQuote,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Info,
  Save,
  RotateCcw,
  Star,
  Calendar,
  ImageIcon,
  X,
  Crop,
  ArrowLeft,
  ExternalLink,
  Globe,
} from "lucide-react";
import type {
  ProjectItem,
  PromoItem,
  TestimonialItem,
  TestimonialsContent,
  RateCardContent,
  RatePackageItem,
} from "@/lib/cms/types";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { ImageCropperModal, type AspectRatioOption } from "@/components/admin/ImageCropperModal";

type ActiveTab = "projects" | "promos" | "testimonials" | "rate-card";

interface ToastState {
  type: "success" | "error" | "info";
  message: string;
}

function KoleksiContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ActiveTab | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (tabParam && ["projects", "promos", "testimonials", "rate-card"].includes(tabParam)) {
      return tabParam;
    }
    return "projects";
  });

  useEffect(() => {
    if (tabParam && ["projects", "promos", "testimonials", "rate-card"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState | null>(null);

  // Collections state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [testimonialsContent, setTestimonialsContent] = useState<TestimonialsContent | null>(null);
  const [rateCardContent, setRateCardContent] = useState<RateCardContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTargetCallback, setMediaTargetCallback] = useState<((path: string) => void) | null>(null);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const [cropperAspect, setCropperAspect] = useState<AspectRatioOption>("16:9");
  const [cropperCallback, setCropperCallback] = useState<((url: string) => void) | null>(null);

  const openCropper = (
    src: string,
    callback: (url: string) => void,
    defaultAspect: AspectRatioOption = "16:9"
  ) => {
    setCropperImage(src);
    setCropperAspect(defaultAspect);
    setCropperCallback(() => callback);
    setCropperOpen(true);
  };

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<{
    solutionId: string;
    item: RatePackageItem;
  } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: string;
    id: string;
    title: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const loadAllCollections = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, prRes, tRes, rRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/promos"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/rate-card"),
      ]);

      const [pData, prData, tData, rData] = await Promise.all([
        pRes.json(),
        prRes.json(),
        tRes.json(),
        rRes.json(),
      ]);

      if (pData.data) setProjects(pData.data);
      if (prData.data) setPromos(prData.data);
      if (tData.data) setTestimonialsContent(tData.data);
      if (rData.data) setRateCardContent(rData.data);
    } catch {
      showToast("error", "Gagal memuat beberapa data koleksi.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAllCollections();
  }, [loadAllCollections]);

  // Save collections API calls
  const saveProjects = (updated: ProjectItem[]) => {
    setProjects(updated);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error("Gagal menyimpan proyek.");
        showToast("success", "Koleksi proyek berhasil diperbarui.");
      } catch (err: any) {
        showToast("error", err.message);
      }
    });
  };

  const savePromos = (updated: PromoItem[]) => {
    setPromos(updated);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/promos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error("Gagal menyimpan promo.");
        showToast("success", "Daftar promo berhasil diperbarui.");
      } catch (err: any) {
        showToast("error", err.message);
      }
    });
  };

  const saveTestimonials = (updated: TestimonialsContent) => {
    setTestimonialsContent(updated);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error("Gagal menyimpan testimoni.");
        showToast("success", "Daftar testimoni berhasil diperbarui.");
      } catch (err: any) {
        showToast("error", err.message);
      }
    });
  };

  const saveRateCard = (updated: RateCardContent) => {
    setRateCardContent(updated);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/rate-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error("Gagal menyimpan rate card.");
        showToast("success", "Rate card berhasil diperbarui.");
      } catch (err: any) {
        showToast("error", err.message);
      }
    });
  };

  const openMediaPicker = (cb: (path: string) => void) => {
    setMediaTargetCallback(() => cb);
    setMediaPickerOpen(true);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-500">Memuat data koleksi...</p>
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

      {/* Header */}
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
            Pengelola Koleksi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kelola Portofolio, Promo, Testimoni Klien, dan Paket Layanan Rate Card.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAllCollections}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
        </div>
      </div>

      {/* Collection Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <TabButton
          active={activeTab === "projects"}
          onClick={() => setActiveTab("projects")}
          icon={FolderKanban}
          label="Portofolio (Selected Work)"
          count={projects.length}
        />
        <TabButton
          active={activeTab === "promos"}
          onClick={() => setActiveTab("promos")}
          icon={Tag}
          label="Promo & Penawaran"
          count={promos.length}
        />
        <TabButton
          active={activeTab === "testimonials"}
          onClick={() => setActiveTab("testimonials")}
          icon={MessageSquareQuote}
          label="Testimoni"
          count={testimonialsContent?.testimonials.length || 0}
        />
        <TabButton
          active={activeTab === "rate-card"}
          onClick={() => setActiveTab("rate-card")}
          icon={CreditCard}
          label="Rate Card & Paket"
          count={rateCardContent?.solutions.length || 0}
        />
      </div>

      {/* TAB 1: PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Daftar Portofolio Proyek ({projects.length})
            </h2>
            <button
              onClick={() => {
                setEditingProject({
                  id: `project-${Date.now()}`,
                  title: "",
                  category: "Web Development",
                  image: "",
                  description: "",
                  tags: ["Next.js", "Design"],
                  fit: "cover",
                  focalPoint: "center",
                  featured: true,
                  link: "",
                });
                setProjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-sm flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title.replace(/\n/g, " ")}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={p.fit === "contain" || p.figure ? "object-contain p-2" : "object-cover"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-white">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Unggulan</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 whitespace-pre-line leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                    {p.link && (
                      <div className="pt-2">
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline transition-colors"
                          title={p.link}
                        >
                          <Globe className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{p.link.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...projects];
                        const temp = copy[idx - 1];
                        copy[idx - 1] = copy[idx];
                        copy[idx] = temp;
                        saveProjects(copy);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === projects.length - 1}
                      onClick={() => {
                        const copy = [...projects];
                        const temp = copy[idx + 1];
                        copy[idx + 1] = copy[idx];
                        copy[idx] = temp;
                        saveProjects(copy);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const copy = [...projects];
                        copy[idx].featured = !copy[idx].featured;
                        saveProjects(copy);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                        p.featured
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-500"
                      }`}
                    >
                      {p.featured ? "Showcase On" : "Showcase Off"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setProjectModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      title="Sunting Proyek"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          type: "proyek",
                          id: p.id,
                          title: p.title.replace(/\n/g, " "),
                          onConfirm: () => {
                            const updated = projects.filter((item) => item.id !== p.id);
                            saveProjects(updated);
                            setDeleteConfirm(null);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-red-500/10 hover:border-red-500/30 text-red-500"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMOS */}
      {activeTab === "promos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Daftar Promo Aktif & Mendatang ({promos.length})
            </h2>
            <button
              onClick={() => {
                setEditingPromo({
                  id: `promo-${Date.now()}`,
                  title: "",
                  description: "",
                  code: "LOGIAPROMO",
                  discount: "Diskon 10%",
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                  active: true,
                  link: "#pricing",
                });
                setPromoModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Promo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map((pr, idx) => (
              <div
                key={pr.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        pr.active
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {pr.active ? "Aktif" : "Non-aktif"}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {pr.code || "Tanpa Kode"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                    {pr.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {pr.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Diskon: {pr.discount || "-"}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {pr.startDate} s/d {pr.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <button
                    onClick={() => {
                      const copy = [...promos];
                      copy[idx].active = !copy[idx].active;
                      savePromos(copy);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      pr.active
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-neutral-300 dark:border-neutral-700 text-neutral-500"
                    }`}
                  >
                    {pr.active ? "Aktif (Klik utk Matikan)" : "Non-aktif (Klik utk Nyalakan)"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingPromo(pr);
                        setPromoModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      title="Sunting Promo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          type: "promo",
                          id: pr.id,
                          title: pr.title,
                          onConfirm: () => {
                            const updated = promos.filter((item) => item.id !== pr.id);
                            savePromos(updated);
                            setDeleteConfirm(null);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-red-500/10 hover:border-red-500/30 text-red-500"
                      title="Hapus Promo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TESTIMONIALS */}
      {activeTab === "testimonials" && testimonialsContent && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Daftar Testimoni Klien ({testimonialsContent.testimonials.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-neutral-500">Judul Section:</span>
                <input
                  type="text"
                  value={testimonialsContent.sectionTitle}
                  onChange={(e) => {
                    const updated = {
                      ...testimonialsContent,
                      sectionTitle: e.target.value,
                    };
                    saveTestimonials(updated);
                  }}
                  className="px-2.5 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setEditingTestimonial({
                  id: `testi-${Date.now()}`,
                  quote: "",
                  author: "",
                  role: "Client",
                  image: "",
                  alt: "",
                  active: true,
                });
                setTestimonialModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Testimoni</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonialsContent.testimonials.map((t, idx) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.alt || t.author}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                        {t.author}
                      </h4>
                      <p className="text-xs text-neutral-500 truncate">{t.role || "Klien"}</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 italic line-clamp-3">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...testimonialsContent.testimonials];
                        const temp = copy[idx - 1];
                        copy[idx - 1] = copy[idx];
                        copy[idx] = temp;
                        saveTestimonials({ ...testimonialsContent, testimonials: copy });
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === testimonialsContent.testimonials.length - 1}
                      onClick={() => {
                        const copy = [...testimonialsContent.testimonials];
                        const temp = copy[idx + 1];
                        copy[idx + 1] = copy[idx];
                        copy[idx] = temp;
                        saveTestimonials({ ...testimonialsContent, testimonials: copy });
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-20 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const copy = [...testimonialsContent.testimonials];
                        copy[idx].active = !copy[idx].active;
                        saveTestimonials({ ...testimonialsContent, testimonials: copy });
                      }}
                      className={`px-2 py-1 text-[11px] rounded-lg border ${
                        t.active
                          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : "border-neutral-200 text-neutral-400"
                      }`}
                    >
                      {t.active ? "Aktif" : "Mati"}
                    </button>
                    <button
                      onClick={() =>
                        openCropper(
                          t.image || "",
                          (path) => {
                            const copy = [...testimonialsContent.testimonials];
                            copy[idx].image = path;
                            saveTestimonials({ ...testimonialsContent, testimonials: copy });
                            showToast("success", "Foto testimoni berhasil dipotong!");
                          },
                          "1:1"
                        )
                      }
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Potong Foto Avatar (1:1)"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTestimonial(t);
                        setTestimonialModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          type: "testimoni",
                          id: t.id,
                          title: t.author,
                          onConfirm: () => {
                            const updated = testimonialsContent.testimonials.filter(
                              (item) => item.id !== t.id
                            );
                            saveTestimonials({ ...testimonialsContent, testimonials: updated });
                            setDeleteConfirm(null);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-red-500/10 hover:border-red-500/30 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RATE CARD */}
      {activeTab === "rate-card" && rateCardContent && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Solusi & Paket Layanan (Rate Card)
              </h2>
              <p className="text-xs text-neutral-500">
                Kelola paket harga, bullet points fitur, dan syarat ketentuan pemesanan.
              </p>
            </div>
          </div>

          {/* Solutions & Packages */}
          <div className="space-y-8">
            {rateCardContent.solutions.map((sol) => (
              <div
                key={sol.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                      {sol.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPackage({
                        solutionId: sol.id,
                        item: {
                          id: `${sol.id}-package-${Date.now()}`,
                          name: "",
                          tagline: "",
                          price: 500000,
                          unit: "project",
                          items: ["Fitur utama paket", "Revisi 2x"],
                        },
                      });
                      setPackageModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Paket</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sol.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                            {pkg.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100">
                            Rp {pkg.price.toLocaleString("id-ID")}
                            <span className="text-[10px] text-neutral-400 font-normal">
                              /{pkg.unit}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">{pkg.tagline}</p>

                        <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                          {pkg.items.slice(0, 4).map((item, i) => (
                            <li key={i} className="truncate">
                              {item}
                            </li>
                          ))}
                          {pkg.items.length > 4 && (
                            <li className="text-[11px] text-neutral-400 list-none">
                              +{pkg.items.length - 4} butir lainnya
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => {
                            setEditingPackage({
                              solutionId: sol.id,
                              item: pkg,
                            });
                            setPackageModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          Sunting Paket
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              type: "paket layanan",
                              id: pkg.id,
                              title: pkg.name,
                              onConfirm: () => {
                                const updatedSolutions = rateCardContent.solutions.map((s) => {
                                  if (s.id !== sol.id) return s;
                                  return {
                                    ...s,
                                    packages: s.packages.filter((p) => p.id !== pkg.id),
                                  };
                                });
                                saveRateCard({ ...rateCardContent, solutions: updatedSolutions });
                                setDeleteConfirm(null);
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT/ADD PROJECT ── */}
      {projectModalOpen && editingProject && (
        <ModalWrapper
          title={editingProject.title ? "Sunting Proyek" : "Tambah Proyek Baru"}
          onClose={() => setProjectModalOpen(false)}
          maxWidth="max-w-4xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingProject.title || !editingProject.image || !editingProject.description) {
                showToast("error", "Judul, gambar, dan deskripsi wajib diisi.");
                return;
              }
              const exists = projects.some((p) => p.id === editingProject.id);
              const updated = exists
                ? projects.map((p) => (p.id === editingProject.id ? editingProject : p))
                : [editingProject, ...projects];
              saveProjects(updated);
              setProjectModalOpen(false);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Informasi Proyek (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Judul Proyek */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Judul Proyek
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Enter untuk baris baru
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    required
                    placeholder="Contoh: Revitalisasi Identitas Nusantara"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-y"
                  />
                </div>

                {/* Kategori & Status Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Kategori
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Branding">Branding</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Status Showcase
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({ ...editingProject, featured: !editingProject.featured })
                      }
                      className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border flex items-center justify-between transition-all ${
                        editingProject.featured
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500"
                      }`}
                    >
                      <span>Tampil di Galeri Utama</span>
                      <span className={`w-2 h-2 rounded-full ${editingProject.featured ? "bg-amber-500" : "bg-neutral-400"}`} />
                    </button>
                  </div>
                </div>

                {/* Tautan Proyek Live */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Tautan Proyek Live (Opsional)
                    </label>
                    {editingProject.link && (
                      <a
                        href={editingProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
                      >
                        <span>Uji Tautan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Globe className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="url"
                      value={editingProject.link || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, link: e.target.value })
                      }
                      placeholder="https://contoh-karya.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-mono text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Bila diisi, tombol &ldquo;Kunjungi Proyek&rdquo; akan aktif di panggung Selected Work dan galeri arsip.
                  </p>
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    required
                    placeholder="Jelaskan ringkasan proyek dan nilai tambah yang diberikan..."
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                    Tags Keahlian (Dipisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={editingProject.tags.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Logo Design, Identity, Brand Book"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-mono text-xs"
                  />
                </div>
              </div>

              {/* Kolom Kanan: Media, Pengaturan Crop & Pratinjau Selected Work (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#151515] space-y-4">
                  {/* Foto Input & Crop Actions */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                      Foto Karya
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingProject.image}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, image: e.target.value })
                          }
                          required
                          placeholder="/uploads/..."
                          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono min-w-0"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((path) => setEditingProject({ ...editingProject, image: path }))
                          }
                          className="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer transition-colors shrink-0"
                        >
                          Pilih
                        </button>
                      </div>

                      {/* Tombol Crop Khusus 3:4 & Bebas */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={!editingProject.image}
                          onClick={() =>
                            openCropper(
                              editingProject.image || "",
                              (path) => {
                                setEditingProject({ ...editingProject, image: path });
                                showToast("success", "Foto berhasil dipotong untuk Selected Work!");
                              },
                              "3:4"
                            )
                          }
                          className="px-3 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-40 cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          title="Potong foto dengan rasio vertikal 3:4 pas untuk Selected Work"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>Crop 3:4</span>
                        </button>
                        <button
                          type="button"
                          disabled={!editingProject.image}
                          onClick={() =>
                            openCropper(
                              editingProject.image || "",
                              (path) => {
                                setEditingProject({ ...editingProject, image: path });
                                showToast("success", "Foto berhasil dipotong!");
                              },
                              "16:9"
                            )
                          }
                          className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-neutral-800 dark:text-neutral-200"
                          title="Potong dengan rasio lain atau rasio bebas"
                        >
                          <span>Crop Lain...</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pengaturan Mode Tampilan di Selected Work */}
                  <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                        Mode Tampilan Kartu
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/60 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              fit: "cover",
                              figure: false,
                            })
                          }
                          className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            editingProject.fit !== "contain" && !editingProject.figure
                              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                          }`}
                        >
                          Penuhi (Cover)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              fit: "contain",
                              figure: false,
                            })
                          }
                          className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            editingProject.fit === "contain" && !editingProject.figure
                              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                          }`}
                        >
                          Utuh (Contain)
                        </button>
                      </div>
                    </div>

                    {/* Titik Fokus Pemotongan */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          Titik Fokus Pemotongan
                        </label>
                        <span className="text-[10px] text-neutral-500">
                          Focal Point
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "top", label: "Atas (Wajah)" },
                          { id: "center", label: "Tengah" },
                          { id: "bottom", label: "Bawah" },
                          { id: "left", label: "Kiri" },
                          { id: "right", label: "Kanan" },
                        ].map((fp) => {
                          const currentFp = editingProject.focalPoint || "center";
                          const isSelected = currentFp === fp.id;
                          return (
                            <button
                              key={fp.id}
                              type="button"
                              onClick={() =>
                                setEditingProject({
                                  ...editingProject,
                                  focalPoint: fp.id as "center" | "top" | "bottom" | "left" | "right",
                                })
                              }
                              className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                                isSelected
                                  ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm"
                                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              }`}
                            >
                              {fp.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                        Pilih <strong>Atas (Wajah)</strong> untuk foto potret/manusia agar bagian wajah tidak terpotong.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProject.figure)}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            figure: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Figur maskot transparan (khusus cut-out PNG)
                      </span>
                    </label>
                  </div>

                  {/* Pratinjau Mini Kartu Selected Work */}
                  <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Pratinjau Kartu (3:4)
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Live Preview
                      </span>
                    </div>

                    <div className="w-40 h-52 relative rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-900 shadow-md shrink-0 flex flex-col justify-between p-3">
                      {editingProject.image ? (
                        <>
                          {editingProject.fit === "contain" && !editingProject.figure && (
                            <Image
                              src={editingProject.image}
                              alt=""
                              aria-hidden
                              fill
                              sizes="160px"
                              className="object-cover blur-md scale-125 opacity-40 brightness-75 pointer-events-none"
                            />
                          )}
                          <Image
                            src={editingProject.image}
                            alt="Pratinjau"
                            fill
                            sizes="160px"
                            className={
                              editingProject.fit === "contain"
                                ? "object-contain p-2 relative z-10"
                                : editingProject.figure
                                ? "object-contain p-2 relative z-10"
                                : "object-cover relative z-10"
                            }
                            style={{
                              objectPosition: editingProject.figure
                                ? "50% 100%"
                                : editingProject.fit === "contain"
                                ? "50% 50%"
                                : editingProject.focalPoint === "top"
                                ? "50% 15%"
                                : editingProject.focalPoint === "bottom"
                                ? "50% 85%"
                                : editingProject.focalPoint === "left"
                                ? "15% 50%"
                                : editingProject.focalPoint === "right"
                                ? "85% 50%"
                                : "50% 50%",
                            }}
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs text-center p-2">
                          Belum ada foto dipilih
                        </div>
                      )}
                      <div className="relative z-20">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                          {editingProject.category || "Kategori"}
                        </span>
                      </div>
                      <div className="relative z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent -mx-3 -mb-3 p-2.5 pt-4">
                        <p className="text-white text-xs font-bold truncate">
                          {editingProject.title ? editingProject.title.replace(/\n/g, " ") : "Judul Proyek"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Simpan Proyek
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── MODAL: EDIT/ADD PROMO ── */}
      {promoModalOpen && editingPromo && (
        <ModalWrapper
          title={editingPromo.title ? "Sunting Promo" : "Tambah Promo Baru"}
          onClose={() => setPromoModalOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingPromo.title || !editingPromo.startDate || !editingPromo.endDate) {
                showToast("error", "Judul dan tanggal wajib diisi.");
                return;
              }
              const exists = promos.some((p) => p.id === editingPromo.id);
              const updated = exists
                ? promos.map((p) => (p.id === editingPromo.id ? editingPromo : p))
                : [editingPromo, ...promos];
              savePromos(updated);
              setPromoModalOpen(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Judul Promo
              </label>
              <input
                type="text"
                value={editingPromo.title}
                onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Kode Promo (Kupon)
                </label>
                <input
                  type="text"
                  value={editingPromo.code || ""}
                  onChange={(e) => setEditingPromo({ ...editingPromo, code: e.target.value })}
                  placeholder="LOGIALAUNCH"
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Potongan / Diskon
                </label>
                <input
                  type="text"
                  value={editingPromo.discount || ""}
                  onChange={(e) => setEditingPromo({ ...editingPromo, discount: e.target.value })}
                  placeholder="Rp 50.000 atau 20%"
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={editingPromo.startDate}
                  onChange={(e) => setEditingPromo({ ...editingPromo, startDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tanggal Berakhir
                </label>
                <input
                  type="date"
                  value={editingPromo.endDate}
                  onChange={(e) => setEditingPromo({ ...editingPromo, endDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Keterangan Promo
              </label>
              <textarea
                rows={2}
                value={editingPromo.description}
                onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black"
              >
                Simpan Promo
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── MODAL: EDIT/ADD TESTIMONIAL ── */}
      {testimonialModalOpen && editingTestimonial && (
        <ModalWrapper
          title={editingTestimonial.author ? "Sunting Testimoni" : "Tambah Testimoni Baru"}
          onClose={() => setTestimonialModalOpen(false)}
          maxWidth="max-w-2xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                !editingTestimonial.author ||
                !editingTestimonial.quote ||
                !editingTestimonial.image
              ) {
                showToast("error", "Nama, kutipan, dan foto wajib diisi.");
                return;
              }
              if (!testimonialsContent) return;
              const exists = testimonialsContent.testimonials.some(
                (t) => t.id === editingTestimonial.id
              );
              const updatedList = exists
                ? testimonialsContent.testimonials.map((t) =>
                    t.id === editingTestimonial.id ? editingTestimonial : t
                  )
                : [editingTestimonial, ...testimonialsContent.testimonials];
              saveTestimonials({ ...testimonialsContent, testimonials: updatedList });
              setTestimonialModalOpen(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Nama Pemberi Testimoni
                </label>
                <input
                  type="text"
                  value={editingTestimonial.author}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, author: e.target.value })
                  }
                  required
                  placeholder="Contoh: Alex Pratama"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Jabatan / Perusahaan
                </label>
                <input
                  type="text"
                  value={editingTestimonial.role || ""}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                  }
                  placeholder="Founder, Studio Nusantara"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                />
              </div>
            </div>

            {/* Foto Klien & Opsi Pemotongan */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Foto Profil Klien
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {editingTestimonial.image && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 bg-neutral-100 dark:bg-neutral-800 ring-2 ring-[var(--accent-bronze)]">
                      <Image
                        src={editingTestimonial.image}
                        alt="Foto Klien"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingTestimonial.image}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, image: e.target.value })
                    }
                    required
                    placeholder="/uploads/..."
                    className="flex-1 px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono text-xs min-w-0"
                  />
                </div>
                <div className="flex items-center flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((path) =>
                        setEditingTestimonial({ ...editingTestimonial, image: path })
                      )
                    }
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Pilih Media
                  </button>
                  <button
                    type="button"
                    disabled={!editingTestimonial.image}
                    onClick={() =>
                      openCropper(
                        editingTestimonial.image || "",
                        (path) => {
                          setEditingTestimonial({ ...editingTestimonial, image: path });
                          showToast("success", "Foto avatar berhasil dipotong (1:1)!");
                        },
                        "1:1"
                      )
                    }
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-40 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                    title="Potong foto profil klien menjadi persegi lingkaran 1:1"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Crop Avatar (1:1)</span>
                  </button>
                  <button
                    type="button"
                    disabled={!editingTestimonial.image}
                    onClick={() =>
                      openCropper(
                        editingTestimonial.image || "",
                        (path) => {
                          setEditingTestimonial({ ...editingTestimonial, image: path });
                          showToast("success", "Foto berhasil dipotong!");
                        },
                        "free"
                      )
                    }
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 whitespace-nowrap cursor-pointer transition-colors"
                    title="Potong foto dengan rasio bebas"
                  >
                    <span>Crop Bebas...</span>
                  </button>
                </div>
              </div>

              {/* Pratinjau Live Avatar & Testimoni */}
              {editingTestimonial.image && (
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 ring-2 ring-[var(--accent-bronze)]">
                    <Image
                      src={editingTestimonial.image}
                      alt="Pratinjau Avatar"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {editingTestimonial.author || "Nama Klien"}
                      </span>
                      <span className="text-[11px] text-neutral-500 truncate">
                        &bull; {editingTestimonial.role || "Jabatan"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 italic line-clamp-1 mt-0.5">
                      &ldquo;{editingTestimonial.quote || "Kutipan testimoni..."}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Kutipan Testimoni
              </label>
              <textarea
                rows={3}
                value={editingTestimonial.quote}
                onChange={(e) =>
                  setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                }
                required
                placeholder="Tulis ulasan nyata atau testimoni klien di sini..."
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Simpan Testimoni
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── MODAL: EDIT/ADD RATE PACKAGE ── */}
      {packageModalOpen && editingPackage && rateCardContent && (
        <ModalWrapper
          title="Sunting Paket Layanan"
          onClose={() => setPackageModalOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { solutionId, item } = editingPackage;
              const updatedSolutions = rateCardContent.solutions.map((s) => {
                if (s.id !== solutionId) return s;
                const exists = s.packages.some((p) => p.id === item.id);
                return {
                  ...s,
                  packages: exists
                    ? s.packages.map((p) => (p.id === item.id ? item : p))
                    : [...s.packages, item],
                };
              });
              saveRateCard({ ...rateCardContent, solutions: updatedSolutions });
              setPackageModalOpen(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nama Paket
              </label>
              <input
                type="text"
                value={editingPackage.item.name}
                onChange={(e) =>
                  setEditingPackage({
                    ...editingPackage,
                    item: { ...editingPackage.item, name: e.target.value },
                  })
                }
                required
                className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Tagline Paket
              </label>
              <input
                type="text"
                value={editingPackage.item.tagline}
                onChange={(e) =>
                  setEditingPackage({
                    ...editingPackage,
                    item: { ...editingPackage.item, tagline: e.target.value },
                  })
                }
                required
                className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Harga (Rupiah Angka)
                </label>
                <input
                  type="number"
                  value={editingPackage.item.price}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      item: { ...editingPackage.item, price: Number(e.target.value) || 0 },
                    })
                  }
                  required
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Satuan Pembayaran
                </label>
                <select
                  value={editingPackage.item.unit}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      item: {
                        ...editingPackage.item,
                        unit: e.target.value as "project" | "bulan",
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                >
                  <option value="project">Per Proyek (sekali bayar)</option>
                  <option value="bulan">Per Bulan (langganan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Daftar Fitur / Deliverable (1 baris per poin)
              </label>
              <textarea
                rows={5}
                value={editingPackage.item.items.join("\n")}
                onChange={(e) =>
                  setEditingPackage({
                    ...editingPackage,
                    item: {
                      ...editingPackage.item,
                      items: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setPackageModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black"
              >
                Simpan Paket
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── MODAL: CONFIRM DELETE ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
              Hapus {deleteConfirm.type}?
            </h3>
            <p className="text-sm text-neutral-500">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                &ldquo;{deleteConfirm.title}&rdquo;
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                Batal
              </button>
              <button
                onClick={deleteConfirm.onConfirm}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Media Picker Modal - Portaled to document.body with z-[100] */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(path) => {
          if (mediaTargetCallback) mediaTargetCallback(path);
          setMediaPickerOpen(false);
        }}
      />

      {/* Image Cropper Modal - Portaled to document.body with z-[105] */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageUrl={cropperImage}
        defaultAspect={cropperAspect}
        onCropComplete={(newUrl) => {
          if (cropperCallback) cropperCallback(newUrl);
          setCropperOpen(false);
        }}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
          active
            ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ModalWrapper({
  title,
  onClose,
  maxWidth = "max-w-xl",
  children,
}: {
  title: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} max-h-[90vh] bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function AdminKoleksiPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-semibold text-neutral-500 animate-pulse">
          Memuat data koleksi CMS...
        </div>
      }
    >
      <KoleksiContent />
    </Suspense>
  );
}
