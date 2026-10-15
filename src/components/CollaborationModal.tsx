"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Phone, Mail, AlertCircle, Loader2, ImageDown, FileDown, MessageCircle } from "lucide-react";
import { SOLUTIONS, CUSTOM_SERVICE_OPTION, packageOptionLabel } from "@/lib/rate-card";
import type { CollabDraft, Receipt } from "@/lib/receipt";
import { ReceiptView } from "./Receipt";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft?: CollabDraft | null;
  onDraftConsumed?: () => void;
}

const budgetRanges = [
  "< Rp 5 Juta",
  "Rp 5 - 15 Juta",
  "Rp 15 - 35 Juta",
  "> Rp 35 Juta",
];

const CUSTOM_BUDGET = "Lainnya, ketik sendiri";

type Status = "idle" | "loading" | "success" | "error";

// ── Kelas bersama (dipakai juga oleh ChatWidget, Modul 5):
//    garis hairline, radius kecil, tanpa bayangan — minimalist luxury.
const FIELD =
  "w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 " +
  "border-b border-[color-mix(in_srgb,var(--text-primary)_22%,transparent)] rounded-none " +
  "px-0 py-3 min-h-[46px] transition-colors focus:outline-none focus:border-[var(--text-primary)]";

const LABEL =
  "block text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--text-muted)] mb-1.5";

// Label pengelompokan paket. Tanpa opacity: /80 menurunkan kontras 11px di bawah AA.
const GROUP_LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--text-muted)] mb-2";

const ERR = "mt-1.5 text-xs font-medium text-red-600 dark:text-red-400";

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-full " +
  "bg-black text-white dark:bg-white dark:text-black text-sm font-semibold " +
  "hover:opacity-90 active:scale-[0.98] transition-[transform,opacity] disabled:opacity-60 disabled:cursor-wait";

