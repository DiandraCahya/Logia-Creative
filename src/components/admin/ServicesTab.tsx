"use client";

import React, { useEffect, useState } from "react";
import {
  Palette,
  Code2,
  Share2,
  Megaphone,
  MonitorCheck,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  Terminal,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  AlertCircle,
  Check,
  LucideIcon,
} from "lucide-react";
import { api, ServiceItem } from "@/lib/api";

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  MonitorCheck,
  Share2,
  Cpu,
  Megaphone,
  Code2,
  Globe,
  Sparkles,
  Layers,
  Terminal,
};

export function ServicesTab() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("Palette");
  const [desc, setDesc] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getServices(true);
      setServices(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat daftar layanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setIcon("Palette");
    setDesc("");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: ServiceItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setIcon(item.icon);
    setDesc(item.desc);
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      alert("Judul layanan dan deskripsi wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateService(editingItem.id, {
          title: title.trim(),
          icon: icon.trim(),
          desc: desc.trim(),
          isActive,
        });
        setServices((prev) => prev.map((s) => (s.id === editingItem.id ? res.data : s)));
      } else {
        const res = await api.createService({
          title: title.trim(),
          icon: icon.trim(),
          desc: desc.trim(),
          order: services.length + 1,
          isActive,
        });
        setServices((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan layanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus layanan.");
    }
  };

  const handleToggleActive = async (item: ServiceItem) => {
    try {
      const updated = !item.isActive;
      await api.updateService(item.id, { isActive: updated });
      setServices((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, isActive: updated } : s))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status aktif.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Kelola Layanan (Services)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Layanan yang aktif tampil di section Layanan Kami pada beranda utama.
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
            Tambah Layanan
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

      {loading && services.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">Memuat layanan...</p>
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <Layers className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black dark:text-white mb-1">Belum Ada Layanan</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-4">
            Tambahkan paket keahlian agensi seperti Brand Identity, Web Development, dll.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan Baru
          </button>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item) => {
            const IconComp = ICON_MAP[item.icon] || Palette;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.isActive
                    ? "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-neutral-300 dark:border-neutral-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-black dark:text-white">
                      <IconComp className="w-5 h-5" />
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

                  <h3 className="text-base font-bold text-black dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-[11px]">Ikon: {item.icon}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                      title="Edit Layanan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                      title="Hapus Layanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit Service */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={editingItem ? "Edit Layanan" : "Tambah Layanan"}
        >
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl relative text-[var(--text-primary)]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-black dark:text-white mb-1">
              {editingItem ? "Edit Layanan" : "Tambah Layanan Baru"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Tentukan judul, ikon, dan deskripsi singkat layanan agensi.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Judul Layanan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Brand Identity atau AI Consulting"
                  required
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Pilih Ikon Layanan
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Comp = ICON_MAP[iconKey];
                    const isSelected = icon === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setIcon(iconKey)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm"
                            : "border-neutral-200 dark:border-neutral-800 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <Comp className="w-4 h-4" />
                        <span className="text-[10px] font-mono truncate max-w-full">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Penjelasan ringkas 1-2 kalimat mengenai apa yang diperoleh klien."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="srvActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff4114] focus:ring-[#ff4114]"
                />
                <label htmlFor="srvActive" className="text-xs font-semibold cursor-pointer">
                  Tampilkan layanan di website (Status Aktif)
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
                    "Simpan Layanan"
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
