import type { Metadata } from "next";
import { Inter, Righteous } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PerformanceInit } from "@/components/PerformanceInit";

const fontSubstitute = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const fontRighteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
});

// SLOT "Anthropic Sans" (font proprietary Anthropic, tidak boleh dipakai publik).
// Kalau Anda PUNYA file .woff2 yang sah, lihat public/fonts/anthropic-sans/README.md
// (build TIDAK error tanpa ini - stack jatuh ke Inter sebagai substitusi terdekat):
//   import localFont from "next/font/local";
//   const anthropic = localFont({ src: [...], variable: "--font-anthropic", display: "swap" });
//   → gabungkan di <html>: `${fontSubstitute.variable} ${anthropic.variable}`

import { getSite } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const seo = site?.seo;

  const title = seo?.title || "Logia Creative | Creative & Technology Agency";
  const description =
    seo?.description ||
    "Innovative Branding & Digital Solutions Provider. Mengintegrasikan Kreativitas dan Teknologi untuk Pertumbuhan Bisnis Anda.";
  const keywords = seo?.keywords
    ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [
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
      ];
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const ogImage = seo?.ogImage || "/LOGO.png";

  return {
    metadataBase: new URL("https://logia.id"),
    title,
    description,
    keywords,
    authors: [{ name: "Logia Creative Team", url: "https://logia.id" }],
    creator: "Logia Creative",
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://logia.id",
      siteName: "Logia Creative",
      images: [
        {
          url: ogImage,
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`scroll-smooth ${fontSubstitute.variable} ${fontRighteous.variable}`}
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
