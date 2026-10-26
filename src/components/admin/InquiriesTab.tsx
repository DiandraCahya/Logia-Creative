"use client";

import React, { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Eye,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Phone,
  Building,
  DollarSign,
  X,
  FileText,
} from "lucide-react";
import { api, InquiryItem, InquiryStats, InquiryStatus } from "@/lib/api";

const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string }> = {
  new: { label: "Baru", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" },
  contacted: { label: "Dihubungi", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25" },
  in_progress: { label: "Sedang Berjalan", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25" },
  completed: { label: "Selesai", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" },
  archived: { label: "Diarsipkan", color: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/25" },
};

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<InquiryStatus>("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [inqRes, statsRes] = await Promise.all([
        api.getInquiries({
          status: statusFilter === "all" ? undefined : (statusFilter as InquiryStatus),
          search: search.trim() || undefined,
        }),
        api.getInquiriesStats(),
      ]);
      setInquiries(inqRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data formulir kolaborasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openDetail = (item: InquiryItem) => {
    setSelectedInquiry(item);
    setStatusUpdate(item.status);
    setAdminNotes(item.adminNotes || "");
  };

  const handleSaveStatus = async () => {
    if (!selectedInquiry) return;
    setSavingStatus(true);
    try {
      const res = await api.updateInquiryStatus(selectedInquiry.id, statusUpdate, adminNotes.trim());
      // Update local state
      setInquiries((prev) =>
        prev.map((it) => (it.id === selectedInquiry.id ? res.data : it))
      );
      setSelectedInquiry(null);
      // Refresh stats
      const statsRes = await api.getInquiriesStats();
      setStats(statsRes.data || null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan perubahan status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data inquiry ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((it) => it.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      const statsRes = await api.getInquiriesStats();
      setStats(statsRes.data || null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            Manajemen Leads & Kolaborasi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Daftar pengajuan kolaborasi yang masuk melalui form website.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Segarkan
        </button>
      </div>

      {/* Stats summary row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Total Leads</span>
            <p className="text-2xl font-bold text-black dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Baru Masuk</span>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.new}</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Dihubungi</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.contacted}</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Berjalan</span>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.in_progress}</p>
          </div>
          <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">Selesai</span>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.completed}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-500/5 border border-neutral-500/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Diarsipkan</span>
            <p className="text-2xl font-bold text-neutral-500 mt-1">{stats.archived}</p>
          </div>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, kontak, atau brand..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "new", "contacted", "in_progress", "completed", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {st === "all" ? "Semua Status" : STATUS_LABELS[st as InquiryStatus]?.label || st}
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
      {loading && inquiries.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">Memuat data inquiry...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && inquiries.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <Inbox className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-black dark:text-white mb-1">Belum Ada Leads</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "Tidak ada data inquiry yang cocok dengan filter atau kata kunci pencarian Anda."
              : "Belum ada kiriman formulir kolaborasi dari website. Pengajuan baru akan muncul di sini."}
          </p>
        </div>
      )}

      {/* Leads Table */}
      {!loading && inquiries.length > 0 && (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/5 dark:bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3.5 sm:p-4">Tanggal</th>
                  <th className="p-3.5 sm:p-4">Klien / Brand</th>
                  <th className="p-3.5 sm:p-4">Kontak</th>
                  <th className="p-3.5 sm:p-4">Budget</th>
                  <th className="p-3.5 sm:p-4">Layanan</th>
                  <th className="p-3.5 sm:p-4">Status</th>
                  <th className="p-3.5 sm:p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {inquiries.map((item) => {
                  const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.new;
                  const dateStr = new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => openDetail(item)}
                    >
                      <td className="p-3.5 sm:p-4 whitespace-nowrap text-neutral-500 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="p-3.5 sm:p-4">
                        <div className="font-semibold text-black dark:text-white">{item.name}</div>
                        {item.brandName && (
                          <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            {item.brandName}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 sm:p-4 font-mono text-xs">
                        <span className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                          <Phone className="w-3 h-3 text-[#ff4114]" />
                          {item.contact}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 whitespace-nowrap font-medium">
                        {item.budget || "Fleksibel"}
                      </td>
                      <td className="p-3.5 sm:p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.services.map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px] font-medium"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td
                        className="p-3.5 sm:p-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openDetail(item)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300"
                            title="Lihat Detail & Perbarui Status"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 min-h-[36px] min-w-[36px] rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail & Status Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Detail Inquiry"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl relative text-[var(--text-primary)] my-8">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ff4114]/10 text-[#ff4114] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Rincian Kolaborasi
                </h3>
                <p className="text-xs text-neutral-500">ID: {selectedInquiry.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Nama Klien
                </span>
                <p className="font-semibold text-black dark:text-white">{selectedInquiry.name}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Nama Brand / Bisnis
                </span>
                <p className="font-semibold text-black dark:text-white">
                  {selectedInquiry.brandName || "Tidak disebutkan"}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Kontak (WA / Email)
                </span>
                <a
                  href={`https://wa.me/${selectedInquiry.contact.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#ff4114] hover:underline"
                >
                  {selectedInquiry.contact}
                </a>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Estimasi Budget
                </span>
                <p className="font-semibold text-black dark:text-white">
                  {selectedInquiry.budget || "Fleksibel"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Layanan Diminati
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedInquiry.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {selectedInquiry.notes && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Catatan / Pesan dari Klien
                  </span>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedInquiry.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Status & Admin Notes Update Form */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Perbarui Status Leads
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value as InquiryStatus)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                >
                  <option value="new" className="bg-neutral-900 text-white">Baru (Belum Ditindaklanjuti)</option>
                  <option value="contacted" className="bg-neutral-900 text-white">Dihubungi (Follow-up WA/Email)</option>
                  <option value="in_progress" className="bg-neutral-900 text-white">Sedang Berjalan (Deal / Tahap Pengerjaan)</option>
                  <option value="completed" className="bg-neutral-900 text-white">Selesai (Proyek Tuntas)</option>
                  <option value="archived" className="bg-neutral-900 text-white">Diarsipkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Catatan Internal Admin (Opsional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Contoh: Sudah dikirim penawaran rate card via WA. Klien minta revisi timeline 2 minggu."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Data
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    disabled={savingStatus}
                    className="px-5 py-2.5 min-h-[42px] rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingStatus ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Status"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
