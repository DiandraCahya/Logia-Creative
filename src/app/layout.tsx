import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PerformanceInit } from "@/components/PerformanceInit";

// ─────────────────────────────────────────────────────────────────────────────
// FONT: satu sumber saja, `--font-sans`.
// Inter dimuat sebagai VARIABLE font (tanpa `weight`) → satu file, display swap,
// tidak ada CLS. Nama "Inter" tidak pernah ditulis di komponen; semuanya lewat
// `--font-sans` di globals.css, jadi ganti font = ganti satu blok di sini.
// ─────────────────────────────────────────────────────────────────────────────
const fontSubstitute = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
});

// SLOT "Anthropic Sans" (font proprietary Anthropic, tidak boleh dipakai publik).
// Kalau Anda PUNYA file .woff2 yang sah, lihat public/fonts/anthropic-sans/README.md
// (build TIDAK error tanpa ini — stack jatuh ke Inter sebagai substitusi terdekat):
//   import localFont from "next/font/local";
//   const anthropic = localFont({ src: [...], variable: "--font-anthropic", display: "swap" });
//   → gabungkan di <html>: `${fontSubstitute.variable} ${anthropic.variable}`

export const metadata: Metadata = {
  metadataBase: new URL("https://logia.id"),
  title: "Logia Creative | Creative & Technology Agency",
  description:
    "Innovative Branding & Digital Solutions Provider. Mengintegrasikan Kreativitas dan Teknologi untuk Pertumbuhan Bisnis Anda.",
  keywords: [
    "Logia Creative",
    "Creative Agency",
    "Technology Agency",
    "Branding",
    "UI/UX Design",
    "Web Development",
    "Workflow Automation",
    "Digital Solutions",
    "UMKM",
    "Startup",
  ],
  authors: [{ name: "Logia Creative Team", url: "https://logia.id" }],
  creator: "Logia Creative",
  openGraph: {
    title: "Logia Creative | Creative & Technology Agency",
    description:
      "Mengintegrasikan Kreativitas dan Teknologi untuk Bisnis yang Lebih Kuat. Solusi branding, web modern, dan otomatisasi alur kerja.",
    url: "https://logia.id",
    siteName: "Logia Creative",
    images: [
      {
        url: "/LOGO.png",
        width: 1200,
        height: 630,
        alt: "Logia Creative Brand Identity & Overview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/LOGO.png",
    apple: "/LOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`scroll-smooth ${fontSubstitute.variable}`}
    >
      <head>
        {/* Preload hero image directly */}
        <link rel="preload" href="/LUOGIA2.webp" as="image" type="image/webp" fetchPriority="high" />
        {/* DNS prefetch untuk Unsplash (portfolio images) */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans antialiased">
        <PerformanceInit />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
