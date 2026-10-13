"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle2, Phone, Mail, AlertCircle, Loader2, ImageDown, FileDown, MessageCircle } from "lucide-react";
import { ALL_PACKAGES, CUSTOM_SERVICE_OPTION, packageOptionLabel } from "@/lib/rate-card";
import type { CollabDraft, Receipt } from "@/lib/receipt";
import { ReceiptView } from "./Receipt";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft?: CollabDraft | null;
  onDraftConsumed?: () => void;
}

// Opsi layanan = paket dari rate-card (SATU sumber). Value = id unik; label = nama · solusi.
const serviceOptions = [
  ...ALL_PACKAGES.map((e) => ({ value: e.pkg.id, label: packageOptionLabel(e.pkg, e.solution) })),
  { value: CUSTOM_SERVICE_OPTION, label: CUSTOM_SERVICE_OPTION },
];

const budgetRanges = [
  "< Rp 5 Juta",
  "Rp 5 - 15 Juta",
  "Rp 15 - 35 Juta",
  "> Rp 35 Juta",
];

const CUSTOM_BUDGET = "Lainnya, ketik sendiri";

type Status = "idle" | "loading" | "success" | "error";

export function CollaborationModal({ isOpen, onClose, initialDraft, onDraftConsumed }: CollaborationModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    ALL_PACKAGES[0]?.pkg.id ?? CUSTOM_SERVICE_OPTION,
  ]);
  const [selectedBudget, setSelectedBudget] = useState("Rp 5 - 15 Juta");
  const [customBudget, setCustomBudget] = useState("");

  // Prefill dari chatbot: draft dikonsumsi sekali saat modal dibuka
  useEffect(() => {
    if (isOpen && initialDraft) {
      setFormData({ name: initialDraft.name, brandName: initialDraft.brandName, contact: initialDraft.contact, notes: initialDraft.notes });
      setSelectedServices(initialDraft.services);
      if (initialDraft.budget && !budgetRanges.includes(initialDraft.budget)) {
        setSelectedBudget(CUSTOM_BUDGET);
        setCustomBudget(initialDraft.budget);
      } else if (initialDraft.budget) {
        setSelectedBudget(initialDraft.budget);
      }
      setStatus("idle");
      setFieldErrors({});
      onDraftConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialDraft]);
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
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const exportPNG = async () => {
    if (!receiptRef.current || exporting) return;
    setExporting("png");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: "#ffffff", logging: false, useCORS: true });
      const a = document.createElement("a");
      a.download = `${receipt?.id ?? "struk"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    if (!receiptRef.current || exporting) return;
    setExporting("pdf");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: "#ffffff", logging: false, useCORS: true });
      const imgW = 72; // 80mm kurang margin
      const imgH = (canvas.height * imgW) / canvas.width;
      const pageH = Math.max(imgH + 16, 120);
      const pdf = new jsPDF({ unit: "mm", format: [80, pageH] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 4, 8, imgW, imgH);
      pdf.save(`${receipt?.id ?? "struk"}.pdf`);
    } finally {
      setExporting(null);
    }
  };

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
    if (selectedBudget === CUSTOM_BUDGET && customBudget.trim().length < 3) errs.budget = "Tulis budget spesifik Anda (cth. Rp 7,5 juta).";
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
          budget: selectedBudget === CUSTOM_BUDGET ? customBudget.trim().slice(0, 80) : selectedBudget,
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

  // ponytail: nomor CP hardcode, pindah ke env/config bila multi-admin.
  const waLink = receipt
    ? `https://wa.me/6289521375477?text=${encodeURIComponent(
        `Halo Logia Creative! Saya ${receipt.customer}${receipt.brand ? ` (${receipt.brand})` : ""} baru saja mengisi form kolaborasi.\n\nID: ${receipt.id}\nPaket: ${receipt.packageName} · ${receipt.solutionName}\nHarga: ${receipt.priceLabel}\n\nSaya ingin langsung mengurus paket ini. Terima kasih!`
      )}`
    : "https://wa.me/6289521375477";

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none transition-all min-h-[48px] shadow-sm ${
      hasError
        ? "border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500/20"
        : "border-black/15 dark:border-white/15 focus:border-[var(--accent-bronze)] dark:focus:border-[var(--accent-bronze)] focus:ring-2 focus:ring-[var(--accent-bronze)]/20"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl z-10 my-4 sm:my-8 flex flex-col"
          >
            <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/15 shadow-2xl p-5 sm:p-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-10 flex-1 relative overflow-hidden">
              {/* Ambient accent top highlight */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-bronze)] to-transparent opacity-80" />

              <button
                onClick={onClose}
                aria-label="Tutup formulir"
                className="absolute top-5 right-5 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-95 z-20"
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
                    <ReceiptView ref={receiptRef} receipt={receipt} />
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Struk email ikut terkirim ke tim kami.</p>
                  )}
                  <div className="flex flex-col gap-3 pt-2">
                    {/* btn-collaborate: dikecualikan dari override link lightmode (globals.css) agar teks tetap putih */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-collaborate w-full px-8 py-3 min-h-[48px] rounded-full bg-[#25D366] text-white font-semibold text-sm active:scale-95 flex items-center justify-center gap-2 hover:brightness-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Hubungi via WhatsApp
                    </a>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={exportPNG}
                        disabled={!receipt || exporting !== null}
                        className="w-full px-6 py-3 min-h-[48px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        <ImageDown className="w-4 h-4" />
                        {exporting === "png" ? "Menyimpan..." : "Download PNG"}
                      </button>
                      <button
                        onClick={exportPDF}
                        disabled={!receipt || exporting !== null}
                        className="w-full px-6 py-3 min-h-[48px] rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        <FileDown className="w-4 h-4" />
                        {exporting === "pdf" ? "Menyimpan..." : "Download PDF"}
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full px-6 py-3 min-h-[48px] rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm active:scale-95"
                      >
                        Selesai & Tutup
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-bronze)]/10 text-[var(--accent-bronze)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--accent-bronze)]/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      Kemitraan Strategis
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-black dark:text-white mb-2">
                      Mulai Kolaborasi Bersama Logia
                    </h2>
                    <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">
                      Diskusikan ide besar bisnis Anda. Kami bantu formulasi strategi kreatif dan implementasi teknologinya.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
                    <div>
                      <span id="svc-label" className="block text-xs font-semibold uppercase tracking-wider text-black dark:text-white mb-3">
                        Pilih Kebutuhan Layanan
                      </span>
                      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="svc-label">
                        {serviceOptions.map((srv) => {
                          const active = selectedServices.includes(srv.value);
                          return (
                            <button
                              type="button"
                              key={srv.value}
                              onClick={() => toggleService(srv.value)}
                              aria-pressed={active}
                              className={`text-xs px-4 py-2.5 min-h-[44px] rounded-full border transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                                active
                                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md font-semibold"
                                  : "bg-black/[0.03] dark:bg-white/[0.04] text-[#444444] dark:text-[#CCCCCC] border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[var(--accent-bronze)]" : "bg-neutral-400 dark:bg-neutral-600"}`} />
                              {srv.label}
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
                        <label htmlFor="collab-name" className="block text-xs font-semibold text-black dark:text-white mb-2">
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
                        <label htmlFor="collab-brand" className="block text-xs font-semibold text-black dark:text-white mb-2">
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
                        <label htmlFor="collab-contact" className="block text-xs font-semibold text-black dark:text-white mb-2">
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
                        <label htmlFor="collab-budget" className="block text-xs font-semibold text-black dark:text-white mb-2">
                          Estimasi Budget
                        </label>
                        <select
                          id="collab-budget"
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          className={inputCls(false)}
                        >
                          {budgetRanges.map((b) => (
                            <option key={b} value={b} className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white">
                              {b}
                            </option>
                          ))}
                          <option value={CUSTOM_BUDGET} className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white">
                            {CUSTOM_BUDGET}
                          </option>
                        </select>
                        {selectedBudget === CUSTOM_BUDGET && (
                          <input
                            id="collab-budget-custom"
                            type="text"
                            maxLength={80}
                            placeholder="cth. Rp 7,5 juta / bulan"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                            aria-label="Budget custom"
                            aria-invalid={!!fieldErrors.budget}
                            className={`${inputCls(!!fieldErrors.budget)} mt-2`}
                          />
                        )}
                        {fieldErrors.budget && (
                          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.budget}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="collab-notes" className="block text-xs font-semibold text-black dark:text-white mb-2">
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

                    <div className="sticky bottom-0 -mx-5 sm:-mx-10 px-5 sm:px-10 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs text-[#666666] dark:text-[#999999]">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[var(--accent-bronze)]" />
                          logiacreative.id@gmail.com
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--accent-bronze)]" />
                          +62 895-2137-5477
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full sm:w-auto px-8 h-12 min-h-[48px] rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-wait"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                            <span>Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-white dark:text-black" />
                            <span>Kirim Pesan</span>
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
