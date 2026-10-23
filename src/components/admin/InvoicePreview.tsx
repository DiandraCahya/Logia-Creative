"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Instagram, Globe } from "lucide-react";

export type PaymentStatus = "dp" | "lunas";

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export interface InvoiceData {
  invoiceNo: string;
  clientName: string;
  date?: string;
  status: PaymentStatus;
  dpDueDate?: string;
  workDuration?: string;
  revisionLimit?: string;
  items: InvoiceItem[];
  paymentVia: string;
  accountNumber?: string;
  accountName: string;
}

export function formatRupiah(value: number): string {
  return "Rp" + Math.max(0, Math.floor(value || 0)).toLocaleString("id-ID");
}

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  function InvoicePreview({ data }, ref) {
    const totalAmount = (data.items || []).reduce(
      (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0
    );

    return (
      <div
        ref={ref}
        id="invoice-document"
        className="relative w-full max-w-[500px] mx-auto overflow-hidden rounded-[24px] shadow-2xl select-none"
        style={{
          minHeight: "710px",
          backgroundColor: "#071838",
          backgroundImage: "linear-gradient(175deg, #0a2147 0%, #061633 45%, #030c1c 100%)",
          color: "#ffffff",
          fontFamily:
            'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          pageBreakInside: "avoid",
        }}
      >
        {/* Halftone Dot Grid Pattern via SVG (Dijamin Tampil di Layar Maupun Hasil Download HTML2Canvas/PDF/PNG) */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.25 }}
        >
          <defs>
            <pattern
              id="invoice-halftone-pattern"
              x="0"
              y="0"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#38bdf8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#invoice-halftone-pattern)" />
        </svg>

        {/* Dekorasi Bentuk Organik Cyan / Turquoise Sesuai Figma */}
        {/* Top-Left Turquoise Curved Blob */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -left-12 w-48 h-32 rounded-full pointer-events-none opacity-85 z-0"
          style={{
            backgroundColor: "#2ed1bf",
          }}
        />
        {/* Top-Center Aqua Curve */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-32 w-36 h-24 rounded-full pointer-events-none opacity-75 z-0"
          style={{
            backgroundColor: "#22d3ee",
          }}
        />

        {/* Right Middle Curved Cyan Shape (Signature Figma Accent) */}
        <div
          aria-hidden="true"
          className="absolute top-28 -right-28 w-52 h-64 rounded-full pointer-events-none opacity-80 z-0"
          style={{
            backgroundColor: "#2ed1bf",
          }}
        />

        {/* Bottom-Left Cyan Shape */}
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none opacity-70 z-0"
          style={{
            backgroundColor: "#2ed1bf",
          }}
        />

        {/* Inner Content Padding */}
        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 flex flex-col justify-between min-h-[710px]">
          <div>
            {/* ── HEADER: "Invoice" (Script + Sans) & Logo Logia ── */}
            <div className="flex items-center justify-between gap-4 mb-7">
              {/* Judul Invoice */}
              <div className="flex items-center">
                {/* Script "I" rendered as Vector SVG (100% Identik di semua browser dan hasil export) */}
                <svg
                  viewBox="0 0 54 68"
                  className="h-14 sm:h-16 w-auto inline-block -mr-1.5 select-none shrink-0"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="I"
                >
                  <path
                    d="M16 46 C 12 36, 13 26, 19 18 C 25 10, 34 6, 42 7 C 48 8, 51 12, 49 18 C 47 26, 38 34, 29 42 C 20 49, 14 58, 12 65 C 10 70, 14 74, 19 72 C 25 70, 32 63, 40 53"
                    stroke="#4ee0d2"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Bold Sans "nvoice" */}
                <span
                  className="font-extrabold tracking-tight select-none"
                  style={{
                    color: "#4ee0d2",
                    fontSize: "2.4rem",
                    fontWeight: 800,
                  }}
                >
                  nvoice
                </span>
              </div>

              {/* Logo Logia Putih Asli (Bebas dari glitch CSS filter) */}
              <div className="relative w-24 sm:w-28 h-10 sm:h-12 shrink-0">
                <Image
                  src="/logia-white.png"
                  alt="Logia Creative"
                  fill
                  sizes="120px"
                  priority
                  unoptimized
                  className="object-contain object-right"
                />
              </div>
            </div>

            {/* ── INFO UTAMA: No Invoice, Nama Klien, Status & Jatuh Tempo ── */}
            <div className="space-y-1.5 mb-6 text-[13px] sm:text-[14px]">
              <div className="flex items-center font-bold tracking-wide">
                <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/95">No Invoice</span>
                <span className="mx-2 text-white/80 shrink-0">:</span>
                <span className="font-semibold text-white tracking-wider">
                  {data.invoiceNo || "INV/202610/001"}
                </span>
              </div>
              <div className="flex items-center font-bold tracking-wide">
                <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/95">Nama Klien</span>
                <span className="mx-2 text-white/80 shrink-0">:</span>
                <span className="font-semibold text-white">
                  {data.clientName || "Tim SAVR"}
                </span>
              </div>
              <div className="flex items-center font-bold tracking-wide">
                <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/95">Status</span>
                <span className="mx-2 text-white/80 shrink-0">:</span>
                {data.status === "lunas" ? (
                  <span className="font-extrabold text-[#34d399] tracking-wider uppercase">
                    Lunas
                  </span>
                ) : (
                  <span className="font-extrabold text-[#fbbf24] tracking-wider uppercase">
                    DP (Down Payment)
                  </span>
                )}
              </div>
              {data.status === "dp" && data.dpDueDate ? (
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/95">Jatuh Tempo DP</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-[#4ee0d2] tracking-wide">
                    {data.dpDueDate}
                  </span>
                </div>
              ) : null}
            </div>

            {/* ── TABEL LAYANAN / ITEM (Solid Navy Agar Tidak Tertutup Blob Cyan di HTML2Canvas) ── */}
            <div
              className="rounded-2xl overflow-hidden mb-6 shadow-lg relative z-10"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.28)",
                backgroundColor: "#082046",
              }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-12 text-[11px] sm:text-[12px] font-extrabold tracking-wider uppercase text-white"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.22)",
                }}
              >
                <div className="col-span-6 px-3.5 py-2.5">DESKRIPSI</div>
                <div
                  className="col-span-2 px-1.5 py-2.5 text-center"
                  style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.22)" }}
                >
                  QTY
                </div>
                <div
                  className="col-span-2 px-1.5 py-2.5 text-center"
                  style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.22)" }}
                >
                  HARGA
                </div>
                <div
                  className="col-span-2 px-2 py-2.5 text-right"
                  style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.22)" }}
                >
                  TOTAL
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-white/15">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, idx) => {
                    const rowTotal =
                      (Number(item.qty) || 0) * (Number(item.price) || 0);
                    return (
                      <div
                        key={item.id || idx}
                        className="grid grid-cols-12 text-[11px] sm:text-[12px] font-medium text-white/95 items-center"
                      >
                        <div className="col-span-6 px-3.5 py-2 leading-snug break-words">
                          {item.description || "Layanan / Paket"}
                        </div>
                        <div
                          className="col-span-2 px-1.5 py-2 text-center font-bold"
                          style={{
                            borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
                          }}
                        >
                          {item.qty || 1}
                        </div>
                        <div
                          className="col-span-2 px-1.5 py-2 text-center text-white/90 text-[10.5px] sm:text-[11.5px]"
                          style={{
                            borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
                          }}
                        >
                          {formatRupiah(item.price)}
                        </div>
                        <div
                          className="col-span-2 px-2 py-2 text-right font-medium text-white text-[10.5px] sm:text-[11.5px]"
                          style={{
                            borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
                          }}
                        >
                          {formatRupiah(rowTotal)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-white/60">
                    Belum ada item
                  </div>
                )}
              </div>

              {/* Table Footer: TOTAL */}
              <div
                className="grid grid-cols-12 text-[11.5px] sm:text-[12.5px] font-extrabold text-white tracking-wider uppercase items-center"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                  backgroundColor: "rgba(8, 26, 58, 0.5)",
                }}
              >
                <div className="col-span-8 px-4 py-2.5">TOTAL</div>
                <div className="col-span-4 px-3 py-2.5 text-right font-bold tracking-tight text-white">
                  {formatRupiah(totalAmount)}
                </div>
              </div>
            </div>

            {/* ── KETENTUAN PENGERJAAN & REVISI (MANUAL) ── */}
            {(data.workDuration || data.revisionLimit) && (
              <div
                className="grid grid-cols-2 gap-2 mb-6 p-2.5 sm:p-3 rounded-xl shadow-sm text-white"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  backgroundColor: "#082046",
                }}
              >
                <div>
                  <span className="block text-[10px] sm:text-[10.5px] font-bold uppercase text-white/70 tracking-wider">
                    Total Pengerjaan
                  </span>
                  <span className="font-semibold text-white text-[11.5px] sm:text-[12.5px]">
                    {data.workDuration || "3 - 5 Hari Kerja"}
                  </span>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.18)", paddingLeft: "12px" }}>
                  <span className="block text-[10px] sm:text-[10.5px] font-bold uppercase text-white/70 tracking-wider">
                    Batas Revisi
                  </span>
                  <span className="font-semibold text-white text-[11.5px] sm:text-[12.5px]">
                    {data.revisionLimit || "2x Revisi Minor"}
                  </span>
                </div>
              </div>
            )}

            {/* ── METODE PEMBAYARAN ── */}
            <div className="mb-6">
              <h3 className="text-[13px] sm:text-[14px] font-extrabold tracking-wider uppercase text-white mb-2.5">
                METODE PEMBAYARAN
              </h3>
              <div className="space-y-1.5 text-[12px] sm:text-[13px] text-white">
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">No Invoice</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-white tracking-wider">
                    {data.invoiceNo || "INV/202610/001"}
                  </span>
                </div>
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">Nama Klien</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-white">
                    {data.clientName || "Tim SAVR"}
                  </span>
                </div>
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">Status</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-white">
                    {data.status === "lunas"
                      ? "Lunas"
                      : `DP (Jatuh Tempo: ${data.dpDueDate || "-"})`}
                  </span>
                </div>
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">Payment Via</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-[#4ee0d2]">
                    {data.paymentVia || "BCA"}
                  </span>
                </div>
                {data.accountNumber ? (
                  <div className="flex items-center font-bold tracking-wide">
                    <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">No. Rekening</span>
                    <span className="mx-2 text-white/80 shrink-0">:</span>
                    <span className="font-mono font-semibold text-white tracking-wider">
                      {data.accountNumber}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center font-bold tracking-wide">
                  <span className="w-36 shrink-0 whitespace-nowrap uppercase text-white/90">Atas Nama</span>
                  <span className="mx-2 text-white/80 shrink-0">:</span>
                  <span className="font-semibold text-white">
                    {data.accountName || "Logia Creative"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER: Instagram & Website (Table Layout: 100% Sejajar & Bebas Potong) ── */}
          <div className="pt-4 border-t border-white/10 flex justify-center select-none">
            <table
              role="presentation"
              className="border-collapse text-[11px] sm:text-[12px] font-medium text-white/90"
              style={{
                borderSpacing: 0,
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td
                    className="p-0 align-middle pr-1.5"
                    style={{ verticalAlign: "middle" }}
                  >
                    <Instagram
                      className="w-3.5 h-3.5 text-white/90 shrink-0 block"
                      style={{ display: "block" }}
                    />
                  </td>
                  <td
                    className="p-0 align-middle pr-6 whitespace-nowrap"
                    style={{
                      verticalAlign: "middle",
                      lineHeight: "14px",
                    }}
                  >
                    logiacreative.studio
                  </td>
                  <td
                    className="p-0 align-middle pr-1.5"
                    style={{ verticalAlign: "middle" }}
                  >
                    <Globe
                      className="w-3.5 h-3.5 text-white/90 shrink-0 block"
                      style={{ display: "block" }}
                    />
                  </td>
                  <td
                    className="p-0 align-middle whitespace-nowrap"
                    style={{
                      verticalAlign: "middle",
                      lineHeight: "14px",
                    }}
                  >
                    logia-creative.vercel.app/
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);
