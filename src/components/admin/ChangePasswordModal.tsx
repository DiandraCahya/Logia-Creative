"use client";

import React, { useState } from "react";
import { KeyRound, X, Check, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError("Semua kolom password wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setSuccess(res.message || "Password admin berhasil diperbarui.");
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Ubah Password Admin"
    >
      <div className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl relative text-[var(--text-primary)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ff4114]/10 text-[#ff4114] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Ubah Password Admin</h2>
            <p className="text-xs text-neutral-500">Perbarui kredensial masuk CMS Anda</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-600 dark:text-green-400 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold mb-1">Password Saat Ini</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-[#ff4114]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
