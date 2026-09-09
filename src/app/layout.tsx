import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
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
        url: "/image 2.png",
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
      <body className={`${fontSans.variable} font-sans antialiased selection:bg-brand-primary selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
