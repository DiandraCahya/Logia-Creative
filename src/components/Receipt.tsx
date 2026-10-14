"use client";
import React, { forwardRef } from "react";
import Image from "next/image";
import { formatIDR, RECEIPT_TERMS, type Receipt } from "@/lib/receipt";

// Struk satu halaman, standalone & elegan. Light-locked (kertas putih, teks
// gelap) TERLEPAS dari tema situs, supaya hasil cetak/PNG/PDF selalu sama.
// Font memakai token situs agar hasil export html2canvas identik dengan layar
// (lihat ensureFonts() di CollaborationModal sebelum export).
// ponytail: warna hardcoded (bukan var()) — struk tidak boleh ikut dark mode.
const INK = "#111111";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
      <span style={{ color: MUTED, fontSize: 12, letterSpacing: "0.02em" }}>{label}</span>
      <span style={{ color: INK, fontSize: strong ? 14 : 13, fontWeight: strong ? 600 : 500, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}

function Hairline() {
  return <div style={{ height: 1, background: LINE, width: "100%" }} aria-hidden="true" />;
}

export const ReceiptView = forwardRef<HTMLDivElement, { receipt: Receipt }>(
  function ReceiptView({ receipt }, ref) {
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "#ffffff",
          color: INK,
          fontFamily: "var(--font-sans)",
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          padding: "28px 26px",
          width: "100%",
          maxWidth: 520,
          margin: "0 auto",
          overflow: "hidden",
          pageBreakInside: "avoid",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {/* Header: logo + judul + nomor + tanggal */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ position: "relative", width: 76, height: 24, flexShrink: 0, marginTop: 2 }}>
            <Image
              src="/Group 3.png"
              alt="Logia Creative"
              fill
              sizes="76px"
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
              Struk Pemesanan
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: INK, wordBreak: "break-word" }}>
              {receipt.id}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: MUTED }}>{receipt.timestamp}</p>
          </div>
        </div>

        <div style={{ margin: "18px 0" }}><Hairline /></div>

        {/* Blok data klien */}
        <div style={{ display: "grid", gap: 8 }}>
          <Row label="Pelanggan" value={receipt.customer} />
          {receipt.brand ? <Row label="Brand / Usaha" value={receipt.brand} /> : null}
          <Row label="Kontak" value={receipt.contact} />
        </div>

        <div style={{ margin: "18px 0" }}><Hairline /></div>

        {/* Blok paket */}
        <div style={{ display: "grid", gap: 8 }}>
          <Row label="Paket" value={receipt.packageName} strong />
          {receipt.solutionName ? <Row label="Solusi" value={receipt.solutionName} /> : null}
          <Row label="Harga" value={receipt.priceLabel} />
        </div>

        {receipt.total != null && (
          <>
            <div style={{ margin: "18px 0" }}><Hairline /></div>
            <div style={{ display: "grid", gap: 8 }}>
              <Row label="Total" value={formatIDR(receipt.total)} strong />
              <Row label="DP 50%" value={formatIDR(receipt.dp!)} />
              <Row label="Sisa Pelunasan" value={formatIDR(receipt.sisa!)} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline", marginTop: 4 }}>
                <span style={{ color: MUTED, fontSize: 12 }}>Status</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: INK,
                    border: `1px solid ${LINE}`,
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {receipt.status}
                </span>
              </div>
            </div>
          </>
        )}

        <div style={{ margin: "18px 0" }}><Hairline /></div>

        {/* Catatan / syarat singkat */}
        <div style={{ display: "grid", gap: 5 }}>
          {RECEIPT_TERMS.map((t) => (
            <p key={t} style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5, color: MUTED }}>
              {t}
            </p>
          ))}
        </div>

        <div style={{ margin: "18px 0 12px" }}><Hairline /></div>

        {/* Footer kontak singkat */}
        <p style={{ margin: 0, fontSize: 10.5, color: MUTED, textAlign: "center", lineHeight: 1.6 }}>
          Logia Creative · logiacreative.id@gmail.com · +62 895-2137-5477
        </p>
      </div>
    );
  }
);