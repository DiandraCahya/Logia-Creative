"use client";

import React, { useEffect, useState } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  RefreshCw,
  X,
  AlertCircle,
  FolderPlus,
  Layers,
} from "lucide-react";
import { api, PricingSolution, PackageItem } from "@/lib/api";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingTab() {
  const [solutions, setSolutions] = useState<PricingSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solution Modal
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<PricingSolution | null>(null);
  const [solutionName, setSolutionName] = useState("");

  // Package Modal
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [targetSolutionId, setTargetSolutionId] = useState("");
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  const [pkgName, setPkgName] = useState("");
  const [pkgTagline, setPkgTagline] = useState("");
  const [pkgPrice, setPkgPrice] = useState(250000);
  const [pkgUnit, setPkgUnit] = useState<"project" | "bulan">("project");
  const [pkgPopular, setPkgPopular] = useState(false);
  const [pkgItemsInput, setPkgItemsInput] = useState("");
  const [pkgNotesInput, setPkgNotesInput] = useState("");

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPricing();
      setSolutions(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat paket harga.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Solution Actions
  const openCreateSolutionModal = () => {
    setEditingSolution(null);
    setSolutionName("");
    setSolutionModalOpen(true);
  };

  const openEditSolutionModal = (sol: PricingSolution) => {
    setEditingSolution(sol);
    setSolutionName(sol.name);
    setSolutionModalOpen(true);
  };

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionName.trim()) return;

    setSaving(true);
    try {
      if (editingSolution) {
        const res = await api.updateSolution(editingSolution.id, { name: solutionName.trim() });
        setSolutions((prev) => prev.map((s) => (s.id === editingSolution.id ? res.data : s)));
      } else {
        const res = await api.createSolution({ name: solutionName.trim(), order: solutions.length + 1 });
        setSolutions((prev) => [...prev, res.data]);
      }
      setSolutionModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan kategori solusi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSolution = async (solutionId: string) => {
    if (!confirm("Hapus kategori solusi ini beserta seluruh paket di dalamnya?")) return;
    try {
      await api.deleteSolution(solutionId);
      setSolutions((prev) => prev.filter((s) => s.id !== solutionId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus solusi.");
    }
  };

  // Package Actions
  const openCreatePackageModal = (solutionId: string) => {
    setTargetSolutionId(solutionId);
    setEditingPackage(null);
    setPkgName("");
    setPkgTagline("");
    setPkgPrice(500000);
    setPkgUnit("project");
    setPkgPopular(false);
    setPkgItemsInput("Fitur 1\nFitur 2\nFitur 3");
    setPkgNotesInput("");
    setPackageModalOpen(true);
  };

  const openEditPackageModal = (solutionId: string, pkg: PackageItem) => {
    setTargetSolutionId(solutionId);
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgTagline(pkg.tagline || "");
    setPkgPrice(pkg.price);
    setPkgUnit(pkg.unit);
    setPkgPopular(Boolean(pkg.popular));
    setPkgItemsInput((pkg.items || []).join("\n"));
    setPkgNotesInput((pkg.notes || []).join("\n"));
    setPackageModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) {
      alert("Nama paket wajib diisi.");
      return;
    }

    const items = pkgItemsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const notes = pkgNotesInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (editingPackage) {
        const res = await api.updatePackage(editingPackage.id, {
          name: pkgName.trim(),
          tagline: pkgTagline.trim(),
          price: Number(pkgPrice) || 0,
          unit: pkgUnit,
          popular: pkgPopular,
          items,
          notes,
        });
        setSolutions((prev) =>
          prev.map((sol) => {
            if (sol.id !== targetSolutionId) return sol;
            return {
              ...sol,
              packages: sol.packages.map((p) => (p.id === editingPackage.id ? res.data : p)),
            };
          })
        );
      } else {
        const res = await api.addPackage(targetSolutionId, {
          name: pkgName.trim(),
          tagline: pkgTagline.trim(),
          price: Number(pkgPrice) || 0,
          unit: pkgUnit,
          popular: pkgPopular,
          items,
          notes,
        });
        setSolutions((prev) =>
          prev.map((sol) => {
            if (sol.id !== targetSolutionId) return sol;
            return {
              ...sol,
              packages: [...sol.packages, res.data],
            };
          })
        );
      }
      setPackageModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan paket harga.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (solutionId: string, packageId: string) => {
    if (!confirm("Hapus paket harga ini?")) return;
    try {
      await api.deletePackage(packageId);
      setSolutions((prev) =>
        prev.map((sol) => {
          if (sol.id !== solutionId) return sol;
          return {
            ...sol,
            packages: sol.packages.filter((p) => p.id !== packageId),
          };
        })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus paket.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Kelola Paket Harga & Solusi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Daftar paket harga yang tampil pada tabel Rate Card dan form pemilihan layanan.
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
            onClick={openCreateSolutionModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <FolderPlus className="w-4 h-4" />
            Tambah Kategori Solusi
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

      {loading && solutions.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">Memuat paket harga...</p>
        </div>
      )}

      {/* Solutions Accordion / Sections */}
      {!loading && (
        <div className="space-y-8">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ff4114]/10 text-[#ff4114] flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white">{sol.name}</h3>
                    <span className="text-[11px] text-neutral-500 font-mono">ID: {sol.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditSolutionModal(sol)}
                    className="p-2 min-h-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Ubah Nama
                  </button>
                  <button
                    onClick={() => handleDeleteSolution(sol.id)}
                    className="p-2 min-h-[36px] rounded-lg hover:bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                  <button
                    onClick={() => openCreatePackageModal(sol.id)}
                    className="px-3.5 py-1.5 min-h-[36px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Paket
                  </button>
                </div>
              </div>

              {/* Packages in this solution */}
              {sol.packages.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                  Belum ada paket dalam kategori ini. Klik &quot;Tambah Paket&quot; untuk menambahkan paket baru.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sol.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        pkg.popular
                          ? "border-[#ff4114]/40 bg-[#ff4114]/[0.03] shadow-sm"
                          : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-black dark:text-white uppercase tracking-wider">
                            {pkg.name}
                          </h4>
                          {pkg.popular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff4114] text-white flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Populer
                            </span>
                          )}
                        </div>

                        {pkg.tagline && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-1 italic">
                            {pkg.tagline}
                          </p>
                        )}

                        <div className="mb-4">
                          <span className="text-xl sm:text-2xl font-bold font-righteous text-black dark:text-white">
                            {formatIDR(pkg.price)}
                          </span>
                          <span className="text-xs text-neutral-500 ml-1">/{pkg.unit}</span>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          {pkg.items.slice(0, 5).map((it, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{it}</span>
                            </div>
                          ))}
                          {pkg.items.length > 5 && (
                            <span className="text-[11px] text-neutral-400 italic block">
                              +{pkg.items.length - 5} butir fitur lainnya
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">
                          {pkg.id}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditPackageModal(sol.id, pkg)}
                            className="p-2 min-h-[34px] min-w-[34px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300"
                            title="Edit Paket"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(sol.id, pkg.id)}
                            className="p-2 min-h-[34px] min-w-[34px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                            title="Hapus Paket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Solution Name Modal */}
      {solutionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl relative text-[var(--text-primary)]">
            <button
              onClick={() => setSolutionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">
              {editingSolution ? "Ubah Nama Kategori Solusi" : "Tambah Kategori Solusi"}
            </h3>
            <form onSubmit={handleSaveSolution} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Kategori Solusi</label>
                <input
                  type="text"
                  value={solutionName}
                  onChange={(e) => setSolutionName(e.target.value)}
                  placeholder="Contoh: Growth Marketing Solution"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSolutionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      {packageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl relative text-[var(--text-primary)] my-8">
            <button
              onClick={() => setPackageModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">
              {editingPackage ? "Edit Paket Harga" : "Tambah Paket Harga Baru"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Tentukan nama paket, tarif, satuan penagihan, serta butir fitur.
            </p>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    value={pkgName}
                    onChange={(e) => setPkgName(e.target.value)}
                    placeholder="Contoh: WEB STARTER"
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
                    value={pkgTagline}
                    onChange={(e) => setPkgTagline(e.target.value)}
                    placeholder="Langsung online, tanpa ribet"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Harga (Rupiah, angka murni)
                  </label>
                  <input
                    type="number"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={10000}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                    Format: {formatIDR(pkgPrice || 0)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                    Satuan Penagihan
                  </label>
                  <select
                    value={pkgUnit}
                    onChange={(e) => setPkgUnit(e.target.value as "project" | "bulan")}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                  >
                    <option value="project" className="bg-neutral-900 text-white">Per Proyek (project)</option>
                    <option value="bulan" className="bg-neutral-900 text-white">Per Bulan (bulan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Butir Fitur (Satu baris per fitur)
                </label>
                <textarea
                  value={pkgItemsInput}
                  onChange={(e) => setPkgItemsInput(e.target.value)}
                  placeholder="Landing page 1 halaman&#10;Tombol WhatsApp&#10;Panduan setup domain&#10;Revisi 2x"
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Catatan Tambahan (Opsional, satu baris per catatan)
                </label>
                <textarea
                  value={pkgNotesInput}
                  onChange={(e) => setPkgNotesInput(e.target.value)}
                  placeholder="*Garansi bug 14 hari&#10;*Termasuk file master"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pkgPop"
                  checked={pkgPopular}
                  onChange={(e) => setPkgPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff4114] focus:ring-[#ff4114]"
                />
                <label htmlFor="pkgPop" className="text-xs font-semibold cursor-pointer">
                  Tandai sebagai Paket Populer (Highlight)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
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
                    "Simpan Paket"
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
