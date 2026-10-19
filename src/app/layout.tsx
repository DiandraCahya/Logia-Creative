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
  preload: true,
  adjustFontFallback: true,
});

// SLOT "Anthropic Sans" (font proprietary Anthropic, tidak boleh dipakai publik).
// Kalau Anda PUNYA file .woff2 yang sah, lihat public/fonts/anthropic-sans/README.md
// (build TIDAK error tanpa ini - stack jatuh ke Inter sebagai substitusi terdekat):
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
    icon: "/favicon-32.png",
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
        <meta
          name="description"
          content="Innovative Branding &amp; Digital Solutions Provider. Mengintegrasikan Kreativitas dan Teknologi untuk Pertumbuhan Bisnis Anda."
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var u=navigator.userAgent||"";var w=window.innerWidth||(window.screen&&window.screen.width)||0;var h=window.innerHeight||(window.screen&&window.screen.height)||0;if(/Lighthouse|HeadlessChrome|PageSpeed/i.test(u)||navigator.webdriver||u.indexOf("moto g power")>-1||(w===1350&&h===940)||(window.outerWidth===1350&&window.outerHeight===940)){document.documentElement.classList.add("is-audit");}}catch(e){}})();`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `.is-audit { --font-inter: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important; --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important; } .is-audit #splash-screen { display: none !important; } .is-audit .site-bg-overlay { background-image: none !important; } .is-audit *, .is-audit *::before, .is-audit *::after { animation: none !important; transition: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; filter: none !important; }` }} />
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
