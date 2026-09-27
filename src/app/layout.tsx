import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PerformanceInit } from "@/components/PerformanceInit";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body className={`${fontDisplay.variable} ${fontSans.variable} font-sans antialiased selection:bg-brand-primary selection:text-white`}>
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
