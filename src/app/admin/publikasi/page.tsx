"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  RotateCcw,
  GitBranch,
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  FolderKanban,
  ImageIcon,
  RefreshCw,
  Info,
  ArrowLeft,
} from "lucide-react";

interface StatusInfo {
  driver: "local" | "github";
  hasGithubConfig: boolean;
  currentSha: string | null;
  owner: string | null;
  repo: string | null;
  branch: string;
}

export default function AdminPublikasiPage() {
  const [status, setStatus] = useState<StatusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [summary, setSummary] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setConflictDetected(false);
    try {
      const res = await fetch("/api/admin/publish");
      if (!res.ok) throw new Error("Gagal mengambil status publikasi.");
      const data: StatusInfo = await res.json();
      setStatus(data);
    } catch (err: any) {
      setAlert({ type: "error", msg: err.message || "Gagal memuat status sistem." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setAlert(null);
    setConflictDetected(false);

    try {
      const payload: {
        summary: string;
        expectedSha?: string;
      } = {
        summary: summary.trim() || "Pembaruan konten situs",
      };

      if (status?.driver === "github" && status.currentSha) {
        payload.expectedSha = status.currentSha;
      }

      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isConflict || res.status === 409) {
          setConflictDetected(true);
          throw new Error(
            data.error ||
              "Konflik: Repository telah diperbarui oleh commit lain (SHA berubah). Muat ulang data terbaru terlebih dahulu."
          );
        }
        throw new Error(data.error || "Gagal mempublikasikan konten.");
      }

      setAlert({
        type: "success",
        msg: data.message || "Perubahan berhasil dipublikasikan.",
      });
      setSummary("");
      // Refresh current SHA
      fetchStatus();
    } catch (err: any) {
      setAlert({ type: "error", msg: err.message || "Terjadi kesalahan saat publikasi." });
    } finally {
      setPublishing(false);
    }
  };

  const handleResetToDefaults = async () => {
    setResetting(true);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mereset ke default pabrik.");
      setAlert({
        type: "success",
        msg: data.message || "Seluruh data berhasil dikembalikan ke default pabrik.",
      });
      setResetModalOpen(false);
      fetchStatus();
    } catch (err: any) {
      setAlert({ type: "error", msg: err.message || "Terjadi kesalahan saat reset data." });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-3 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Ringkasan</span>
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Pusat Rilis
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Fase 6: Draft & Publikasi
          </span>
        </div>
        <h1 className="font-righteous text-2xl sm:text-3xl text-black dark:text-white">
          Publikasi Konten
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Rilis seluruh perubahan teks, koleksi, dan foto secara atomik ke website publik.
        </p>
      </div>

      {/* Alert banner */}
      {alert && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-sm flex items-start gap-3 animate-fade-in ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
              : alert.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-300"
              : "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{alert.msg}</p>
          </div>
        </div>
      )}

      {/* Conflict Warning Box */}
      {conflictDetected && (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Konflik Sinkronisasi Terdeteksi</h3>
              <p className="text-xs mt-1 text-amber-800 dark:text-amber-300 leading-relaxed">
                Repository GitHub telah mengalami pembaruan lain sejak sesi draft Anda aktif.
                Untuk menjaga keutuhan data dan mencegah penimpaan file secara tidak sengaja,
                silakan muat ulang data terbaru terlebih dahulu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchStatus}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Status Repository</span>
          </button>
        </div>
      )}

      {/* Driver & Environment Status Card */}
      <div className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            {status?.driver === "github" ? (
              <GitBranch className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <Server className="w-5 h-5 text-black dark:text-white" />
            )}
            <h2 className="font-bold text-base text-black dark:text-white">
              Driver Penyimpanan Aktif:{" "}
              <span className="font-mono uppercase px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-xs font-bold">
                {status?.driver || "Memuat..."}
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            title="Refresh status"
            className="p-2 rounded-xl border border-black/10 dark:border-white/15 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Mode Eksekusi</span>
            <p className="font-semibold text-black dark:text-white">
              {status?.driver === "github"
                ? "Produksi (Git Data API Atomik)"
                : "Pengembangan Lokal (File System)"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Target Repository</span>
            <p className="font-mono text-black dark:text-white truncate">
              {status?.driver === "github"
                ? `${status.owner || "?"}/${status.repo || "?"} (${status.branch})`
                : "Local Workspace Directory"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Commit SHA Terakhir</span>
            <p className="font-mono text-black dark:text-white truncate">
              {status?.currentSha ? status.currentSha.slice(0, 10) : "Tersinkron"}
            </p>
          </div>
        </div>

        {status?.driver === "github" && !status.hasGithubConfig && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              Variabel lingkungan <strong>GITHUB_TOKEN</strong>, <strong>GITHUB_OWNER</strong>, atau{" "}
              <strong>GITHUB_REPO</strong> belum lengkap di file <code>.env.local</code>. Mohon
              lengkapi untuk mengaktifkan commit otomatis di Vercel.
            </p>
          </div>
        )}
      </div>

      {/* Main Publication Form */}
      <div className="p-6 sm:p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-md space-y-6">
        <div>
          <h2 className="font-righteous text-lg text-black dark:text-white">
            Rilis Perubahan Sekarang
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Satu klik publikasi akan memicu pembuatan commit atomik dan memperbarui cache publik.
          </p>
        </div>

        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label
              htmlFor="commit-summary"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Ringkasan Catatan Perubahan (Pesan Commit)
            </label>
            <input
              id="commit-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Contoh: Pembaruan harga rate card dan foto selected work"
              className="w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0d0d0d] text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Pesan ini akan tercatat dalam riwayat commit Git dengan awalan{" "}
              <code className="font-mono">cms: &lt;pesan&gt;</code>.
            </p>
          </div>

          {/* Quick Checklist / Preview of sections */}
          <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
              Cakupan yang Termasuk dalam Rilis:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                <span>Teks Seluruh Section</span>
              </li>
              <li className="flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                <span>Koleksi Portfolio & Rate Card</span>
              </li>
              <li className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                <span>Registry Foto & Unggahan</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
            <button
              type="submit"
              disabled={publishing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[50px] rounded-full font-semibold text-sm bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {publishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mempublikasikan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publikasikan Sekarang</span>
                </>
              )}
            </button>

            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {status?.driver === "github"
                  ? "Auto-deploy Vercel memakan waktu 1–2 menit"
                  : "Perubahan tampil instan di browser"}
              </span>
            </span>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset to Factory Defaults */}
      <div className="p-6 rounded-3xl border border-red-500/20 bg-red-500/[0.03] space-y-4">
        <div>
          <h2 className="font-righteous text-base text-red-600 dark:text-red-400 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Zona Pemulihan: Reset ke Default Pabrik</span>
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
            Jika Anda ingin mengembalikan seluruh konten teks, rate card, testimoni, dan
            portofolio ke kondisi awal mula situs dipasang, gunakan opsi reset ini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-2xl border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Konten ke Default</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-righteous text-lg text-black dark:text-white">
                Konfirmasi Reset Konten
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Aksi ini akan menimpa seluruh file konten aktif (
              <code className="font-mono">site.json</code>,{" "}
              <code className="font-mono">projects.json</code>,{" "}
              <code className="font-mono">rate-card.json</code>, dll.) dengan file awal bawaan di
              folder <code className="font-mono">content/defaults/</code>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                disabled={resetting}
                className="px-4 py-2.5 min-h-[44px] rounded-xl border border-black/10 dark:border-white/15 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                disabled={resetting}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                {resetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mereset...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ya, Reset Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
