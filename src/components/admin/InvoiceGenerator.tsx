"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  InvoicePreview,
  InvoiceData,
  InvoiceItem,
  formatRupiah,
} from "./InvoicePreview";
import {
  FileDown,
  ImageDown,
  Printer,
  Copy,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Receipt,
  CreditCard,
  User,
  Hash,
  Eye,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";
import { ALL_PACKAGES } from "@/lib/rate-card";

function generateDefaultInvoiceNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(100 + Math.random() * 900);
  return `INV/${year}${month}/${rand}`;
}

const PAYMENT_PRESETS = [
  {
    name: "BCA",
    label: "Bank BCA",
    number: "0123456789",
    account: "Logia Creative",
  },
  {
    name: "Mandiri",
    label: "Bank Mandiri",
    number: "1370012345678",
    account: "Logia Creative",
  },
  {
    name: "BRI",
    label: "Bank BRI",
    number: "002101001234500",
    account: "Logia Creative",
  },
  {
    name: "QRIS",
    label: "QRIS All Payment",
    number: "NMID: ID1020304050",
    account: "Logia Creative",
  },
  {
    name: "Seabank",
    label: "Seabank",
    number: "901234567890",
    account: "Logia Creative",
  },
];

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>({
    invoiceNo: "INV/202610/001",
    clientName: "Tim SAVR",
    status: "dp",
    dpDueDate: "3 Hari Setelah Invoice",
    workDuration: "3 - 5 Hari Kerja",
    revisionLimit: "2x Revisi Minor",
    items: [
      {
        id: "1",
        description: "Paket Starter Brand Website",
        qty: 1,
        price: 220000,
      },
    ],
    paymentVia: "Bank BCA",
    accountNumber: "0123456789",
    accountName: "Logia Creative",
  });

  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isExporting, setIsExporting] = useState<"pdf" | "png" | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Total terhitung otomatis
  const grandTotal = data.items.reduce(
    (acc, it) => acc + (Number(it.qty) || 0) * (Number(it.price) || 0),
    0
  );

  // Pencegahan keluar halaman jika invoice belum diunduh
  useEffect(() => {
    // 1. Browser tab close / refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasDownloaded) {
        e.preventDefault();
        e.returnValue = "Perhatian: Invoice belum Anda download. Pastikan sudah didownload sebelum keluar.";
        return e.returnValue;
      }
    };

    // 2. Navigasi internal di dalam Next.js (klik link pada navbar atau halaman)
    const handleAnchorClick = (e: MouseEvent) => {
      if (hasDownloaded) return;
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && !target.href.startsWith("javascript:")) {
        try {
          const url = new URL(target.href, window.location.origin);
          if (url.pathname !== window.location.pathname) {
            const confirmed = window.confirm(
              "⚠️ PERINGATAN: Invoice Belum Diunduh!\n\n" +
              "Hasil invoice TIDAK disimpan di server/database agar ukuran repository tidak membengkak.\n\n" +
              "Pastikan Anda telah mengklik tombol 'Download PDF' atau 'Download PNG' sebelum meninggalkan halaman ini.\n\n" +
              "Apakah Anda yakin ingin tetap meninggalkan halaman ini dan membuang invoice saat ini?"
            );
            if (!confirmed) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        } catch {
          // Abaikan link eksternal yang tidak valid
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [hasDownloaded]);

  // Helper perubahan field (reset status download saat data diubah)
  const updateField = (key: keyof InvoiceData, value: any) => {
    setHasDownloaded(false);
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Helper item
  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setHasDownloaded(false);
    setData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: value,
      };
      return { ...prev, items: nextItems };
    });
  };

  const addItem = () => {
    setHasDownloaded(false);
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          description: "",
          qty: 1,
          price: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    setHasDownloaded(false);
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const pickPresetRateCard = (name: string, price: number) => {
    setHasDownloaded(false);
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          description: name,
          qty: 1,
          price: price,
        },
      ],
    }));
  };

  const applyPaymentPreset = (preset: (typeof PAYMENT_PRESETS)[0]) => {
    setHasDownloaded(false);
    setData((prev) => ({
      ...prev,
      paymentVia: preset.label,
      accountNumber: preset.number,
      accountName: preset.account,
    }));
  };

  // Export ke PNG
  const handleDownloadPNG = async () => {
    if (!previewRef.current || isExporting) return;
    setIsExporting("png");
    try {
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2.5,
        backgroundColor: "#071838",
        useCORS: true,
        logging: false,
      });

      const fileName = `${data.invoiceNo.replace(/\//g, "-")}.png`;
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setHasDownloaded(true);
    } catch (err) {
      console.error("Gagal export PNG:", err);
      alert("Gagal mengunduh PNG. Silakan coba kembali.");
    } finally {
      setIsExporting(null);
    }
  };

  // Export ke PDF
  const handleDownloadPDF = async () => {
    if (!previewRef.current || isExporting) return;
    setIsExporting("pdf");
    try {
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(previewRef.current, {
        scale: 2.5,
        backgroundColor: "#071838",
        useCORS: true,
        logging: false,
      });

      // Proporsi lembar cetak
      const widthMm = 210; // A4 standard width (mm)
      const heightMm = (canvas.height * widthMm) / canvas.width;

      const pdf = new jsPDF({
        unit: "mm",
        format: [widthMm, heightMm],
        orientation: "portrait",
      });

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, widthMm, heightMm);
      pdf.save(`${data.invoiceNo.replace(/\//g, "-")}.pdf`);
      setHasDownloaded(true);
    } catch (err) {
      console.error("Gagal export PDF:", err);
      alert("Gagal mengunduh PDF. Silakan coba kembali.");
    } finally {
      setIsExporting(null);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Salin Rincian ke WhatsApp
  const handleCopyWhatsApp = () => {
    const itemsList = data.items
      .map(
        (it) =>
          `• ${it.description || "Item"} (Qty: ${it.qty}) - ${formatRupiah(
            (Number(it.qty) || 0) * (Number(it.price) || 0)
          )}`
      )
      .join("\n");

    const statusText =
      data.status === "lunas"
        ? "LUNAS ✅"
        : `DP (Jatuh Tempo: ${data.dpDueDate || "-"}) ⏳`;

    const message = `*INVOICE RESMI LOGIA CREATIVE*
---------------------------------------
*No. Invoice:* ${data.invoiceNo}
*Kepada Yth:* ${data.clientName}
*Status:* ${statusText}
${data.workDuration ? `*Total Pengerjaan:* ${data.workDuration}\n` : ""}${data.revisionLimit ? `*Batas Revisi:* ${data.revisionLimit}\n` : ""}
*Rincian Tagihan:*
${itemsList}

*TOTAL:* ${formatRupiah(grandTotal)}
---------------------------------------
*Metode Pembayaran:*
• Via: ${data.paymentVia}
${data.accountNumber ? `• No. Rekening: ${data.accountNumber}\n` : ""}• Atas Nama: ${data.accountName}

Terima kasih atas kepercayaan dan kerja sama Anda dengan Logia Creative!
🌐 https://logia-creative.vercel.app/`;

    navigator.clipboard.writeText(message);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ── BREADCRUMB & HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-semibold">
                Admin Panel
              </span>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Standar Desain Figma Resmi
              </span>
            </div>
            <h1 className="font-righteous text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-100 mt-1">
              Generator Invoice
            </h1>
          </div>
        </div>

        {/* Tab switcher untuk mobile */}
        <div className="flex sm:hidden p-1 rounded-xl bg-neutral-200 dark:bg-neutral-800">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "form"
                ? "bg-white dark:bg-neutral-900 text-black dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Input Data
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-neutral-900 text-black dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Lihat Desain
          </button>
        </div>
      </div>

      {/* ── BANNER PERINGATAN KELUAR & STATUS PENYIMPANAN ── */}
      {!hasDownloaded ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-fade-in">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-amber-800 dark:text-amber-300">Peringatan:</strong> Hasil invoice <strong>tidak disimpan di database/server</strong> agar kapasitas repository tidak membengkak. Pastikan Anda menekan <strong>Download PDF</strong> atau <strong>Download PNG</strong> sebelum meninggalkan halaman ini.
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold text-[11px]">
            ⚠️ Belum Diunduh
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 shadow-sm animate-fade-in">
          <div className="flex items-start sm:items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-emerald-800 dark:text-emerald-300">Invoice Tersimpan di Perangkat:</strong> Dokumen telah berhasil Anda unduh. Anda aman untuk keluar atau berpindah halaman.
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold text-[11px]">
            ✅ Sudah Diunduh
          </span>
        </div>
      )}

      {/* ── MAIN CONTENT (2 COLUMNS ON DESKTOP) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* KOLOM KIRI: FORMULIR INPUT */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeTab === "preview" ? "hidden sm:block" : "block"
          }`}
        >
          {/* Card 1: Data Klien & No Invoice */}
          <div className="p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Informasi Klien & Tagihan
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nomor Invoice
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={data.invoiceNo}
                      onChange={(e) => updateField("invoiceNo", e.target.value)}
                      placeholder="INV/202610/001"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <button
                    onClick={() =>
                      updateField("invoiceNo", generateDefaultInvoiceNo())
                    }
                    type="button"
                    title="Buat nomor invoice baru"
                    className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nama Klien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  placeholder="Contoh: Tim SAVR / PT Solusi Digital"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Card: Status Pembayaran & Ketentuan Pengerjaan */}
          <div className="p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Status Tagihan &amp; Ketentuan Layanan
            </h2>

            <div className="space-y-4">
              {/* Pilihan Status: DP atau Lunas */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Status Pembayaran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("status", "dp")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      data.status === "dp"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-black/10 dark:border-white/10 hover:border-amber-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-200" />
                    DP (Down Payment)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("status", "lunas")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      data.status === "lunas"
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-black/10 dark:border-white/10 hover:border-emerald-500"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-200" />
                    Lunas
                  </button>
                </div>
              </div>

              {/* Jatuh Tempo DP (Hanya muncul jika status DP) */}
              {data.status === "dp" && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-fade-in">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-300">
                    Jatuh Tempo DP (Manual) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.dpDueDate || ""}
                    onChange={(e) => updateField("dpDueDate", e.target.value)}
                    placeholder="Contoh: 26 Oktober 2026 / 3 Hari setelah invoice"
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-white dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 py-0.5">Preset Cepat:</span>
                    {["1x24 Jam", "3 Hari Kerja", "7 Hari", "Sebelum Mulai Pekerjaan"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateField("dpDueDate", preset)}
                        className="px-2 py-0.5 rounded text-[10.5px] bg-white dark:bg-neutral-800 text-amber-800 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Pengerjaan Berapa Hari */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Total Pengerjaan Berapa Hari (Manual)</span>
                  <span className="text-[11px] text-neutral-400 font-normal">cth: 3 - 5 Hari Kerja</span>
                </label>
                <input
                  type="text"
                  value={data.workDuration || ""}
                  onChange={(e) => updateField("workDuration", e.target.value)}
                  placeholder="Contoh: 3 - 5 Hari Kerja / 7 Hari"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {["1 - 3 Hari Kerja", "3 - 5 Hari Kerja", "7 - 14 Hari Kerja", "14 - 30 Hari"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateField("workDuration", preset)}
                      className="px-2 py-0.5 rounded text-[10.5px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/5 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Berapa Kali Revisi */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Berapa Kali Revisi (Manual)</span>
                  <span className="text-[11px] text-neutral-400 font-normal">cth: 2x Revisi Minor</span>
                </label>
                <input
                  type="text"
                  value={data.revisionLimit || ""}
                  onChange={(e) => updateField("revisionLimit", e.target.value)}
                  placeholder="Contoh: 2x Revisi Minor / Maksimal 3x"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {["1x Revisi", "2x Revisi Minor", "3x Revisi", "Bebas Revisi Minor"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateField("revisionLimit", preset)}
                      className="px-2 py-0.5 rounded text-[10.5px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/5 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Daftar Item / Layanan */}
          <div className="p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Rincian Layanan / Pekerjaan
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Baris
              </button>
            </div>

            {/* Quick Picker dari Paket Rate Card Logia */}
            <div className="p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-black/5 dark:border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                Pilih Cepat dari Rate Card Logia:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {ALL_PACKAGES.slice(0, 8).map(({ pkg }) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => pickPresetRateCard(pkg.name, pkg.price)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/5 dark:border-white/5 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all active:scale-95"
                  >
                    + {pkg.name} ({formatRupiah(pkg.price)})
                  </button>
                ))}
              </div>
            </div>

            {/* Input Baris Item */}
            <div className="space-y-3">
              {data.items.map((item, index) => {
                const subtotal =
                  (Number(item.qty) || 0) * (Number(item.price) || 0);
                return (
                  <div
                    key={item.id || index}
                    className="p-3 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-900/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        Item #{index + 1}
                      </span>
                      {data.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Deskripsi Layanan / Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        placeholder="Contoh: Paket Starter Brand Website"
                        className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-3">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "qty",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-full px-2.5 py-2 text-center rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>

                      <div className="col-span-5">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Harga Satuan (Rp)
                        </label>
                        <input
                          type="number"
                          step="1000"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-full px-3 py-2 text-right rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 text-sm font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 text-right">
                          Total Baris
                        </label>
                        <div className="px-3 py-2 text-right rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 text-sm font-semibold font-mono text-cyan-600 dark:text-cyan-400">
                          {formatRupiah(subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Ringkasan */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
              <span className="font-bold text-sm uppercase tracking-wider text-cyan-900 dark:text-cyan-300">
                Grand Total (Otomatis)
              </span>
              <span className="font-extrabold text-lg sm:text-xl font-mono text-cyan-600 dark:text-cyan-400">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>

          {/* Card 3: Metode Pembayaran */}
          <div className="p-5 sm:p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Metode Pembayaran
            </h2>

            {/* Tombol Preset Cepat */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                Pilih Preset Rekening / Payment:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PAYMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPaymentPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      data.paymentVia.includes(preset.name)
                        ? "bg-cyan-500 text-white border-cyan-500 shadow-sm"
                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-black/10 dark:border-white/10 hover:border-cyan-500"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Via
                </label>
                <input
                  type="text"
                  value={data.paymentVia}
                  onChange={(e) => updateField("paymentVia", e.target.value)}
                  placeholder="Contoh: Bank BCA / Mandiri / QRIS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nomor Rekening / Virtual Account (Opsional)
                </label>
                <input
                  type="text"
                  value={data.accountNumber || ""}
                  onChange={(e) => updateField("accountNumber", e.target.value)}
                  placeholder="Contoh: 0123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Atas Nama (A/N)
                </label>
                <input
                  type="text"
                  value={data.accountName}
                  onChange={(e) => updateField("accountName", e.target.value)}
                  placeholder="Contoh: Logia Creative / Nama Pemilik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE PREVIEW & ACTION BAR */}
        <div
          className={`lg:col-span-6 space-y-4 lg:sticky lg:top-24 ${
            activeTab === "form" ? "hidden sm:block" : "block"
          }`}
        >
          {/* Action Toolbar */}
          <div className="p-3 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-md flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 px-1 hidden sm:inline-block">
                Aksi Dokumen:
              </span>
              {hasDownloaded ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Sudah Terunduh
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Belum Diunduh
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Tombol PDF */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExporting !== null}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                <span>
                  {isExporting === "pdf" ? "Memproses..." : "Download PDF"}
                </span>
              </button>

              {/* Tombol PNG */}
              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isExporting !== null}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <ImageDown className="w-4 h-4" />
                <span>
                  {isExporting === "png" ? "Memproses..." : "Download PNG"}
                </span>
              </button>

              {/* Tombol WhatsApp */}
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold text-xs transition-all active:scale-95"
                title="Salin teks tagihan untuk WhatsApp"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin WA</span>
                  </>
                )}
              </button>

              {/* Tombol Cetak Langsung */}
              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Cetak langsung"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Container Preview Kartu Invoice Figma */}
          <div className="p-3 sm:p-5 rounded-3xl border border-black/10 dark:border-white/10 bg-neutral-100/70 dark:bg-neutral-900/70 flex justify-center overflow-x-auto shadow-inner">
            <InvoicePreview ref={previewRef} data={data} />
          </div>

          <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400">
            Pratinjau di atas rendered 1:1 sesuai desain Figma Logia. Hasil unduhan PDF/PNG akan beresolusi tinggi dan jernih.
          </p>
        </div>
      </div>
    </div>
  );
}