export function CollaborationModal({ isOpen, onClose, initialDraft, onDraftConsumed }: CollaborationModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    SOLUTIONS[0]?.packages[0]?.id ?? CUSTOM_SERVICE_OPTION,
  ]);
  const [selectedBudget, setSelectedBudget] = useState("Rp 5 - 15 Juta");
  const [customBudget, setCustomBudget] = useState("");

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

  // Prefill: draft dari chatbot ATAU pilihan paket dari Rate Card ("Pilih {PAKET}").
  // Dikonsumsi sekali tiap kali modal dibuka / draft diganti.
  useEffect(() => {
    if (isOpen && initialDraft) {
      setFormData({
        name: initialDraft.name,
        brandName: initialDraft.brandName,
        contact: initialDraft.contact,
        notes: initialDraft.notes,
      });
      if (initialDraft.services.length) setSelectedServices(initialDraft.services);
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

  // Esc menutup (aksesibilitas) + kunci scroll body selama modal terbuka.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "loading") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, status]);

  // WAJIB sebelum html2canvas: tanpa ini font web jatuh ke default saat export,
  // sehingga PNG/PDF tidak identik dengan tampilan struk di layar.
  const ensureFonts = async () => {
    try {
      await document.fonts.ready;
    } catch {
      /* browser tanpa Font Loading API: lanjut saja */
    }
  };

  const exportPNG = async () => {
    if (!receiptRef.current || exporting) return;
    setExporting("png");
    try {
      await ensureFonts();
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
      await ensureFonts();
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: "#ffffff", logging: false, useCORS: true });
      // Satu halaman berproporsi persis struk → hasil identik tampilan, tanpa potongan.
      const pageW = 210; // A4 lebar (mm)
      const pageH = (canvas.height * pageW) / canvas.width;
      const pdf = new jsPDF({ unit: "mm", format: [pageW, pageH], orientation: "portrait" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pageW, pageH);
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
    `${FIELD} ${hasError ? "!border-red-500 dark:!border-red-400" : ""}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain" role="dialog" aria-modal="true" aria-label="Formulir kolaborasi">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative w-full max-w-2xl z-10 my-4 sm:my-8 flex flex-col form-sheet"
          >
            <div className="glass-card rounded-[1.25rem] sm:rounded-[1.75rem] border border-[color-mix(in_srgb,var(--text-primary)_12%,transparent)] p-5 sm:p-9 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-9 flex-1 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-[var(--text-primary)]/25" aria-hidden="true" />

              <button
                onClick={onClose}
                aria-label="Tutup formulir"
                className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors active:scale-95 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {status === "success" ? (
                <div className="py-4 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full border border-[color-mix(in_srgb,var(--text-primary)_14%,transparent)] flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[var(--text-primary)]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.01em] text-[var(--text-primary)]">
                      Terima kasih, {formData.name || "Mitra Hebat"}.
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                      Pesan Anda sudah terkirim. Kami akan menghubungi Anda melalui kontak yang dicantumkan dalam 1x24 jam kerja.
                    </p>
                  </div>
                  {receipt ? (
                    <ReceiptView ref={receiptRef} receipt={receipt} />
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] text-center">Struk email ikut terkirim ke tim kami.</p>
                  )}
                  <div className="flex flex-col gap-3 pt-1">
                    {/* btn-collaborate: dikecualikan dari override link lightmode (globals.css) agar teks tetap putih */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-collaborate w-full px-8 min-h-[48px] rounded-full bg-[#25D366] text-white font-semibold text-sm active:scale-95 flex items-center justify-center gap-2 hover:brightness-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Hubungi via WhatsApp
                    </a>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={exportPNG}
                        disabled={!receipt || exporting !== null}
                        className="w-full px-6 min-h-[48px] rounded-full border border-[color-mix(in_srgb,var(--text-primary)_18%,transparent)] text-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        <ImageDown className="w-4 h-4" />
                        {exporting === "png" ? "Menyimpan..." : "Download PNG"}
                      </button>
                      <button
                        onClick={exportPDF}
                        disabled={!receipt || exporting !== null}
                        className="w-full px-6 min-h-[48px] rounded-full border border-[color-mix(in_srgb,var(--text-primary)_18%,transparent)] text-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        <FileDown className="w-4 h-4" />
                        {exporting === "pdf" ? "Menyimpan..." : "Download PDF"}
                      </button>
                      <button onClick={handleReset} className={BTN_PRIMARY + " w-full"}>
                        Selesai &amp; Tutup
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-[1.4rem] sm:text-3xl font-medium tracking-[-0.02em] text-[var(--text-primary)] mb-6 sm:mb-8">
                    Mulai Kolaborasi
                  </h2>

                  <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8">
                    {/* Paket dari rate-card, dikelompokkan per kategori solusi */}
                    <fieldset>
                      <legend id="svc-label" className={LABEL + " mb-3"}>
                        Pilih Kebutuhan Layanan
                      </legend>
                      <div className="space-y-3.5" role="group" aria-labelledby="svc-label">
                        {SOLUTIONS.map((sol) => (
                          <div key={sol.id}>
                            <p className={GROUP_LABEL}>
                              {sol.name}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {sol.packages.map((pkg) => {
                                const active = selectedServices.includes(pkg.id);
                                return (
                                  <button
                                    type="button"
                                    key={pkg.id}
                                    onClick={() => toggleService(pkg.id)}
                                    aria-pressed={active}
                                    aria-label={packageOptionLabel(pkg, sol)}
                                    className={`text-xs px-3.5 py-2.5 min-h-[44px] rounded-full border transition-colors duration-200 active:scale-95 ${
                                      active
                                        ? "bg-black text-white dark:bg-white dark:text-black border-transparent font-semibold"
                                        : "bg-transparent text-[var(--text-primary)] border-[color-mix(in_srgb,var(--text-primary)_16%,transparent)] hover:border-[var(--text-primary)]/40"
                                    }`}
                                  >
                                    {pkg.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <div>
                          <p className={GROUP_LABEL}>
                            Lainnya
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleService(CUSTOM_SERVICE_OPTION)}
                            aria-pressed={selectedServices.includes(CUSTOM_SERVICE_OPTION)}
                            className={`text-xs px-3.5 py-2.5 min-h-[44px] rounded-full border transition-colors duration-200 active:scale-95 ${
                              selectedServices.includes(CUSTOM_SERVICE_OPTION)
                                ? "bg-black text-white dark:bg-white dark:text-black border-transparent font-semibold"
                                : "bg-transparent text-[var(--text-primary)] border-[color-mix(in_srgb,var(--text-primary)_16%,transparent)] hover:border-[var(--text-primary)]/40"
                            }`}
                          >
                            {CUSTOM_SERVICE_OPTION}
                          </button>
                        </div>
                      </div>
                      {fieldErrors.services && (
                        <p role="alert" className={ERR}>{fieldErrors.services}</p>
                      )}
                    </fieldset>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label htmlFor="collab-name" className={LABEL}>Nama Lengkap *</label>
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
                          <p id="collab-name-err" role="alert" className={ERR}>{fieldErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="collab-brand" className={LABEL}>Nama Brand / Usaha</label>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label htmlFor="collab-contact" className={LABEL}>WhatsApp / Email *</label>
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
                          <p id="collab-contact-err" role="alert" className={ERR}>{fieldErrors.contact}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="collab-budget" className={LABEL}>Estimasi Budget</label>
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
                            className={`${inputCls(!!fieldErrors.budget)} mt-3`}
                          />
                        )}
                        {fieldErrors.budget && (
                          <p role="alert" className={ERR}>{fieldErrors.budget}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="collab-notes" className={LABEL}>Catatan / Ringkasan Ide Proyek</label>
                      <textarea
                        id="collab-notes"
                        rows={3}
                        placeholder="Jelaskan kebutuhan utama, timeline target, atau tantangan bisnis saat ini..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className={`${FIELD} resize-none`}
                      />
                    </div>

                    {status === "error" && (
                      <p role="alert" className="flex items-start gap-2 text-sm font-medium text-red-600 dark:text-red-400 border-l-2 border-red-500 pl-3 py-1">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errorMsg}
                      </p>
                    )}

                    <div className="sticky bottom-0 -mx-5 sm:-mx-9 px-5 sm:px-9 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] bg-[var(--bg-primary)]/92 backdrop-blur-md">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          logiacreative.id@gmail.com
                        </span>
                        <span className="hidden sm:inline text-[var(--text-muted)]/40" aria-hidden="true">|</span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />
                          +62 895-2137-5477
                        </span>
                      </div>

                      <button type="submit" disabled={status === "loading"} className={BTN_PRIMARY + " w-full sm:w-auto"}>
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
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