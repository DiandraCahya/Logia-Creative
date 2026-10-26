"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Upload,
  RefreshCw,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { api, TestimonialItem, getMediaUrl } from "@/lib/api";

export function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState("");
  const [alt, setAlt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTestimonials(true);
      setTestimonials(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat testimoni klien.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setQuote("");
    setAuthor("");
    setRole("");
    setCompany("");
    setImage("");
    setAlt("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setQuote(item.quote);
    setAuthor(item.author);
    setRole(item.role || "");
    setCompany(item.company || "");
    setImage(item.image);
    setAlt(item.alt || item.author);
    setIsActive(item.isActive);
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
      alert(err instanceof Error ? err.message : "Gagal mengunggah foto testimoni.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !author.trim() || !image.trim()) {
      alert("Kutipan, nama klien, dan foto wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateTestimonial(editingItem.id, {
          quote: quote.trim(),
          author: author.trim(),
          role: role.trim(),
          company: company.trim(),
          image: image.trim(),
          alt: (alt || author).trim(),
          isActive,
        });
        setTestimonials((prev) => prev.map((t) => (t.id === editingItem.id ? res.data : t)));
      } else {
        const res = await api.createTestimonial({
          quote: quote.trim(),
          author: author.trim(),
          role: role.trim(),
          company: company.trim(),
          image: image.trim(),
          alt: (alt || author).trim(),
          order: testimonials.length + 1,
          isActive,
        });
        setTestimonials((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan testimoni.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus testimoni.");
    }
  };

  const handleToggleActive = async (item: TestimonialItem) => {
    try {
      const updated = !item.isActive;
      await api.updateTestimonial(item.id, { isActive: updated });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, isActive: updated } : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status testimoni.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Kelola Testimoni Klien
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Kutipan kepuasan mitra yang tampil pada carousel bagian Kata Mereka.
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
            Tambah Testimoni
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="underline font-semibold ml-2">Coba lagi</button>
        </div>
      )}

      {loading && testimonials.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">Memuat testimoni...</p>
        </div>
      )}

      {!loading && testimonials.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <MessageSquareQuote className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black dark:text-white mb-1">Belum Ada Testimoni</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-4">
            Tambahkan testimoni nyata dari klien atau mitra bisnis Anda.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Tambah Testimoni Baru
          </button>
        </div>
      )}

      {!loading && testimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                item.isActive
                  ? "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                  : "bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-neutral-300 dark:border-neutral-800 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getMediaUrl(item.image)}
                      alt={item.author}
                      className="w-11 h-11 rounded-full object-cover border border-black/10 dark:border-white/10 bg-neutral-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/LOGO.png";
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">{item.author}</h4>
                      <p className="text-xs text-neutral-500">
                        {[item.role, item.company].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                      item.isActive
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25"
                        : "bg-neutral-500/10 text-neutral-500 border-neutral-500/25"
                    }`}
                  >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px]">ID: {item.id}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 min-h-[34px] min-w-[34px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                    title="Edit Testimoni"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 min-h-[34px] min-w-[34px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                    title="Hapus Testimoni"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Form Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl relative text-[var(--text-primary)] my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">
              {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Masukkan kutipan feedback, nama klien, peran, dan foto profil.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Kutipan Testimoni
                </label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Kesan dan pesan klien mengenai kerja sama dengan Logia Creative..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Nama Klien / Penulis
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    required
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Jabatan (Role)
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Contoh: Brand Owner atau CMO"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Perusahaan / Brand Klien
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Contoh: Bloom Cosmetics"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Foto Klien (URL atau Unggah File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL foto (contoh: /miyawaki sakura.webp atau https://...)"
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

                {/* Built-in Preset Avatar Selectors */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-neutral-500 mb-1.5 block">
                    Pilih Cepat dari Avatar Klien yang Tersedia:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: "Miyawaki Sakura", path: "/uploads/miyawaki sakura.webp" },
                      { name: "Kim Chaewon", path: "/uploads/kim chaewon.webp" },
                      { name: "Pham Hanni", path: "/uploads/pham hanni.webp" },
                      { name: "Hong Eunchae", path: "/uploads/hong eunchae.webp" },
                      { name: "Hwang Ye-Ji", path: "/uploads/hwang ye-ji.webp" },
                      { name: "Enami Asa", path: "/uploads/enami asa.webp" },
                    ].map((client) => (
                      <button
                        key={client.path}
                        type="button"
                        onClick={() => {
                          setImage(client.path);
                          if (!author) setAuthor(client.name);
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-colors ${
                          image === client.path
                            ? "border-[#ff4114] bg-[#ff4114]/5"
                            : "border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25"
                        }`}
                      >
                        <img
                          src={getMediaUrl(client.path)}
                          alt={client.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/LOGO.png";
                          }}
                        />
                        <span className="text-[11px] font-medium truncate text-neutral-700 dark:text-neutral-300">
                          {client.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {image && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <img
                      src={getMediaUrl(image)}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-full bg-neutral-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/LOGO.png";
                      }}
                    />
                    <span className="text-xs text-neutral-500 font-mono truncate">{image}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="testiActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff4114] focus:ring-[#ff4114]"
                />
                <label htmlFor="testiActive" className="text-xs font-semibold cursor-pointer">
                  Tampilkan testimoni ini di carousel beranda (Status Aktif)
                </label>
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
                    "Simpan Testimoni"
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
