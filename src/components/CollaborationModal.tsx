"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle2, Phone, Mail, AlertCircle, Loader2, Printer, Receipt as ReceiptIcon } from "lucide-react";
import { PACKAGES } from "@/lib/rate-card";
import { formatIDR, RECEIPT_TERMS, type Receipt } from "@/lib/receipt";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Opsi layanan = nama paket dari rate-card (SATU sumber) + opsi umum
const serviceOptions = [
  ...PACKAGES.map((p) => p.name),
  "Layanan Satuan / Custom",
];

const budgetRanges = [
  "< Rp 5 Juta",
  "Rp 5 - 15 Juta",
  "Rp 15 - 35 Juta",
  "> Rp 35 Juta",
];

type Status = "idle" | "loading" | "success" | "error";

export function CollaborationModal({ isOpen, onClose }: CollaborationModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    PACKAGES[2]?.name ?? "GROWTH PACKAGE",
  ]);
  const [selectedBudget, setSelectedBudget] = useState("Rp 5 - 15 Juta");
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    contact: "",
    notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (formData.name.trim().length < 2) errs.name = "Nama wajib diisi (min. 2 karakter).";
    if (formData.contact.trim().length < 5) errs.contact = "Isi nomor WA atau email yang valid.";
    if (selectedServices.length === 0) errs.services = "Pilih minimal satu layanan.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          brandName: formData.brandName.trim(),
          contact: formData.contact.trim(),
          notes: formData.notes.trim(),
          budget: selectedBudget,
          services: selectedServices,
          website: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengirim. Coba lagi.");

      setReceipt((data.receipt as Receipt) ?? null);
      setStatus("success");
      try {
        const confettiModule = await import("canvas-confetti");
        const confetti = confettiModule.default || confettiModule;
        if (typeof confetti === "function") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#A08C6A", "#000000", "#ffffff"],
            disableForReducedMotion: true,
          });
        }
      } catch {
        // ignore
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengirim. Coba lagi.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMsg("");
    setFieldErrors({});
    setReceipt(null);
    setFormData({ name: "", brandName: "", contact: "", notes: "" });
    onClose();
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors min-h-[48px] ${
      hasError
        ? "border-red-500 dark:border-red-400"
        : "border-gray-300 dark:border-gray-700 focus:border-accent-bronze dark:focus:border-accent-bronze"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain" role="dialog" aria-modal="true" aria-label="Formulir kolaborasi">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl z-10 my-4 sm:my-8 max-h-[92dvh] overflow-y-auto overscroll-contain"
          >
            <div className="rounded-3xl bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-2xl p-5 sm:p-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                onClick={onClose}
                aria-label="Tutup formulir"
                className="absolute top-5 right-5 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors active:scale-95 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {status === "success" ? (
                <div className="py-6 space-y-5">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-accent-bronze/10 text-accent-bronze flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Terima Kasih, {formData.name || "Mitra Hebat"}!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      Pesan Anda sudah terkirim. Kami akan menghubungi Anda melalui kontak yang dicantumkan dalam 1x24 jam kerja.
                    </p>
                  </div>
                  {receipt ? (
                    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 text-left text-sm">
                      <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-3">
                        <ReceiptIcon className="w-4 h-4 text-accent-bronze" />
                        Struk — {receipt.id}
                      </p>
                      <dl className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        <div className="flex justify-between gap-4"><dt>Waktu</dt><dd className="font-medium text-right">{receipt.timestamp}</dd></div>
                        <div className="flex justify-between gap-4"><dt>Pelanggan</dt><dd className="font-medium text-right">{receipt.customer}{receipt.brand ? ` (${receipt.brand})` : ""}</dd></div>
                        <div className="flex justify-between gap-4"><dt>Paket</dt><dd className="font-medium text-right">{receipt.packageName} — {receipt.priceLabel}</dd></div>
                        {receipt.total != null && (
                          <>
                            <div className="flex justify-between gap-4"><dt>Total</dt><dd className="font-medium text-right">{formatIDR(receipt.total)}</dd></div>
                            <div className="flex justify-between gap-4"><dt>DP 50%</dt><dd className="font-medium text-right">{formatIDR(receipt.dp!)}</dd></div>
                            <div className="flex justify-between gap-4"><dt>Sisa</dt><dd className="font-medium text-right">{formatIDR(receipt.sisa!)}</dd></div>
                          </>
                        )}
                        <div className="flex justify-between gap-4"><dt>Status</dt><dd className="font-semibold text-accent-bronze text-right">Menunggu DP</dd></div>
                      </dl>
                      <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
                        {RECEIPT_TERMS.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Struk email ikut terkirim ke tim kami.</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 min-h-[48px] rounded-full border border-black/15 dark:border-white/15 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Printer className="w-4 h-4" />
                      Print / Simpan
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 min-h-[48px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm active:scale-95"
                    >
                      Selesai & Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-5 sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-bronze/10 text-accent-bronze text-xs font-semibold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      Creative Partnership
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mb-2">
                      Mulai Kolaborasi Bersama Logia
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Diskusikan ide besar bisnis Anda. Kami bantu formulasi strategi kreatif dan implementasi teknologinya.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
                    <div>
                      <span id="svc-label" className="block text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                        Pilih Kebutuhan Layanan
                      </span>
                      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="svc-label">
                        {serviceOptions.map((srv) => {
                          const active = selectedServices.includes(srv);
                          return (
                            <button
                              type="button"
                              key={srv}
                              onClick={() => toggleService(srv)}
                              aria-pressed={active}
                              className={`text-xs px-4 py-2 min-h-[44px] rounded-full border transition-all active:scale-95 ${
                                active
                                  ? "bg-accent-bronze text-white border-accent-bronze"
                                  : "bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border-gray-300 dark:border-gray-700 hover:border-accent-bronze/50"
                              }`}
                            >
                              {srv}
                            </button>
                          );
                        })}
                      </div>
                      {fieldErrors.services && (
                        <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.services}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="collab-name" className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                          Nama Lengkap *
                        </label>
                        <input
                          id="collab-name"
                          type="text"
                          autoComplete="name"
                          placeholder="cth. Diandra Cahya"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          aria-invalid={!!fieldErrors.name}
                          aria-describedby={fieldErrors.name ? "collab-name-err" : undefined}
                          className={inputCls(!!fieldErrors.name)}
                        />
                        {fieldErrors.name && (
                          <p id="collab-name-err" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="collab-brand" className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                          Nama Brand / Usaha
                        </label>
                        <input
                          id="collab-brand"
                          type="text"
                          autoComplete="organization"
                          placeholder="cth. Kopi Nusantara"
                          value={formData.brandName}
                          onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                          className={inputCls(false)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="collab-contact" className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                          WhatsApp / Email *
                        </label>
                        <input
                          id="collab-contact"
                          type="text"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="0812xxxx / email@anda.com"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          aria-invalid={!!fieldErrors.contact}
                          aria-describedby={fieldErrors.contact ? "collab-contact-err" : undefined}
                          className={inputCls(!!fieldErrors.contact)}
                        />
                        {fieldErrors.contact && (
                          <p id="collab-contact-err" role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.contact}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="collab-budget" className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                          Estimasi Budget
                        </label>
                        <select
                          id="collab-budget"
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          className={inputCls(false)}
                        >
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="collab-notes" className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                        Catatan Singkat / Ringkasan Ide Proyek
                      </label>
                      <textarea
                        id="collab-notes"
                        rows={3}
                        placeholder="Jelaskan kebutuhan utama, timeline target, atau tantangan bisnis saat ini..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className={`${inputCls(false)} resize-none`}
                      />
                    </div>

                    {status === "error" && (
                      <p role="alert" className="flex items-start gap-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errorMsg}
                      </p>
                    )}

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-accent-bronze" />
                          hello@logia.id
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-accent-bronze" />
                          +62 812-3456-7890
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full sm:w-auto px-8 py-3 min-h-[48px] rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Kirim Pesan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
