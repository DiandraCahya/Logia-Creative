"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  Star,
  RefreshCw,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { api, PortfolioItem, API_MEDIA_URL, getMediaUrl } from "@/lib/api";

export function PortfolioTab() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Branding");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [accent, setAccent] = useState("#ff4114");
  const [link, setLink] = useState("");
  const [figure, setFigure] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [portRes, catRes] = await Promise.all([
        api.getPortfolio({
          category: categoryFilter === "Semua" ? undefined : categoryFilter,
          search: search.trim() || undefined,
        }),
        api.getPortfolioCategories(),
      ]);
      setItems(portRes.data || []);
      setCategories(catRes.data || ["Semua", "Branding", "Web Development", "UI/UX", "Marketing"]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data portofolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("Branding");
    setImage("");
    setDescription("");
    setTagsInput("");
    setAccent("#ff4114");
    setLink("");
    setFigure(false);
    setIsFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImage(item.image);
    setDescription(item.description);
    setTagsInput(item.tags.join(", "));
    setAccent(item.accent || "#ff4114");
    setLink(item.link || "");
    setFigure(Boolean(item.figure));
    setIsFeatured(Boolean(item.isFeatured));
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      if (res.data?.url) {
        setImage(res.data.url);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengunggah file gambar.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim() || !description.trim()) {
      alert("Judul, tautan gambar, dan deskripsi wajib diisi.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (editingItem) {
        const res = await api.updatePortfolio(editingItem.id, {
          title: title.trim(),
          category: category.trim(),
          image: image.trim(),
          description: description.trim(),
          tags,
          accent: accent.trim(),
          link: link.trim(),
          figure,
          isFeatured,
        });
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? res.data : it)));
      } else {
        const res = await api.createPortfolio({
          title: title.trim(),
          category: category.trim(),
          image: image.trim(),
          description: description.trim(),
          tags,
          accent: accent.trim(),
          link: link.trim(),
          figure,
          isFeatured,
          order: items.length + 1,
        });
        setItems((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan portofolio.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus karya ini dari portofolio?")) return;
    try {
      await api.deletePortfolio(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus portofolio.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Kelola Karya & Portofolio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Karya yang terdaftar di sini tampil pada bagian Portfolio di beranda utama.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[42px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Tambah Karya
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari karya atau tag..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="underline font-semibold ml-2">Coba lagi</button>
        </div>
      )}

      {/* Loading state */}
      {loading && items.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">Memuat karya portofolio...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <FolderKanban className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black dark:text-white mb-1">Portofolio Kosong</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-4">
            Belum ada proyek portofolio yang cocok dengan kriteria ini.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Buat Portofolio Baru
          </button>
        </div>
      )}

      {/* Portfolio Grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden flex flex-col transition-all hover:border-black/25 dark:hover:border-white/25"
            >
              <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
                <img
                  src={getMediaUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/LOGO.png";
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#ff4114] text-white flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Unggulan
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-black dark:text-white whitespace-pre-line mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#ff4114] hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Tautan Proyek
                      </a>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Tidak ada tautan</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                      title="Edit Karya"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                      title="Hapus Karya"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={editingItem ? "Edit Portofolio" : "Tambah Portofolio"}
        >
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl relative text-[var(--text-primary)] my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-black dark:text-white mb-1">
              {editingItem ? "Edit Karya Portofolio" : "Tambah Karya Portofolio"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Isi data karya untuk ditampilkan pada galeri portfolio website Logia Creative.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Judul Karya
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Revitalisasi&#10;Identitas&#10;Nusantara"
                    rows={2}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                  <span className="text-[10px] text-neutral-500">Gunakan enter untuk baris baru judul kinetik</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  >
                    <option value="Branding" className="bg-neutral-900 text-white">Branding</option>
                    <option value="Web Development" className="bg-neutral-900 text-white">Web Development</option>
                    <option value="UI/UX" className="bg-neutral-900 text-white">UI/UX</option>
                    <option value="Marketing" className="bg-neutral-900 text-white">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Gambar Karya (URL atau Unggah File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL gambar (contoh: /justicia.webp atau https://...)"
                    required
                    className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    {uploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Unggah
                  </button>
                </div>

                {/* Built-in Preset Assets quick-picker */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-neutral-500 mb-1.5 block">
                    Pilih Cepat dari Aset Bawaan Logia:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Justicia KWN (API)", path: "/uploads/justicia.webp" },
                      { label: "Logo 3D Logia", path: "/logo3d.webp" },
                      { label: "Luogia Art 2", path: "/LUOGIA2.webp" },
                      { label: "Luogia Banner", path: "/LUOGIA.webp" },
                      { label: "Mode Gelap", path: "/modeGelap.webp" },
                      { label: "Mode Terang", path: "/modeTerang.webp" },
                    ].map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setImage(preset.path)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                          image === preset.path
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold"
                            : "border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {image && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <img
                      src={getMediaUrl(image)}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg bg-neutral-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/LOGO.png";
                      }}
                    />
                    <span className="text-xs text-neutral-500 font-mono truncate">{image}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Deskripsi Proyek
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tantangan, solusi desain, dan dampak nyata proyek ini."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Tags (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Contoh: Next.js, Web Design, Responsive"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Tautan Live Proyek (Opsional)
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Warna Aksen Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="w-10 h-10 p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="flex-1 px-3 py-2 min-h-[40px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff4114] focus:ring-[#ff4114]"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-semibold cursor-pointer">
                    Karya Unggulan (Featured)
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="figure"
                    checked={figure}
                    onChange={(e) => setFigure(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff4114] focus:ring-[#ff4114]"
                  />
                  <label htmlFor="figure" className="text-xs font-semibold cursor-pointer">
                    Gambar Transparan (Figure)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 min-h-[42px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 min-h-[42px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Portofolio"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
