"use client";

import React from "react";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Subtle dark backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay">
          <Image
            src="/modeGelap.webp"
            alt="Logia Backdrop"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center">
          <div className="relative w-28 h-8 mb-6">
            <Image
              src="/LOGO.webp"
              alt="Logia Creative Logo"
              fill
              className="object-contain invert"
            />
          </div>

          <div className="relative w-28 h-28 mb-4">
            <Image
              src="/logo3d.webp"
              alt="Logia 3D Mark"
              fill
              className="object-contain drop-shadow-[0_15px_30px_rgba(255,65,20,0.3)]"
            />
          </div>

          <h1 className="text-3xl font-bold mb-3 tracking-tight">Gangguan Aplikasi</h1>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Terjadi masalah tak terduga pada tata letak aplikasi. Silakan klik tombol di bawah untuk memuat ulang sistem.
          </p>

          <button
            onClick={() => reset()}
            className="px-6 py-3 min-h-[44px] rounded-full bg-white text-black font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#ff4114]"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </body>
    </html>
  );
}
