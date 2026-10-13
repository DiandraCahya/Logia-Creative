"use client";
import React, { forwardRef } from "react";
import Image from "next/image";
import { formatIDR, RECEIPT_TERMS, type Receipt } from "@/lib/receipt";

// Isolated receipt DOM: only this ref is screenshotted/exported.
// Light-locked (white bg, dark text) so PNG/PDF consistent in both themes.
export const ReceiptView = forwardRef<HTMLDivElement, { receipt: Receipt }>(
  function ReceiptView({ receipt }, ref) {
    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 rounded-xl border border-slate-200 p-6 text-sm w-full max-w-[480px] mx-auto"
        style={{ pageBreakInside: "avoid", overflow: "hidden", backgroundColor: "#ffffff", color: "#0f172a" }}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="relative w-24 h-7 shrink-0">
            <Image src="/Group 3.png" alt="Logo Logia Creative" fill className="object-contain" />
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-slate-500">Logia Creative</p>
            <p className="font-semibold text-base">Struk Pemesanan {receipt.id}</p>
            <p className="text-xs text-slate-500 tabular-nums">{receipt.timestamp}</p>
          </div>
        </div>
        <dl className="py-4 space-y-2 tabular-nums">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Pelanggan</dt><dd className="font-medium text-right">{receipt.customer}{receipt.brand ? ` (${receipt.brand})` : ""}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Paket</dt><dd className="font-medium text-right">{receipt.packageName}{receipt.solutionName ? ` · ${receipt.solutionName}` : ""}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Harga</dt><dd className="font-medium text-right">{receipt.priceLabel}</dd></div>
          {receipt.total != null && (
            <>
              <div className="flex justify-between gap-4 pt-2 border-b border-slate-100 pb-2"><dt className="text-slate-500">Total</dt><dd className="font-semibold text-right">{formatIDR(receipt.total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">DP 50%</dt><dd className="font-semibold text-right">{formatIDR(receipt.dp!)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Sisa</dt><dd className="font-semibold text-right">{formatIDR(receipt.sisa!)}</dd></div>
            </>
          )}
          <div className="flex justify-between gap-4 pt-2"><dt className="text-slate-500">Status</dt><dd className="font-semibold text-right">Menunggu DP</dd></div>
        </dl>
        <ul className="pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-500 list-disc list-inside">
          {RECEIPT_TERMS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    );
  }
);
